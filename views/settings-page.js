import { LitElement, html, css, SignalWatcher } from "lit-bundle";

class SettingsPage extends SignalWatcher(LitElement) {

	createRenderRoot() {
		return this;
	}

	render() {
		return html`
			<div class="settings-page">
				<section>
					<div class="section-head">
						<h2 class="section-title">General</h2>
					</div>
					<div class="section-body">
						<div class="settings-item card">
							<span class="settings-label">App Version</span>
							<span class="settings-value">1.0.0</span>
						</div>
						<div class="settings-item card">
							<span class="settings-label">Theme</span>
							<span class="settings-value">System</span>
						</div>
					</div>
				</section>

				<section>
					<div class="section-head">
						<h2 class="section-title">About</h2>
					</div>
					<div class="section-body">
						<div class="settings-item card">
							<span class="settings-label">Built with</span>
							<span class="settings-value">Lit</span>
						</div>
						<div class="settings-item card">
							<span class="settings-label">Storage</span>
							<span class="settings-value">IndexedDB</span>
						</div>
					</div>
				</section>
			</div>
		`;
	}
}

customElements.define("settings-page", SettingsPage);
