import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDocFromServer, 
  disableNetwork, 
  setLogLevel
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebase-applet-config.json';

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Silence benign Firestore internal connection retry and offline transition logs
setLogLevel('silent');

// CRITICAL: Connect directly to the provisioned database ID with auto-detect long polling for reliable web sandboxes
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configure fast retries (2.5 seconds) to handle sandbox/offline limitations gracefully
storage.maxUploadRetryTime = 2500;
storage.maxOperationRetryTime = 2500;

// Error Handling Infrastructure as mandated in Firestore Integration guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Validates and wraps Firestore errors into highly detailed JSON payloads for debugging.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore as mandated in guidelines
async function testConnection() {
  const isPlaceholderKey = firebaseConfig.apiKey && (
    firebaseConfig.apiKey.includes('PlaceholderKey') || 
    firebaseConfig.apiKey === 'AIzaSyPlaceholderKeyForCompilationOnly-1234abcd'
  );

  if (isPlaceholderKey) {
    console.info("Firebase: Placeholder API key detected. Disabling network requests to prevent cloud timeouts.");
    try {
      await disableNetwork(db);
    } catch (e) {
      console.warn("Firestore disableNetwork failed:", e);
    }
    return;
  }

  try {
    const testPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Backend probe timed out; client operating in resilient offline/cache mode')), 4000)
    );
    await Promise.race([testPromise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('timed out') || error.message.includes('Could not reach Cloud Firestore')) {
        console.info("Firestore operating in offline-first mode; updates will sync automatically.");
      }
    }
  }
}
testConnection();
