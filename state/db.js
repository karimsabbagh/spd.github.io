const DB_NAME = "spd";
const DB_VERSION = 4;

function open() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (db.objectStoreNames.contains("tasks")) {
				db.deleteObjectStore("tasks");
			}
			if (db.objectStoreNames.contains("products")) {
				db.deleteObjectStore("products");
			}
			if (!db.objectStoreNames.contains("scans")) {
				db.createObjectStore("scans", { keyPath: "id", autoIncrement: true });
			}
			const productStore = db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
			productStore.createIndex("rfid", "rfid", { unique: true });
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function tx(store, mode, fn) {
	return open().then(db => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(store, mode);
			const result = fn(transaction.objectStore(store));
			transaction.oncomplete = () => resolve(result.result);
			transaction.onerror = () => reject(transaction.error);
		});
	});
}

function createAccessor(storeName) {
	return {
		getAll: () => tx(storeName, "readonly", (s) => s.getAll()),
		get: (id) => tx(storeName, "readonly", (s) => s.get(id)),
		add: (item) => tx(storeName, "readwrite", (s) => s.add(item)),
		put: (item) => tx(storeName, "readwrite", (s) => s.put(item)),
		delete: (id) => tx(storeName, "readwrite", (s) => s.delete(id)),
		clear: () => tx(storeName, "readwrite", (s) => s.clear()),
	};
}

export const db = {
	scans: createAccessor("scans"),
	products: {
		...createAccessor("products"),
		getByRfid: (rfid) => tx("products", "readonly", (s) => s.index("rfid").get(rfid)),
	},
};
window.db = db;
