import { type ReactElement, useMemo, lazy, Suspense } from "react";

import {
  useLogData,
  useLogDisplay,
  useLogFilters,
  useLogLocations,
  useSelectedLog,
} from "../../context/LogContext";
import { accountLogService } from "../../firebase";
import { useLogDataProcessing } from "../hooks/useLogDataProcessing";
import { cn } from "../modals/scripts";

import LogTableContent from "./components/LogTableContent";
import LogTableErrorState from "./components/LogTableErrorState";
import LogTableHeader from "./components/LogTableHeader";
import LogTableLoadingState from "./components/LogTableLoadingState";

import type { Row, Column } from "../../types";

// Lazy load the ModalRenderer to reduce initial bundle size
const ModalRenderer = lazy(() => import("./components/ModalRenderer"));

// Loading component for modal renderer
const ModalLoadingSpinner = () => (
  <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
  </div>
);

/** Displays the log table with data, filters, and actions. */
const Table = (): ReactElement => {
  const { logData, monthlyDocuments, loading, error, refreshData } = useLogData();
  const { logDisplay, setLogDisplay } = useLogDisplay();
  const { logFilters, setLogFilters } = useLogFilters();
  const {
    locations,
    loading: locationsLoading,
    error: _locationsError,
    refreshLocations,
  } = useLogLocations();
  const { selectedLog, setSelectedLog } = useSelectedLog();

  const { sortedMonths, selectedMonth, setSelectedMonth, currentMonthData } = useLogDataProcessing(
    logData,
    logFilters,
    monthlyDocuments
  );

  // Generate columns dynamically from the credits array in log data
  const columns = useMemo(() => {
    const maxCreditsLength = Math.max(...logData.map((entry) => entry.credits.length), 0);
    const generatedColumns: Column[] = [];

    // Ensure there's always at least one credit column
    const numColumns = Math.max(maxCreditsLength, 1);

    for (let i = 0; i < numColumns; i++) {
      generatedColumns.push({
        id: `col_${i}`,
        name: `c${i + 1}`,
        displayName: `Credit ${i + 1}`,
      });
    }

    return generatedColumns;
  }, [logData]);

  const containerClasses = useMemo(
    () =>
      cn(
        "container-snap flex flex-col overflow-y-auto",
        "theme-panel theme-text theme-border border rounded-2xl p-2"
      ),
    []
  );

  const handleEditEntry = (entry: Row) => {
    setSelectedLog(entry);
    setLogDisplay("edit");
  };

  const handleNewEntry = () => {
    setSelectedLog(null);
    setLogDisplay("add");
  };

  const handleManageColumns = () => {
    setLogDisplay("manage");
  };

  const handleLocationChange = (location: string | null) => {
    setLogFilters((prev) => ({
      ...prev,
      location: { selectedLocation: location },
    }));
  };

  const handleRefresh = () => {
    refreshData();
  };

  // Show loading state
  if (loading) {
    return (
      <div className={containerClasses}>
        <LogTableLoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={containerClasses}>
        <LogTableErrorState error={error} onRetry={handleRefresh} />
      </div>
    );
  }

  return (
    <>
      <div className={containerClasses}>
        <LogTableHeader
          selectedMonth={selectedMonth}
          sortedMonths={sortedMonths}
          onMonthChange={setSelectedMonth}
          onNewEntry={handleNewEntry}
          onManageColumns={handleManageColumns}
          locations={locations}
          selectedLocation={logFilters.location.selectedLocation}
          onLocationChange={handleLocationChange}
          locationsLoading={locationsLoading}
          logData={logData}
        />
        <LogTableContent
          currentMonthData={currentMonthData}
          onEditEntry={handleEditEntry}
          columns={columns}
        />
      </div>

      {/* Modal Renderer - Centralized modal management */}
      <Suspense fallback={<ModalLoadingSpinner />}>
        <ModalRenderer
          logDisplay={logDisplay}
          selectedLog={selectedLog}
          onClose={() => setLogDisplay("default")}
          onSaveLogEntry={async (entry: Row) => {
            if (logDisplay === "add") {
              await accountLogService.addLogEntry(entry);
            } else if (logDisplay === "edit" && selectedLog?.documentId) {
              await accountLogService.updateLogEntry(selectedLog.documentId, entry);
            }
          }}
          onAddColumn={async (_columnName) => {
            const updatedLogData = logData.map((entry) => ({
              ...entry,
              credits: [...entry.credits, 0],
            }));
            for (const entry of updatedLogData) {
              if (entry.documentId) {
                await accountLogService.updateLogEntry(entry.documentId, entry);
              }
            }
          }}
          onAddLocation={async (locationName) => {
            await accountLogService.addLocation(locationName);
            refreshLocations();
          }}
          onDeleteLocation={async (locationId) => {
            await accountLogService.deleteLocation(locationId);
            refreshLocations();
          }}
          columns={columns}
          locations={locations}
        />
      </Suspense>
    </>
  );
};

export default Table;
