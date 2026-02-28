import { LitElement, html, css, nothing, SignalWatcher } from "lit-bundle";
import { appSignals } from "@state/app-signals.js";
import { BASE } from "config";

class HomePage extends SignalWatcher(LitElement) {

	createRenderRoot() {
		return this;
	}

	render() {
		const pending = appSignals.pendingTasks.get();
		const completed = appSignals.completedTasks.get();

		return html`
			<div class="home-page">
				<section class="hero">
					<h1>Welcome to SPD</h1>
					<p>Your simple task manager PWA</p>
				</section>

				<section>
					<div class="section-head">
						<h2 class="section-title">Overview</h2>
					</div>
					<div class="stats-grid">
						<div class="stat-card">
							<span class="stat-value">${pending.length}</span>
							<span class="stat-label">Pending</span>
						</div>
						<div class="stat-card">
							<span class="stat-value">${completed.length}</span>
							<span class="stat-label">Completed</span>
						</div>
						<div class="stat-card">
							<span class="stat-value">${pending.length + completed.length}</span>
							<span class="stat-label">Total</span>
						</div>
					</div>
				</section>

				<section>
					<div class="section-head">
						<h2 class="section-title">Quick Add</h2>
					</div>
					<form @submit=${this._handleQuickAdd}>
						<label class="floating">
							<input type="text" name="title" placeholder=" " required>
							<span class="label-text">New task...</span>
						</label>
						<button type="submit" class="primary rounded">Add Task</button>
					</form>
				</section>

				${pending.length > 0 ? html`
					<section>
						<div class="section-head">
							<h2 class="section-title">Recent Tasks</h2>
							<a href="${BASE}/tasks" class="section-link">See all</a>
						</div>
						<div class="section-body">
							${pending.slice(0, 3).map(task => html`
								<div class="task-preview card" @click=${() => navigation.navigate(`${BASE}/tasks`)}>
									<span class="task-title">${task.title}</span>
								</div>
							`)}
						</div>
					</section>
				` : nothing}
			</div>
		`;
	}

	async _handleQuickAdd(e) {
		e.preventDefault();
		const form = e.target;
		const title = form.title.value.trim();
		if (!title) return;

		await appSignals.addTask(title);
		form.reset();

		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: "Task added!", type: "success" }
		}));
	}
}

customElements.define("home-page", HomePage);
