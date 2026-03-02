const DB_NAME = "spd";
const DB_VERSION = 2;

function open() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (db.objectStoreNames.contains("tasks")) {
				db.deleteObjectStore("tasks");
			}
			if (!db.objectStoreNames.contains("products")) {
				db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
			}
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

export const db = {
	products: {
		getAll: () => tx("products", "readonly", (s) => s.getAll()),
		get: (id) => tx("products", "readonly", (s) => s.get(id)),
		add: (item) => tx("products", "readwrite", (s) => s.add(item)),
		put: (item) => tx("products", "readwrite", (s) => s.put(item)),
		delete: (id) => tx("products", "readwrite", (s) => s.delete(id)),
	},
};
window.db = db;
