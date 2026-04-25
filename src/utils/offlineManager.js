

const DB_NAME = 'SukhSangeetDB';
const DB_VERSION = 1;
const STORES = {
  playlists: 'playlists',
  tracks: 'tracks',
  settings: 'settings'
};

let db = null;

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

export const isOnline = () => navigator.onLine;

export const isServiceWorkerAvailable = () => 'serviceWorker' in navigator;

export const setupSyncListener = (callback) => {
  window.addEventListener('online', () => {
    console.log('Back online - syncing data');
    callback();
  });
};

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
