// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Customer } from './types';

// Import additional Firebase SDKs as needed: https://firebase.google.com/docs/web/setup#available-libraries
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const customersCollection = collection(db, 'customers');

// Type for the callback used in fetchCustomers
export type CustomersCallback = (_data: { customers: Customer[]; total: number; error?: unknown }) => void;

/**
 * Automatically fetches customers in real-time and makes a callback to handle data and errors in the update
 * @param callback Callback to handle customer data and errors.
 * @returns Unsubscribe function for the Firestore listener.
 */
const fetchCustomers = (callback: CustomersCallback) => {
  return onSnapshot(customersCollection, (snapshot) => {
    try {
      const customerData = snapshot.docs.flatMap(doc => {
        const data = doc.data();
        return data.customers || [];
      });
      callback({
        customers: customerData,
        total: customerData.length
      });
    } catch (error) {
      console.error('Error processing customers:', error);
      callback({ customers: [], total: 0, error });
    }
  }, (error) => {
    console.error('Error with Firestore listener:', error);
    callback({ customers: [], total: 0, error });
  });
};

/**
 * Fetches all customers once from Firestore.
 * @returns The customers and total count.
 */
const fetchCustomersOnce = async () => {
  try {
    const customersDocuments = await getDocs(customersCollection);
    const customerData = customersDocuments.docs.flatMap(doc => {
      const data = doc.data();
      return data.customers || [];
    });
    return {
      customers: customerData,
      total: customerData.length
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Gets the highest customer ID from all customer documents.
 * @returns The highest customer ID found.
 */
const getHighestCustomerId = async () => {
  try {
    const customersDocuments = await getDocs(customersCollection);
    let highestId = 0;
    customersDocuments.docs.forEach(doc => {
      const data = doc.data();
      if (data.customers && Array.isArray(data.customers)) {
        data.customers.forEach((customer: Customer) => {
          if (customer.customer_id > highestId) {
            highestId = customer.customer_id;
          }
        });
      }
    });
    return highestId;
  } catch (error) {
    console.error('Error finding highest customer ID:', error);
    throw error;
  }
};

export { db, fetchCustomers, fetchCustomersOnce, getHighestCustomerId };