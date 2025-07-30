// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";

import { Customer } from "./types";

// ─ Constants ────────────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const customersCollection = collection(db, "customers");

type CustomersCallback = (_data: { customers: Customer[]; total: number; error?: unknown }) => void;

/**
 * Automatically fetches customers in real-time and makes a callback to handle errors in the update
 * @param callback Callback to handle customer data and errors.
 * @returns Unsubscribe function for the Firestore listener.
 */
function fetchCustomers(callback: CustomersCallback) {
  return onSnapshot(
    customersCollection,
    (snapshot) => {
      try {
        const customerData = snapshot.docs.flatMap((doc) => {
          const data = doc.data();
          return data.customers || [];
        });
        callback({
          customers: customerData,
          total: customerData.length,
        });
      } catch (error) {
        callback({ customers: [], total: 0, error });
      }
    },
    (error) => {
      callback({ customers: [], total: 0, error });
    }
  );
};

/**
 * Fetches all customers once from Firestore.
 * @returns The customers and total count.
 */
async function fetchCustomersOnce() {
  try {
    const customersDocuments = await getDocs(customersCollection);
    const customerData = customersDocuments.docs.flatMap((doc) => {
      const data = doc.data();
      return data.customers || [];
    });
    return {
      customers: customerData,
      total: customerData.length,
    };
  } catch (err) {
    throw new Error(err as string);
  }
};

/**
 * Gets the highest customer ID from all customer documents.
 * @returns The highest customer ID found.
 */
async function getHighestCustomerId() {
  try {
    const customersDocuments = await getDocs(customersCollection);
    let highestId = 0;
    customersDocuments.docs.forEach((doc) => {
      const data = doc.data();
      if (data.customers && Array.isArray(data.customers)) {
        data.customers.forEach((customer: Customer) => {
          if (customer.customerID > highestId) {
            highestId = customer.customerID;
          }
        });
      }
    });
    return highestId;
  } catch (err) {
    throw new Error(err as string);
  }
};

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export { db, fetchCustomers, fetchCustomersOnce, getHighestCustomerId };
export type { CustomersCallback };
