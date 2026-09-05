import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';

let connected = false;

export function firebaseServices() {
  const emulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!projectId || !apiKey || !databaseURL) {
    throw new Error('Task storage is not configured. Follow the setup instructions in the README.');
  }
  const endpoint = new URL(databaseURL);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== '/') {
    throw new Error('Use the HTTPS Firebase database root URL without credentials, a path, or query parameters.');
  }
  const app = getApps().length ? getApp() : initializeApp({ projectId, apiKey, databaseURL });
  const auth = getAuth(app);
  const database = getDatabase(app);
  if (emulator && !connected) {
    if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      throw new Error('Emulator mode is restricted to local development.');
    }
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectDatabaseEmulator(database, '127.0.0.1', 9000);
    connected = true;
  }
  return { auth, database };
}
