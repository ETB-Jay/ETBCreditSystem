// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

export const fetchCustomers = async () => {
  try {
    const customersCollection = collection(db, 'customers');
    const customersDocuments = await getDocs(customersCollection);
    const customerData = customersDocuments.docs.flatMap(doc => {
      const data = doc.data();
      return data.customers.map(customer => {
        return {
          customer_id: customer.customer_id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email || '',
          phone: customer.phone || '',
          balance: customer.balance,
          notes: customer.notes || '',
          transactions: (customer.transactions || []).map(transaction => ({
            ...transaction,
            date: transaction.date,
            notes: transaction.notes
          }))
        };
      });
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

export { db };