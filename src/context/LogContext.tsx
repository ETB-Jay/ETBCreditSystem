import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { fetchLogs, fetchRawLogs, accountLogService, db } from "../firebase";

import type { Row, Location } from "../types";

// Context types
interface LogDataContextType {
  logData: Row[];
  setLogData: React.Dispatch<React.SetStateAction<Row[]>>;
  monthlyDocuments: { [key: string]: { monthName: string; entries: Row[] } };
  setMonthlyDocuments: React.Dispatch<
    React.SetStateAction<{ [key: string]: { monthName: string; entries: Row[] } }>
  >;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

interface RawLogDataContextType {
  rawData: any[];
  setRawData: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
  error: string | null;
  refreshRawData: () => void;
}

interface LogDisplayContextType {
  logDisplay: LogDisplay;
  setLogDisplay: React.Dispatch<React.SetStateAction<LogDisplay>>;
}

interface LogFiltersContextType {
  logFilters: LogFilters;
  setLogFilters: React.Dispatch<React.SetStateAction<LogFilters>>;
}

interface LogLocationsContextType {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  loading: boolean;
  error: string | null;
  refreshLocations: () => void;
}

interface SelectedLogContextType {
  selectedLog: Row | null;
  setSelectedLog: React.Dispatch<React.SetStateAction<Row | null>>;
}

// Create contexts
const LogDataContext = createContext<LogDataContextType | undefined>(undefined);
LogDataContext.displayName = "LogDataContext";

const RawLogDataContext = createContext<RawLogDataContextType | undefined>(undefined);
RawLogDataContext.displayName = "RawLogDataContext";

const LogDisplayContext = createContext<LogDisplayContextType | undefined>(undefined);
LogDisplayContext.displayName = "LogDisplayContext";

const LogFilterContext = createContext<LogFiltersContextType | undefined>(undefined);
LogFilterContext.displayName = "LogFilterContext";

const LogLocationsContext = createContext<LogLocationsContextType | undefined>(undefined);
LogLocationsContext.displayName = "LogLocationsContext";

const SelectedLogContext = createContext<SelectedLogContextType | undefined>(undefined);
SelectedLogContext.displayName = "SelectedLogContext";

// Types for the log system
type LogDisplay = "default" | "add" | "edit" | "delete" | "manage" | "locations";

interface LogFilters {
  date: {
    startDate: string;
    endDate: string;
  };
  amount: {
    minAmount: string;
    maxAmount: string;
  };
  type: {
    cash: boolean;
    credit: boolean;
  };
  location: {
    selectedLocation: string | null;
  };
}

/**
 * Custom hook to access the Log Data context.
 * @returns The log data context value.
 * @throws If used outside of LogDataProvider.
 */
const useLogData = () => {
  const context = useContext(LogDataContext);
  if (!context) {
    throw new Error("useLogData must be used in the LogDataProvider");
  }
  return context;
};

/**
 * Custom hook to access the Raw Log Data context.
 * @returns The raw log data context value.
 * @throws If used outside of RawLogDataProvider.
 */
const useRawLogData = () => {
  const context = useContext(RawLogDataContext);
  if (!context) {
    throw new Error("useRawLogData must be used in the RawLogDataProvider");
  }
  return context;
};

/**
 * Custom hook to access the Log Display context.
 * @returns The log display context value.
 * @throws If used outside of LogDisplayProvider.
 */
const useLogDisplay = () => {
  const context = useContext(LogDisplayContext);
  if (!context) {
    throw new Error("useLogDisplay must be used in the LogDisplayProvider");
  }
  return context;
};

/**
 * Custom hook to access the Log Filters context.
 * @returns The log filters context value.
 * @throws If used outside of LogFilterProvider.
 */
const useLogFilters = () => {
  const context = useContext(LogFilterContext);
  if (!context) {
    throw new Error("useLogFilters must be used in the LogFilterProvider");
  }
  return context;
};

/**
 * Custom hook to access the Log Locations context.
 * @returns The log locations context value.
 * @throws If used outside of LogLocationsProvider.
 */
const useLogLocations = () => {
  const context = useContext(LogLocationsContext);
  if (!context) {
    throw new Error("useLogLocations must be used in the LogLocationsProvider");
  }
  return context;
};

/**
 * Custom hook to access the Selected Log context.
 * @returns The selected log context value.
 * @throws If used outside of SelectedLogProvider.
 */
const useSelectedLog = () => {
  const context = useContext(SelectedLogContext);
  if (!context) {
    throw new Error("useSelectedLog must be used in the SelectedLogProvider");
  }
  return context;
};

/**
 * Groups all log context providers for the application to reduce nesting and context switching.
 * @param props The children to be wrapped by providers.
 */
const LogProviders = ({ children }: PropsWithChildren) => {
  const [logData, setLogData] = useState<Row[]>([]);
  const [monthlyDocuments, setMonthlyDocuments] = useState<{
    [key: string]: { monthName: string; entries: Row[] };
  }>({});
  const [logDisplay, setLogDisplay] = useState<LogDisplay>("default");
  const [logFilters, setLogFilters] = useState<LogFilters>({
    date: { startDate: "", endDate: "" },
    amount: { minAmount: "", maxAmount: "" },
    type: { cash: true, credit: true },
    location: { selectedLocation: null },
  });
  const [selectedLog, setSelectedLog] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw data state
  const [rawData, setRawData] = useState<any[]>([]);
  const [rawDataLoading, setRawDataLoading] = useState(true);
  const [rawDataError, setRawDataError] = useState<string | null>(null);

  // Location state
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  const refreshData = () => {
    setLoading(true);
    setError(null);
    // The useEffect will handle the refresh automatically
  };

  const refreshRawData = () => {
    setRawDataLoading(true);
    setRawDataError(null);
    // The useEffect will handle the refresh automatically
  };

  const refreshLocations = () => {
    setLocationsLoading(true);
    setLocationsError(null);
    // The useEffect will handle the refresh automatically
  };

  // Firebase real-time listener for log data using the fetchLogs function
  useEffect(() => {
    const unsubscribe = fetchLogs(({ logs, monthlyDocuments, error }) => {
      if (error) {
        setError(
          `Failed to fetch log data: ${error instanceof Error ? error.message : String(error)}`
        );
        setLoading(false);
      } else {
        console.log(logs);
        setLogData(logs);
        if (monthlyDocuments) {
          setMonthlyDocuments(monthlyDocuments);
        }
        setLoading(false);
        setError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase real-time listener for raw log data
  useEffect(() => {
    const unsubscribe = fetchRawLogs(({ rawData, error }) => {
      if (error) {
        setRawDataError(
          `Failed to fetch raw log data: ${error instanceof Error ? error.message : String(error)}`
        );
        setRawDataLoading(false);
      } else {
        console.log('Raw data:', rawData);
        setRawData(rawData);
        setRawDataLoading(false);
        setRawDataError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for cleanup completion events to refresh data
  useEffect(() => {
    const handleCleanupCompleted = () => {
      console.log("Cleanup completed, refreshing data...");
      refreshData();
    };

    window.addEventListener("dataCleanupCompleted", handleCleanupCompleted);
    return () => window.removeEventListener("dataCleanupCompleted", handleCleanupCompleted);
  }, [refreshData]);

  // Fetch locations on component mount and set up real-time listener
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await accountLogService.fetchLocations();
        setLocations(locationsData);
        setLocationsLoading(false);
        setLocationsError(null);
      } catch (error) {
        setLocationsError(error instanceof Error ? error.message : "Failed to fetch locations");
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Set up real-time listener for locations
  useEffect(() => {
    const locationsDocRef = doc(db, "account_settings", "locations");
    const unsubscribe = onSnapshot(
      locationsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const locationsData = data.locations || [];
          setLocations(locationsData);
          setLocationsLoading(false);
          setLocationsError(null);
        } else {
          setLocations([]);
          setLocationsLoading(false);
          setLocationsError(null);
        }
      },
      (error) => {
        setLocationsError(error.message);
        setLocationsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logDataValue = useMemo(
    () => ({
      logData,
      setLogData,
      monthlyDocuments,
      setMonthlyDocuments,
      loading,
      error,
      refreshData,
    }),
    [logData, monthlyDocuments, loading, error]
  );

  const rawLogDataValue = useMemo(
    () => ({
      rawData,
      setRawData,
      loading: rawDataLoading,
      error: rawDataError,
      refreshRawData,
    }),
    [rawData, rawDataLoading, rawDataError]
  );
  const logDisplayValue = useMemo(() => ({ logDisplay, setLogDisplay }), [logDisplay]);
  const logFiltersValue = useMemo(() => ({ logFilters, setLogFilters }), [logFilters]);
  const logLocationsValue = useMemo(
    () => ({
      locations,
      setLocations,
      loading: locationsLoading,
      error: locationsError,
      refreshLocations,
    }),
    [locations, locationsLoading, locationsError]
  );
  const selectedLogValue = useMemo(() => ({ selectedLog, setSelectedLog }), [selectedLog]);

  return (
    <LogDataContext.Provider value={logDataValue}>
      <RawLogDataContext.Provider value={rawLogDataValue}>
        <LogDisplayContext.Provider value={logDisplayValue}>
          <LogFilterContext.Provider value={logFiltersValue}>
            <LogLocationsContext.Provider value={logLocationsValue}>
              <SelectedLogContext.Provider value={selectedLogValue}>
                {children}
              </SelectedLogContext.Provider>
            </LogLocationsContext.Provider>
          </LogFilterContext.Provider>
        </LogDisplayContext.Provider>
      </RawLogDataContext.Provider>
    </LogDataContext.Provider>
  );
};

export { LogProviders, useLogData, useRawLogData, useLogDisplay, useLogFilters, useLogLocations, useSelectedLog };
