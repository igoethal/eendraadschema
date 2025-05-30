import { deepClone } from "../general";

export class MultiLevelStorage<T> {
    private data: T;
    private memoryData: T;
    private storageKey: string;

    constructor(storageKey: string, initialData: T) {
        this.storageKey = storageKey;
        // Load data from storage or initialize with default data
        this.data = this.loadFromStorage() || deepClone(initialData);
        this.memoryData = deepClone(initialData);
    }

    // Load data from localStorage
    private loadFromStorage(): T | null {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : null;
    }

    // Save data to localStorage
    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    // Get a value at a specific path (e.g., "user.profile.name")
    get(path: string): any {
        const keys = path.split('.');
        let current: any = this.memoryData;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                current = undefined;
                break;
            }
        }

        if (current !== undefined) {
            return current;
        }

        current = this.data;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined; // Path not found
            }
        }
        return current;
    }

    // Set a value at a specific path (e.g., "user.profile.name", "John Doe")
    set(path: string, value: any, inMemory: boolean = false): void {
        const keys = path.split('.');
        let current: any = inMemory ? this.memoryData : this.data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {}; // Create nested objects if they don't exist
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value; // Set the value at the final key

        if (!inMemory) {
            this.saveToStorage(); // Save updated data to storage
        }
    }

    // Delete a node at a specific path (e.g., "user.profile.name")
    delete(path: string): void {
        const keys = path.split('.');
        let current: any = this.memoryData;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                break; // Path not found, nothing to delete
            }
            current = current[key];
        }

        delete current[keys[keys.length - 1]]; // Delete the key

        current = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                return; // Path not found, nothing to delete
            }
            current = current[key];
        }

        delete current[keys[keys.length - 1]]; // Delete the key
        this.saveToStorage(); // Save updated data to storage
    }

    // Get the entire data object
    getAll(): T {
        return { ...this.data, ...this.memoryData };
    }

    // Clear the entire data and storage
    clear(): void {
        this.data = {} as T;
        this.memoryData = {} as T;
        localStorage.removeItem(this.storageKey);
    }
}