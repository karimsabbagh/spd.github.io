import { html } from "lit-bundle";
import { BASE } from "config";

export const routes = [
	{
		name: "home",
		pattern: new URLPattern({ pathname: `${BASE}/` }),
		render: () => html`<home-page data-page="home"></home-page>`,
	},
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

			const url = event.destination.url;
			const scope = this;

			for (const route of routes) {
				const match = route.pattern.exec(url);
				if (match) {
					event.intercept({
						async handler() {
							if (route.enter) await route.enter(match);
							scope.currentRoute = route;
							scope.currentRoute.params = match.pathname.groups;
							scope.host.requestUpdate();
						},
					});
					break;
				}
			}
		});
	}

	matchCurrentURL(routes) {
		const url = window.location.href;
		for (const route of routes) {
			if (route.pattern.test(url)) {
				return route;
			}
		}
		return null;
	}

	hostConnected() {}
	hostDisconnected() {}
}
