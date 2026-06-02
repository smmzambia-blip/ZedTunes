import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Disable chatty warnings and harmless stream connection cancellation messages in console
try {
  setLogLevel('silent');
} catch {
  // Gracefully handle if setLogLevel is not supported in the execution environment
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Define a safe global scope reference across node and browser environments
const _global = (typeof window !== 'undefined' ? window : global) as unknown as Record<string, Firestore | undefined>;

let firestoreDb: Firestore;

if (_global.firestoreDb) {
  firestoreDb = _global.firestoreDb;
} else {
  try {
    firestoreDb = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
    _global.firestoreDb = firestoreDb;
  } catch {
    firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    _global.firestoreDb = firestoreDb;
  }
}

export const db = firestoreDb;
export const auth = getAuth(app);

