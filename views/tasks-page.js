import { LitElement, html, css, nothing, classMap, SignalWatcher } from "lit-bundle";
import { appSignals } from "@state/app-signals.js";

class TasksPage extends SignalWatcher(LitElement) {

	static properties = {
		activeTab: { type: String, state: true },
	};

	constructor() {
		super();
		this.activeTab = "pending";
	}

	createRenderRoot() {
		return this;
	}

	render() {
		const pending = appSignals.pendingTasks.get();
		const completed = appSignals.completedTasks.get();
		const tasks = this.activeTab === "pending" ? pending : completed;

		return html`
			<div class="tasks-page">
				<div class="tabs">
					<button class="tab" aria-selected=${this.activeTab === "pending"}
						@click=${() => this.activeTab = "pending"}>
						Pending (${pending.length})
					</button>
					<button class="tab" aria-selected=${this.activeTab === "completed"}
						@click=${() => this.activeTab = "completed"}>
						Completed (${completed.length})
					</button>
				</div>

				<div class="content">
					<form class="add-task-form" @submit=${this._handleAdd}>
						<label class="floating">
							<input type="text" name="title" placeholder=" " required>
							<span class="label-text">Add a new task...</span>
						</label>
						<button type="submit" class="primary rounded">Add</button>
					</form>

					${tasks.length === 0 ? html`
						<div class="empty-state">
							<p class="empty-title">No ${this.activeTab} tasks</p>
							<p class="empty-message">
								${this.activeTab === "pending"
									? "Add a task to get started!"
									: "Complete some tasks to see them here."}
							</p>
						</div>
					` : html`
						<div class="task-list">
							${tasks.map(task => html`
								<div class="task-card card">
									<div class="task-info">
										<button class="toggle-btn ${classMap({ completed: task.completed })}"
											@click=${() => this._toggleTask(task.id)}>
											${task.completed
												? html`<svg viewBox="0 0 24 24" fill="var(--color-primary)" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
												: html`<svg viewBox="0 0 24 24" fill="none" stroke="var(--grayscale-400)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`
											}
										</button>
										<span class="task-title ${classMap({ "task-done": task.completed })}">${task.title}</span>
									</div>
									<button class="delete-btn" @click=${() => this._deleteTask(task.id)}>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
										</svg>
									</button>
								</div>
							`)}
						</div>
					`}
				</div>
			</div>
		`;
	}

	async _handleAdd(e) {
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

	async _toggleTask(id) {
		await appSignals.toggleTask(id);
	}

	async _deleteTask(id) {
		await appSignals.deleteTask(id);

		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: "Task deleted", type: "info" }
		}));
	}
}

customElements.define("tasks-page", TasksPage);
