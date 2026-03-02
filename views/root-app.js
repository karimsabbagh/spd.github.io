import { LitElement, html, SignalWatcher } from "lit-bundle";
import { Router, routes } from "@js/router.js";
import { appSignals } from "@state/app-signals.js";
import { BASE } from "config";

import "@components/toast-notification.js";
import "@views/home-page.js";

class RootApp extends SignalWatcher(LitElement) {

	constructor() {
		super();
		this.router = new Router(this, routes);
	}

	createRenderRoot() {
		return this;
	}

	connectedCallback() {
		super.connectedCallback();
		appSignals.fetchProducts();

		this.router.currentRoute = this.router.matchCurrentURL(routes) || routes[0];
		this.requestUpdate();

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("./sw.js").catch(console.error);
		}
	}

	render() {
		return html`
			<main>
				${this.router.currentRoute?.render()}
			</main>
			<toast-notification></toast-notification>
		`;
	}
}

customElements.define("root-app", RootApp);
