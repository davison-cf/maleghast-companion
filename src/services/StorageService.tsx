import { IMass } from "../models";

const storageService = {
  DB_NAME: 'massesDatabase',
  DB_VERSION: 1,
  STORE_NAME: 'masses',
  
  openDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(storageService.DB_NAME, storageService.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storageService.STORE_NAME)) {
          db.createObjectStore(storageService.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  },
  
  saveMass: async (mass: IMass): Promise<string> => {
    // Generate ID if needed
    if (!mass.id) {
      mass.id = Date.now().toString();
    }
    
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storageService.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(storageService.STORE_NAME);
      const request = store.put(mass);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(mass.id as string);
      
      transaction.oncomplete = () => db.close();
    });
  },
  
  loadAllMasses: async (): Promise<IMass[]> => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storageService.STORE_NAME], 'readonly');
      const store = transaction.objectStore(storageService.STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      transaction.oncomplete = () => db.close();
    });
  },
  
  deleteMass: async (id: string): Promise<void> => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storageService.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(storageService.STORE_NAME);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      transaction.oncomplete = () => db.close();
    });
  }
};
export default storageService;