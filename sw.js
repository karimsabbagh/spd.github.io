// Service Worker

const CACHE_NAME = "spd-static-v4";
const ASSETS_TO_CACHE = [
	"./",
	"./index.html",
	"./manifest.json",
	"./css/variables.css",
	"./css/general.css",
	"./css/buttons.css",
	"./css/form.css",
	"./css/app.css",
	"./css/root-app.css",
	"./js/lit.all.bundle.js",
	"./js/router.js",
	"./views/root-app.js",
	"./views/home-page.js",
	"./components/toast-notification.js",
	"./state/app-signals.js",
	"./state/db.js",
	"./state/mock-api.js",
	"./fonts/open-sans-var.woff2",
];

self.addEventListener("install", (event) => {
	console.log("[SW] Service Worker installed");
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("[SW] Service Worker activated");
	event.waitUntil(
		caches.keys().then((names) =>
			Promise.all(
				names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
			)
		).then(() => clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.mode === "navigate") {
		event.respondWith(
			fetch(event.request).catch(() => caches.match("./index.html"))
		);
		return;
	}

	event.respondWith(
		fetch(event.request).then((response) => {
			if (response.ok) {
				const clone = response.clone();
				caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
			}
			return response;
		}).catch(() => caches.match(event.request))
	);
});

self.addEventListener("push", (event) => {
	let data = {
		title: "SPD Notification",
		body: "You have a new notification",
		icon: "./assets/icons/icon-192.png",
		data: {}
	};

	if (event.data) {
		try {
			data = { ...data, ...event.data.json() };
		} catch (e) {
			console.error("[SW] Error parsing push data:", e);
		}
	}

	const options = {
		body: data.body,
		icon: data.icon || "./assets/icons/icon-192.png",
		vibrate: [100, 50, 100],
		data: data.data || {},
		tag: data.tag || "default",
	};

	event.waitUntil(
		self.registration.showNotification(data.title, options)
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const BASE = "/spd.github.io";
	let targetUrl = `${BASE}/`;

	event.waitUntil(
		clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if (client.url.includes(self.location.origin) && "focus" in client) {
					client.focus();
					client.navigate(targetUrl);
					return;
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(targetUrl);
			}
		})
	);
});
