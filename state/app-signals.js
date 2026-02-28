import { State, Computed } from "lit-bundle";
import { db } from "@state/db.js";

class AppSignals {
	tasks = new State([]);
	loading = new State(false);

	pendingTasks = new Computed(() => {
		return this.tasks.get().filter(t => !t.completed);
	});

	completedTasks = new Computed(() => {
		return this.tasks.get().filter(t => t.completed);
	});

	async fetchTasks() {
		this.loading.set(true);
		try {
			const tasks = await db.tasks.getAll();
			this.tasks.set(tasks);
		} catch (e) {
			console.error("Failed to fetch tasks:", e);
		} finally {
			this.loading.set(false);
		}
	}

	async addTask(title) {
		const id = await db.tasks.add({
			title,
			completed: false,
			createdAt: new Date().toISOString(),
		});
		const task = await db.tasks.get(id);
		this.tasks.set([...this.tasks.get(), task]);
		return task;
	}

	async toggleTask(id) {
		const task = this.tasks.get().find(t => t.id === id);
		if (!task) return;
		await db.tasks.put({ ...task, completed: !task.completed });
		this.tasks.set(this.tasks.get().map(t =>
			t.id === id ? { ...t, completed: !t.completed } : t
		));
	}

	async deleteTask(id) {
		await db.tasks.delete(id);
		this.tasks.set(this.tasks.get().filter(t => t.id !== id));
	}
}

export const appSignals = new AppSignals();
