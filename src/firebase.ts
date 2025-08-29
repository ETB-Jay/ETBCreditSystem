import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { accountLogService } from "./services/accountLogService";
import type { Customer, Row, Column, Location } from "./types";

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
type LogsCallback = (_data: {
  logs: Row[];
  total: number;
  monthlyDocuments?: { [key: string]: { monthName: string; entries: Row[] } };
  error?: unknown;
}) => void;

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
          return data.customers ?? [];
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
}

/**
 * Fetches all customers once from Firestore.
 * @returns The customers and total count.
 */
async function fetchCustomersOnce() {
  try {
    const customersDocuments = await getDocs(customersCollection);
    const customerData = customersDocuments.docs.flatMap((doc) => {
      const data = doc.data();
      return data.customers ?? [];
    });
    return {
      customers: customerData,
      total: customerData.length,
    };
  } catch (err) {
    throw new Error(err as string);
  }
}

/**
 * Fetches raw log data without any parsing or transformation
 * @param callback Callback to handle raw data and errors.
 * @returns Unsubscribe function for the Firestore listener.
 */
function fetchRawLogs(
  callback: (data: {
    rawData: Array<{ id: string; data: unknown; exists: boolean; metadata: unknown }>;
    total: number;
    error?: unknown;
  }) => void
) {
  const accountLogsCollection = collection(db, "account_logs");

  return onSnapshot(
    accountLogsCollection,
    (snapshot) => {
      try {
        const rawData = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          data: docSnapshot.data() as unknown,
          exists: docSnapshot.exists(),
          metadata: docSnapshot.metadata as unknown,
        }));

        console.log("Raw data fetched:", rawData);

        callback({
          rawData,
          total: rawData.length,
        });
      } catch (error) {
        callback({ rawData: [], total: 0, error });
      }
    },
    (error) => {
      callback({ rawData: [], total: 0, error });
    }
  );
}

/**
 * Automatically fetches log data in real-time and makes a callback to handle errors in the update
 * @param callback Callback to handle log data and errors.
 * @returns Unsubscribe function for the Firestore listener.
 */
function fetchLogs(callback: LogsCallback) {
  const accountLogsCollection = collection(db, "account_logs");

  return onSnapshot(
    accountLogsCollection,
    (snapshot) => {
      try {
        const logEntries: Row[] = [];
        const monthlyDocuments: { [key: string]: { monthName: string; entries: Row[] } } = {};

        console.log(
          `Fetching logs from ${snapshot.docs.length} documents:`,
          snapshot.docs.map((doc) => doc.id)
        );

        snapshot.docs.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const entriesByLocation = data.entries || {};

          console.log(
            `Document ${docSnapshot.id} has entries for locations:`,
            Object.keys(entriesByLocation)
          );
          console.log(`Document ${docSnapshot.id} structure:`, {
            hasEntries: typeof data.entries === "object",
            locations: Object.keys(data.entries || {}),
            month: data.month,
            year: data.year,
            lastUpdated: data.lastUpdated,
          });

          // Create month entry even if no entries exist
          const monthYear = `${data.year}-${String((data.month || 0) + 1).padStart(2, "0")}`;
          const monthName = new Date(data.year || 2025, data.month || 0).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
            }
          );

          // Process each location's entries
          Object.entries(entriesByLocation).forEach(([location, locationEntries]) => {
            const locationMonthKey = `${location}-${monthYear}`;

            monthlyDocuments[locationMonthKey] = {
              monthName,
              entries: [],
            };

            (locationEntries as Record<string, any>[]).forEach(
              (entry: Record<string, any>, index: number) => {
                // Convert the Firebase document structure to our Row format
                let dateValue: Date;
                if (entry.datelog) {
                  // Handle Firebase Timestamp or regular Date
                  if (
                    typeof entry.datelog === "object" &&
                    entry.datelog !== null &&
                    "toDate" in entry.datelog
                  ) {
                    dateValue = (entry.datelog as { toDate: () => Date }).toDate();
                  } else {
                    dateValue = new Date(String(entry.datelog));
                  }
                } else {
                  dateValue = new Date();
                }

                let creditArray: number[];
                if (entry.credits) {
                  const credits = Array.isArray(entry.credits) ? entry.credits : [entry.credits];
                  creditArray = credits.map((credit) => Number(credit));
                } else {
                  creditArray = [];
                }

                const row: Row = {
                  datelog: dateValue,
                  cashamount: Number(entry.cashamount) || 0,
                  credits: creditArray,
                  daytotal: Number(entry.daytotal) || 0,
                  runningamount: Number(entry.runningamount) || 0,
                  monthlyaverage: Number(entry.monthlyaverage) || 0,
                  location: location,
                  employeeName: entry.employeeName || "",
                  documentId: `${docSnapshot.id}-${location}-${index}`, // Use monthly doc ID + location + index as unique ID
                };
                logEntries.push(row);
                monthlyDocuments[locationMonthKey].entries.push(row);
              }
            );
          });
        });

        // Sort by date descending
        logEntries.sort((first, second) => second.datelog.getTime() - first.datelog.getTime());

        console.log(`Total log entries fetched: ${logEntries.length}`);
        console.log(
          "Sample entries:",
          logEntries.slice(0, 3).map((entry) => ({
            date: entry.datelog.toISOString().split("T")[0],
            cash: entry.cashamount,
            credits: entry.credits,
            documentId: entry.documentId,
          }))
        );
        console.log("Monthly documents:", monthlyDocuments);

        callback({
          logs: logEntries,
          total: logEntries.length,
          monthlyDocuments, // Add this to the callback
        });
      } catch (error) {
        callback({ logs: [], total: 0, error });
      }
    },
    (error) => {
      callback({ logs: [], total: 0, error });
    }
  );
}

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
}

/**
 * Generates a monthly document ID in the format 'aug-2025'
 */
const getMonthlyDocumentId = (date: Date): string => {
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month}-${year}`;
};

/**
 * Calculates day total (cash + sum of credits)
 */
const calculateDayTotal = (cash: number, credits: number[]): number => {
  const creditTotal = credits.reduce((sum, credit) => sum + credit, 0);
  return cash + creditTotal;
};

/**
 * Calculates running amount and monthly average for a month's entries
 */
const calculateMonthlyStats = (
  entries: Row[]
): { runningAmount: number; monthlyAverage: number } => {
  if (entries.length === 0) return { runningAmount: 0, monthlyAverage: 0 };

  let runningAmount = 0;
  const dayTotals: number[] = [];

  // Sort entries by date to calculate running amount correctly
  // Ensure dates are properly converted to Date objects for comparison
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = a.datelog instanceof Date ? a.datelog : new Date(a.datelog);
    const dateB = b.datelog instanceof Date ? b.datelog : new Date(b.datelog);
    return dateA.getTime() - dateB.getTime();
  });

  sortedEntries.forEach((entry) => {
    const dayTotal = calculateDayTotal(entry.cashamount, entry.credits);
    dayTotals.push(dayTotal);
    runningAmount += dayTotal;
  });

  const monthlyAverage = runningAmount / entries.length;

  return { runningAmount: runningAmount, monthlyAverage };
};

export {
  db,
  fetchCustomers,
  fetchCustomersOnce,
  getHighestCustomerId,
  fetchLogs,
  fetchRawLogs,
  getMonthlyDocumentId,
  accountLogService,
};
export type { CustomersCallback, LogsCallback };
