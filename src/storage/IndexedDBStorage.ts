/**
 * @class
 * @name IndexedDBStorage
 * @description
 * Een klasse om data op te slaan in indexedDB.
 *
 * @constructor
 * @param {string} dbName - De naam van de database.
 * @param {string} storeName - De naam van de store.
 */
class IndexedDBStorage {
    private dbName: string; // Naam van de database
    private storeName: string; // Naam van de store

    /**
     * @constructor
     * @param {string} dbName - De naam van de database.
     * @param {string} storeName - De naam van de store.
     */
    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    /**
     * Open de database en maak deze gereed voor gebruik.
     * @private
     * @returns {Promise<IDBDatabase | null>}
     */
    private async openDB(): Promise<IDBDatabase | null> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "key" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    }

    /**
     * Schrijf data naar de store.
     * @param {string} key - De sleutel van de data.
     * @param {string} value - De waarde van de data.
     * @returns {Promise<boolean>}
     */
    async set(key: string, value: string): Promise<boolean> {
        const startTime = performance.now();

        try {
            const db = await this.openDB();
            if (!db) return false;

            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, "readwrite");
                const store = transaction.objectStore(this.storeName);

                const request = store.put({ key, value });

                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false);
            });
        } catch (error) {
            console.error(`Error in IndexedDBStorage.set: ${error}`);
            return false;
        }
    }

    /**
     * Lees data uit de store.
     * @param {string} key - De sleutel van de data.
     * @returns {Promise<string | null>}
     */
    async get(key: string): Promise<string | null> {
        try {
            const db = await this.openDB();
            if (!db) return null;

            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, "readonly");
                const store = transaction.objectStore(this.storeName);

                const request = store.get(key);

                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result.value);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => resolve(null);
            });
        } catch (error) {
            console.error("Error accessing IndexedDB:", error);
            return null;
        }
    }
}
