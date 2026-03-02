import { State, Computed } from "lit-bundle";
import { db } from "@state/db.js";

const MOCK_CATALOG = [
	{
		manufacturer: "LifeNet Health",
		product: "Soft Tissue Flexi Right Lateral Meniscus Frozen",
		model: "FMNRL",
		lotSerial: "L6548/S1235",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "Medtronic",
		product: "Spinal Fusion Cage PEEK Interbody",
		model: "SFC-22",
		lotSerial: "L8821/S4410",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "Stryker",
		product: "Triathlon Total Knee System CR",
		model: "TKS-CR7",
		lotSerial: "L3302/S7789",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "DePuy Synthes",
		product: "ATTUNE Knee Fixed Bearing Tibial Insert",
		model: "ATN-FB",
		lotSerial: "L4415/S2201",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "Zimmer Biomet",
		product: "Persona Revision Femoral Component",
		model: "PRS-FC3",
		lotSerial: "L9903/S5567",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "LifeNet Health",
		product: "Cortical Bone Allograft Strut",
		model: "CBA-STR",
		lotSerial: "L1120/S3344",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "Smith & Nephew",
		product: "COBLATION Wand SpeedBlade 90",
		model: "SB-90",
		lotSerial: "L5578/S6612",
		disposition: "Scanned To Patient",
	},
	{
		manufacturer: "Arthrex",
		product: "BioComposite SwiveLock Anchor 5.5mm",
		model: "SL-5.5",
		lotSerial: "L7741/S8890",
		disposition: "Scanned To Patient",
	},
];

const RFID_CATALOG = new Map([
	["E00401501211A76A", MOCK_CATALOG[0]], // LifeNet Health - Soft Tissue Flexi
	["E00401501211B82C", MOCK_CATALOG[1]], // Medtronic - Spinal Fusion Cage
	["E00401501211C93D", MOCK_CATALOG[2]], // Stryker - Triathlon Total Knee
	["E00401501211D04E", MOCK_CATALOG[3]], // DePuy Synthes - ATTUNE Knee
	["E00401501211E15F", MOCK_CATALOG[4]], // Zimmer Biomet - Persona Revision
	["E00401501211F260", MOCK_CATALOG[5]], // LifeNet Health - Cortical Bone
	["E00401501211A371", MOCK_CATALOG[6]], // Smith & Nephew - COBLATION Wand
	["E00401501211B482", MOCK_CATALOG[7]], // Arthrex - BioComposite SwiveLock
]);

class AppSignals {
	products = new State([]);
	loading = new State(false);
	readerActive = new State(true);

	totalScanned = new Computed(() => {
		return this.products.get().length;
	});

	async fetchProducts() {
		this.loading.set(true);
		try {
			const products = await db.products.getAll();
			this.products.set(products);
		} catch (e) {
			console.error("Failed to fetch products:", e);
		} finally {
			this.loading.set(false);
		}
	}

	async addProduct(product) {
		const id = await db.products.add({
			...product,
			scannedAt: new Date().toISOString(),
		});
		const saved = await db.products.get(id);
		this.products.set([...this.products.get(), saved]);
		return saved;
	}

	async deleteProduct(id) {
		await db.products.delete(id);
		this.products.set(this.products.get().filter(p => p.id !== id));
	}

	async resolveRfidTag(tagId) {
		const normalized = tagId.toUpperCase().trim();
		const item = RFID_CATALOG.get(normalized);
		if (!item) {
			document.dispatchEvent(new CustomEvent("show-toast", {
				detail: { message: `Unknown RFID tag: ${normalized}`, type: "error" },
			}));
			return null;
		}
		const product = await this.addProduct({
			manufacturer: item.manufacturer,
			product: item.product,
			model: item.model,
			lotSerial: item.lotSerial,
			his: "",
			disposition: item.disposition,
		});
		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: `Scanned: ${item.manufacturer} - ${item.product}`, type: "success" },
		}));
		return product;
	}

	async simulateScan() {
		const item = MOCK_CATALOG[Math.floor(Math.random() * MOCK_CATALOG.length)];
		const product = await this.addProduct({
			manufacturer: item.manufacturer,
			product: item.product,
			model: item.model,
			lotSerial: item.lotSerial,
			his: "",
			disposition: item.disposition,
		});
		document.dispatchEvent(new CustomEvent("show-toast", {
			detail: { message: "Product scanned successfully", type: "success" },
		}));
		return product;
	}
}

export const appSignals = new AppSignals();
