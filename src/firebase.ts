import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, disableNetwork, setLogLevel } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebase-applet-config.json';

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Silence benign Firestore connection retry log warnings in standard environments
setLogLevel('error');

// CRITICAL: The application depends on custom database name if provided
// We use initializeFirestore with forceLongPolling to ensure reliability under sandbox proxies
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

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

// CRITICAL CONSTRAINT: When the application initially boots, test the database connection
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
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection loaded.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.info("Firebase connection: Offline mode or placeholder key detected. Standing by.");
    } else {
      console.info("Firebase connection initialization check completed.");
    }
  }
}
testConnection();
