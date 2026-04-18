/**
 * Offline Data Management for Sukh Sangeet
 * Stores playlists and tracks in IndexedDB for offline access
 */

const DB_NAME = 'SukhSangeetDB';
const DB_VERSION = 1;
const STORES = {
  playlists: 'playlists',
  tracks: 'tracks',
  settings: 'settings'
};

let db = null;

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.playlists)) {
        database.createObjectStore(STORES.playlists, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.tracks)) {
        database.createObjectStore(STORES.tracks, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.settings)) {
        database.createObjectStore(STORES.settings, { keyPath: 'key' });
      }
    };
  });
};

// Save playlist for offline use
export const savePlaylistOffline = async (playlist) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.playlists], 'readwrite');
    const store = transaction.objectStore(STORES.playlists);
    const request = store.put({
      ...playlist,
      cachedAt: new Date().toISOString()
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save tracks for offline use
export const saveTracksOffline = async (tracks) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.tracks], 'readwrite');
    const store = transaction.objectStore(STORES.tracks);

    tracks.forEach((track) => {
      store.put({
        ...track,
        cachedAt: new Date().toISOString()
      });
    });

    transaction.oncomplete = () => resolve(tracks.length);
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get offline playlists
export const getOfflinePlaylists = async () => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.playlists], 'readonly');
    const store = transaction.objectStore(STORES.playlists);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Get offline tracks
export const getOfflineTracks = async () => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.tracks], 'readonly');
    const store = transaction.objectStore(STORES.tracks);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Check if online
export const isOnline = () => navigator.onLine;

// Check if Service Worker is available
export const isServiceWorkerAvailable = () => 'serviceWorker' in navigator;

// Sync playlists when back online
export const setupSyncListener = (callback) => {
  window.addEventListener('online', () => {
    console.log('Back online - syncing data');
    callback();
  });
};

// Clear offline data (optional)
export const clearOfflineData = async () => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.playlists, STORES.tracks], 'readwrite');
    
    transaction.objectStore(STORES.playlists).clear();
    transaction.objectStore(STORES.tracks).clear();

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};
