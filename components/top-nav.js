import { LitElement, html, css } from "lit-bundle";

class TopNav extends LitElement {

	static properties = {
		title: { type: String }
	}

	static styles = css`
		:host {
			display: grid;
			grid-template: "back title spacer" auto / auto 1fr auto;
			align-items: center;
			gap: 15px;
		}

		.page-title {
			font: var(--font-h4);
			font-weight: bold;
			grid-area: title;
		}

		.back {
			cursor: pointer;
			display: flex;
			align-items: center;
		}

		.back svg {
			width: 24px;
			height: 24px;
		}
	`;

	render() {
		return html`
			<div class="back" @click=${() => navigation.back()}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</div>
			<span class="page-title">${this.title}</span>
			<span></span>
		`;
	}
}

customElements.define("top-nav", TopNav);
