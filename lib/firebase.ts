import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use initializeFirestore with long polling for better connectivity in proxied environments
// We try to use initializeFirestore only once per app instance
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  // If already initialized, getFirestore will return the existing instance
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
export const auth = getAuth(app);
