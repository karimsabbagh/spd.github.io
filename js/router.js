import { html } from "lit-bundle";
import { BASE } from "config";

export const routes = [
	{ path: `${BASE}/`, name: "home", render: () => html`<home-page data-page="home"></home-page>` },
	{ path: `${BASE}/tasks`, name: "tasks", hasNavigation: true, title: "Tasks", render: () => html`<tasks-page data-page="tasks"></tasks-page>` },
	{ path: `${BASE}/settings`, name: "settings", hasNavigation: true, title: "Settings", render: () => html`<settings-page data-page="settings"></settings-page>` },
];

export class Router {
	shouldNotIntercept = (navigationEvent) => {
		return (
			!navigationEvent.canIntercept ||
			navigationEvent.hashChange ||
			navigationEvent.downloadRequest
		);
	}

	currentRoute;

	constructor(host, routes = []) {
		(this.host = host).addController(this);

		navigation.addEventListener("navigate", (event) => {
			if (this.shouldNotIntercept(event)) return;

			const url = new URL(event.destination.url);
			const scope = this;

			routes.forEach(route => {
				let matches = false;
				let routeParams = {};

				if (route.path && url.pathname === route.path) {
					matches = true;
				} else if (route.pathPattern) {
					const match = url.pathname.match(route.pathPattern);
					if (match) {
						matches = true;
						if (match.length > 1) {
							routeParams.param = match[1];
						}
					}
				}

				if (matches) {
					event.intercept({
						async handler() {
							if (route.enter) await route.enter(routeParams);
							scope.currentRoute = route;
							scope.currentRoute.params = routeParams;
							scope.host.requestUpdate();
						},
					});
				}
			});
		});
	}

	hostConnected() {}
	hostDisconnected() {}
}
