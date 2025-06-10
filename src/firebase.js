// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYGiwRf2WpAFZJEOiq1sW46dZr96a47d0",
  authDomain: "etbcredit-6cae3.firebaseapp.com",
  projectId: "etbcredit-6cae3",
  storageBucket: "etbcredit-6cae3.firebasestorage.app",
  messagingSenderId: "496999532194",
  appId: "1:496999532194:web:40fdf05ba38adb6a28b9fb",
  measurementId: "G-XX2CG4PXH3"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const fetchCustomers = async () => {
  try {
    const customersCollection = collection(db, 'customers')
    const customersDocuments = await getDocs(customersCollection)
    const customerData = customersDocuments.docs.flatMap(doc => {
      const data = doc.data()
      return data.customers.map(customer => {
        return {
          customer_id: customer.customer_id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email || '',
          phone: customer.phone || '',
          balance: customer.balance,
          transactions: (customer.transactions || []).map(transaction => ({
            ...transaction,
            date: transaction.date,
            notes: transaction.notes
          }))
        }
      })
    })
    return {
      customers: customerData,
      total: customerData.length
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

export { db }