import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getFirestore,
} from "firebase/firestore";

import type { Row, Location } from "../types";

// Import the Firebase app instance from the main firebase file
import { db } from "../firebase";

/**
 * Account Log Service - Handles all account log related operations
 */
export const accountLogService = {
  /**
   * Adds a new log entry to the database
   */
  async addLogEntry(entry: Row): Promise<void> {
    try {
      const accountLogsCollection = collection(db, "account_logs");
      await addDoc(accountLogsCollection, {
        ...entry,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(
        `Failed to add log entry: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },

  /**
   * Updates an existing log entry
   */
  async updateLogEntry(documentId: string, entry: Row): Promise<void> {
    try {
      const docRef = doc(db, "account_logs", documentId);
      await updateDoc(docRef, {
        ...entry,
        lastUpdated: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(
        `Failed to update log entry: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },

  /**
   * Deletes a log entry
   */
  async deleteLogEntry(documentId: string): Promise<void> {
    try {
      const docRef = doc(db, "account_logs", documentId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(
        `Failed to delete log entry: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },

  /**
   * Adds a new location
   */
  async addLocation(locationName: string): Promise<void> {
    try {
      const locationsCollection = collection(db, "locations");
      await addDoc(locationsCollection, {
        name: locationName,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(
        `Failed to add location: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },

  /**
   * Deletes a location
   */
  async deleteLocation(locationId: string): Promise<void> {
    try {
      const docRef = doc(db, "locations", locationId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(
        `Failed to delete location: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },

  /**
   * Debug function to check if a monthly document exists
   */
  async debugMonthlyDocument(monthId: string): Promise<void> {
    try {
      const docRef = doc(db, "monthly_documents", monthId);
      const docSnap = await getDoc(docRef);
      console.log(`Document ${monthId} exists:`, docSnap.exists());
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      }
    } catch (error) {
      console.error(`Failed to debug document ${monthId}:`, error);
    }
  },

  /**
   * Cleans up zero columns from the database
   */
  async cleanupZeroColumns(): Promise<void> {
    try {
      const monthlyDocsCollection = collection(db, "monthly_documents");
      const logsSnapshot = await getDocs(monthlyDocsCollection);

      if (logsSnapshot.empty) {
        console.log("No monthly documents found for cleanup");
        return;
      }

      // Helper function to calculate day total
      const calculateDayTotal = (cashAmount: number, credits: number[]): number => {
        const creditsTotal = credits.reduce((sum, credit) => sum + (Number(credit) || 0), 0);
        return (Number(cashAmount) || 0) + creditsTotal;
      };

      // Update all monthly documents to remove zero columns
      for (const docSnapshot of logsSnapshot.docs) {
        const data = docSnapshot.data();
        const entriesByLocation = data.entries || {};

        // Process each location's entries
        const updatedEntriesByLocation: { [key: string]: any[] } = {};

        Object.entries(entriesByLocation).forEach(([location, locationEntries]) => {
          // Get the first entry to determine which columns to keep (non-zero columns)
          const firstEntry = (locationEntries as Record<string, any>[])[0];
          if (!firstEntry || !firstEntry.credits) {
            updatedEntriesByLocation[location] = locationEntries;
            return;
          }

          const credits = Array.isArray(firstEntry.credits)
            ? firstEntry.credits
            : [firstEntry.credits];
          const columnsToKeep = credits.map((credit: any) => Number(credit) !== 0);

          // Filter out zero columns from each entry
          const updatedLocationEntries = (locationEntries as Record<string, any>[]).map(
            (entry: Record<string, any>) => ({
              ...entry,
              credits: entry.credits
                ? (Array.isArray(entry.credits) ? entry.credits : [entry.credits])
                    .filter((_: any, index: number) => columnsToKeep[index])
                    .map((credit: any) => Number(credit))
                : [],
            })
          );

          // Recalculate totals for updated entries
          const finalLocationEntries = updatedLocationEntries.map(
            (entry: Record<string, any>, index: number) => {
              const dayTotal = calculateDayTotal(
                Number(entry.cashamount) || 0,
                entry.credits || []
              );

              let runningAmount = 0;
              for (let i = 0; i <= index; i++) {
                const currentEntry = updatedLocationEntries[i] as Record<string, any>;
                runningAmount += calculateDayTotal(
                  Number(currentEntry.cashamount) || 0,
                  currentEntry.credits || []
                );
              }

              return {
                ...entry,
                daytotal: dayTotal,
                runningamount: runningAmount,
                monthlyaverage: 0, // Will be calculated in the next step
              };
            }
          );

          // Calculate monthly average for this location
          const totalMonthlyAmount = finalLocationEntries.reduce(
            (sum: number, e: any) =>
              sum + calculateDayTotal(Number(e.cashamount) || 0, e.credits || []),
            0
          );
          const monthlyAverage =
            finalLocationEntries.length > 0 ? totalMonthlyAmount / finalLocationEntries.length : 0;

          // Update entries with correct monthly average
          const finalLocationEntriesWithAverage = finalLocationEntries.map(
            (entry: Record<string, any>) => ({
              ...entry,
              monthlyaverage: monthlyAverage,
            })
          );

          updatedEntriesByLocation[location] = finalLocationEntriesWithAverage;
        });

        // Save updated document
        await setDoc(docSnapshot.ref, {
          entries: updatedEntriesByLocation,
          month: data.month,
          year: data.year,
          lastUpdated: new Date(),
        });
      }

      console.log("Successfully cleaned up zero columns from database");

      // Trigger a data refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent("dataCleanupCompleted"));
    } catch (error) {
      throw new Error(
        `Failed to cleanup zero columns: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
};
