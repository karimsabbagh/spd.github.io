import { LitElement, html, nothing, classMap, SignalWatcher } from "lit-bundle";
import { Router, routes } from "@js/router.js";
import { appSignals } from "@state/app-signals.js";
import { BASE } from "config";

import "@components/top-nav.js";
import "@components/toast-notification.js";

import "@views/home-page.js";
import "@views/tasks-page.js";
import "@views/settings-page.js";

const homeIcon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`;
const tasksIcon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`;
const settingsIcon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`;

class RootApp extends SignalWatcher(LitElement) {

	constructor() {
		super();

		this.tabs = [
			{ name: "home", path: `${BASE}/`, icon: homeIcon },
			{ name: "tasks", path: `${BASE}/tasks`, icon: tasksIcon },
			{ name: "settings", path: `${BASE}/settings`, icon: settingsIcon },
		];

		this.router = new Router(this, routes);
	}

	createRenderRoot() {
		return this;
	}

	async connectedCallback() {
		super.connectedCallback();
		await appSignals.fetchTasks();

		if (window.location.pathname === `${BASE}/`) {
			navigation.navigate(`${BASE}/`);
		}

		// Register service worker
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("./sw.js").catch(console.error);
		}
	}

	footerTemplate() {
		const showNavigation = ["home", "tasks", "settings"].includes(this.router.currentRoute?.name);
		if (showNavigation) {
			return html`
				<nav>
					${this.tabs.map(tab => this.tabTemplate(tab))}
				</nav>
			`;
		}
		return nothing;
	}

	tabTemplate(tab) {
		return html`
			<a href=${tab.path} class=${classMap({ active: tab.name === this.router.currentRoute?.name })}>
				${tab.icon}
				<span>${tab.name}</span>
			</a>
		`;
	}

	render() {
		return html`
			<main ?inner=${this.router.currentRoute?.hasNavigation}>
				<top-nav title=${this.router.currentRoute?.title || ""}></top-nav>
				${this.router.currentRoute?.render()}
			</main>
			${this.footerTemplate()}
			<toast-notification></toast-notification>
		`;
	}
}

customElements.define("root-app", RootApp);
