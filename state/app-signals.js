import { State, Computed } from "lit-bundle";
import { db } from "@state/db.js";
import { fetchProductsCatalog } from "@state/mock-api.js";

class AppSignals {
	scans = new State([]);
	catalogProducts = new State([]);
	loading = new State(false);
	readerActive = new State(true);

	totalScanned = new Computed(() => {
		return this.scans.get().length;
	});

	async fetchScans() {
		this.loading.set(true);
		try {
			const scans = await db.scans.getAll();
			this.scans.set(scans);
		} catch (e) {
			console.error("Failed to fetch scans:", e);
		} finally {
			this.loading.set(false);
		}
	}

	async fetchCatalog() {
		try {
			const products = await fetchProductsCatalog();
			products[0].rfid = "E00401501211A76A";
			await db.products.clear();
			for (const product of products) {
				await db.products.add(product);
			}
			const saved = await db.products.getAll();
			this.catalogProducts.set(saved);
		} catch (e) {
			console.error("Failed to fetch catalog:", e);
			// Network failed — fall back to existing IndexedDB data
			const existing = await db.products.getAll();
			this.catalogProducts.set(existing);
		}
	}

	async addScan(scan) {
		const id = await db.scans.add({
			...scan,
			scannedAt: new Date().toISOString(),
		});
		const saved = await db.scans.get(id);
		this.scans.set([...this.scans.get(), saved]);
		return saved;
	}

	async deleteScan(id) {
		await db.scans.delete(id);
		this.scans.set(this.scans.get().filter(p => p.id !== id));
	}

	async resolveRfidTag(tagId) {
		const normalized = tagId.toUpperCase().trim();
		console.log("Scanned RFID tag:", normalized);
		const item = await db.products.getByRfid(normalized);
		if (!item) {
			document.dispatchEvent(new CustomEvent("show-toast", {
				detail: { message: `Unknown RFID tag: ${normalized}`, type: "error" },
			}));
			return null;
		}
		const scan = await this.addScan({
			manufacturer: item.manufacturer,
			product: item.product,
			model: item.model,
			lotSerial: item.lotSerial,
			his: item.his || "",
			disposition: item.disposition,
		});
		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: `Scanned: ${item.manufacturer} - ${item.product}`, type: "success" },
		}));
		return scan;
	}

	async simulateScan() {
		const catalog = this.catalogProducts.get();
		if (catalog.length === 0) {
			document.dispatchEvent(new CustomEvent("show-toast", {
				detail: { message: "Catalog not loaded yet", type: "error" },
			}));
			return null;
		}
		const item = catalog[Math.floor(Math.random() * catalog.length)];
		const scan = await this.addScan({
			manufacturer: item.manufacturer,
			product: item.product,
			model: item.model,
			lotSerial: item.lotSerial,
			his: item.his || "",
			disposition: item.disposition,
		});
		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: "Product scanned successfully", type: "success" },
		}));
		return scan;
	}
}

export const appSignals = new AppSignals();
