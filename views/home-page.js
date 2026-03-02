import { LitElement, html, nothing, SignalWatcher } from "lit-bundle";
import { appSignals } from "@state/app-signals.js";

const scannerIcon = html`
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="8" y="8" width="64" height="48" rx="4" stroke="#9ca3af" stroke-width="2.5" fill="none"/>
	<rect x="16" y="16" width="48" height="32" rx="2" stroke="#9ca3af" stroke-width="1.5" fill="#f3f4f6"/>
	<line x1="24" y1="28" x2="56" y2="28" stroke="#d1d5db" stroke-width="1.5"/>
	<line x1="24" y1="34" x2="48" y2="34" stroke="#d1d5db" stroke-width="1.5"/>
	<line x1="24" y1="40" x2="52" y2="40" stroke="#d1d5db" stroke-width="1.5"/>
	<path d="M20 60 L20 72 L32 72" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
	<path d="M60 60 L60 72 L48 72" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
	<line x1="26" y1="66" x2="54" y2="66" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
</svg>`;

class HomePage extends SignalWatcher(LitElement) {

	_rfidBuffer = "";
	_rfidTimeout = null;

	createRenderRoot() {
		return this;
	}

	connectedCallback() {
		super.connectedCallback();
		this._onKeyDown = this._handleRfidKeyDown.bind(this);
		document.addEventListener("keydown", this._onKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener("keydown", this._onKeyDown);
		clearTimeout(this._rfidTimeout);
	}

	_handleRfidKeyDown(e) {
		const focused = document.activeElement;
		if (focused && (focused.tagName === "INPUT" || focused.tagName === "TEXTAREA")) {
			return;
		}

		const key = e.key.toUpperCase();

		if (key === "ENTER" && this._rfidBuffer.length > 0) {
			e.preventDefault();
			this._completeScan();
			return;
		}

		if (/^[0-9A-F]$/.test(key)) {
			e.preventDefault();
			this._rfidBuffer += key;
			clearTimeout(this._rfidTimeout);
			this._rfidTimeout = setTimeout(() => this._completeScan(), 100);
		}
	}

	_completeScan() {
		clearTimeout(this._rfidTimeout);
		const tagId = this._rfidBuffer;
		this._rfidBuffer = "";
		if (tagId.length > 0) {
			appSignals.resolveRfidTag(tagId);
		}
	}

	render() {
		const products = appSignals.products.get();
		const totalScanned = appSignals.totalScanned.get();
		const readerActive = appSignals.readerActive.get();

		return html`
			<div class="disposition-page">
				<div class="location-bar">
					<span>SM OR 02 (OR)</span>
				</div>

				<div class="title-row">
					<h2>Disposition Products</h2>
					<span class="total-scanned">Total Scanned: <strong>${totalScanned}</strong></span>
				</div>

				${products.length === 0
					? html`
						<div class="empty-state">
							${scannerIcon}
							<p>Please scan a product to disposition</p>
						</div>
					`
					: html`
						<div class="table-wrapper">
							<table class="scan-table">
								<thead>
									<tr>
										<th>Manufacturer</th>
										<th>Product</th>
										<th>Model</th>
										<th>Lot/Serial</th>
										<th>HIS</th>
										<th>Disposition</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									${products.map(p => html`
										<tr>
											<td>${p.manufacturer}</td>
											<td>${p.product}</td>
											<td>${p.model}</td>
											<td>${p.lotSerial}</td>
											<td>${p.his || "—"}</td>
											<td>${p.disposition}</td>
											<td>
												<button class="delete-btn" @click=${() => this._deleteProduct(p.id)} title="Delete">
													<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
														<path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
														<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
													</svg>
												</button>
											</td>
										</tr>
									`)}
								</tbody>
							</table>
						</div>
					`
				}

				<div class="reader-status">
					<span class="status-dot ${readerActive ? "active" : ""}"></span>
					<span>Reader is ${readerActive ? "Active" : "Inactive"}</span>
				</div>

				<button class="simulate-scan-btn" @click=${this._simulateScan} title="Simulate RFID Scan">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
						<path d="M2 10V6a2 2 0 012-2h4"/>
						<path d="M14 4h4a2 2 0 012 2v4"/>
						<path d="M22 14v4a2 2 0 01-2 2h-4"/>
						<path d="M10 20H6a2 2 0 01-2-2v-4"/>
						<line x1="7" y1="12" x2="17" y2="12"/>
					</svg>
					Scan
				</button>
			</div>
		`;
	}

	async _simulateScan() {
		await appSignals.simulateScan();
	}

	async _deleteProduct(id) {
		await appSignals.deleteProduct(id);
		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: "Product removed", type: "info" },
		}));
	}
}

customElements.define("home-page", HomePage);
