export class LocalStorageService<T> {
    private storageKey: string;
  
    constructor(key: string) {
      this.storageKey = key;
    }
  
    // Save an array of objects to localStorage
    public save(items: T[]): void {
      try {
        const serializedData = JSON.stringify(items);
        localStorage.setItem(this.storageKey, serializedData);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  
    // Retrieve array of objects from localStorage
    public get(): T[] {
      try {
        const serializedData = localStorage.getItem(this.storageKey);
        return serializedData ? JSON.parse(serializedData) : [];
      } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return [];
      }
    }
  
    // Add a single object to the existing array
    public add(item: T): void {
      const items = this.get();
      items.push(item);
      this.save(items);
    }
  
    // Update an object in the array by matching a specific property
    public update<K extends keyof T>(key: K, value: T[K], updatedItem: T): void {
      const items = this.get();
      const index = items.findIndex(item => item[key] === value);
      if (index !== -1) {
        items[index] = updatedItem;
        this.save(items);
      }
    }
  
    // Delete an object from the array by matching a specific property
    public delete<K extends keyof T>(key: K, value: T[K]): void {
      const items = this.get();
      const filteredItems = items.filter(item => item[key] !== value);
      this.save(filteredItems);
    }
  
    // Clear all data for this storage key
    public clear(): void {
      localStorage.removeItem(this.storageKey);
    }
  }