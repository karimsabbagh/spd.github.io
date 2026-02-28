import { LitElement, html, css } from "lit-bundle";

class ToastNotification extends LitElement {

	static properties = {
		toasts: { type: Array, state: true }
	};

	constructor() {
		super();
		this.toasts = [];
		this.nextId = 0;
		this._handleShowToast = this._handleShowToast.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		document.addEventListener("show-toast", this._handleShowToast);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener("show-toast", this._handleShowToast);
	}

	static styles = css`
		:host {
			position: fixed;
			top: 20px;
			right: 20px;
			z-index: 9999;
			display: flex;
			flex-direction: column;
			gap: 12px;
			pointer-events: none;
		}

		.toast {
			min-width: 300px;
			max-width: 500px;
			padding: 16px 20px;
			border-radius: 12px;
			color: white;
			font: var(--font-body-medium-bold);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
			display: flex;
			align-items: center;
			gap: 12px;
			animation: slideIn 0.3s ease-out;
			pointer-events: auto;
			cursor: pointer;
		}

		.toast.removing {
			animation: slideOut 0.3s ease-in forwards;
		}

		.toast-message { flex: 1; line-height: 1.4; }

		.toast-close {
			background: none;
			border: none;
			color: white;
			font-size: 20px;
			cursor: pointer;
			padding: 0;
			width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			transition: background 0.2s;
			flex-shrink: 0;
		}

		.toast-close:hover { background: rgba(255, 255, 255, 0.2); }

		.toast.success { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
		.toast.error { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); }
		.toast.warning { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
		.toast.info { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); }

		@keyframes slideIn {
			from { transform: translateX(120%); opacity: 0; }
			to { transform: translateX(0); opacity: 1; }
		}

		@keyframes slideOut {
			from { transform: translateX(0); opacity: 1; }
			to { transform: translateX(120%); opacity: 0; }
		}
	`;

	_handleShowToast(event) {
		const { message, type = "info", duration = 4000 } = event.detail;
		this.showToast(message, type, duration);
	}

	showToast(message, type = "info", duration = 4000) {
		const id = this.nextId++;
		const toast = { id, message, type, duration };
		this.toasts = [...this.toasts, toast];

		if (duration > 0) {
			setTimeout(() => this.removeToast(id), duration);
		}
	}

	removeToast(id) {
		const toastElement = this.shadowRoot?.querySelector(`[data-toast-id="${id}"]`);
		if (toastElement) {
			toastElement.classList.add("removing");
			setTimeout(() => {
				this.toasts = this.toasts.filter(t => t.id !== id);
			}, 300);
		} else {
			this.toasts = this.toasts.filter(t => t.id !== id);
		}
	}

	render() {
		return html`
			${this.toasts.map(toast => html`
				<div class="toast ${toast.type}" data-toast-id="${toast.id}"
					@click=${() => this.removeToast(toast.id)}>
					<div class="toast-message">${toast.message}</div>
					<button class="toast-close"
						@click=${(e) => { e.stopPropagation(); this.removeToast(toast.id); }}
						aria-label="Close">&times;</button>
				</div>
			`)}
		`;
	}
}

customElements.define("toast-notification", ToastNotification);
