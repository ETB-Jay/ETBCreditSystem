import { useMemo, useState, useEffect } from "react";

import type { Row } from "../../types";

interface LogFilters {
  date: {
    startDate: string | null;
    endDate: string | null;
  };
  amount: {
    minAmount: string | null;
    maxAmount: string | null;
  };
  type: {
    cash: boolean;
    credit: boolean;
  };
  location: {
    selectedLocation: string | null;
  };
}

interface GroupedData {
  [key: string]: {
    monthName: string;
    entries: Row[];
  };
}

export const useLogDataProcessing = (
  data: Row[],
  filters: LogFilters,
  monthlyDocuments?: { [key: string]: { monthName: string; entries: Row[] } }
) => {
  // Filter data based on filters
  const filteredData = useMemo(() => {
    let filtered = data;

    // Date filter
    if (filters.date.startDate || filters.date.endDate) {
      filtered = filtered.filter((entry) => {
        const entryDate = entry.datelog;
        const startDate = filters.date.startDate ? new Date(filters.date.startDate) : null;
        const endDate = filters.date.endDate ? new Date(filters.date.endDate) : null;

        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
    }

    // Amount filter
    if (filters.amount.minAmount || filters.amount.maxAmount) {
      filtered = filtered.filter((entry) => {
        const dayTotal = entry.daytotal;
        const minAmount = filters.amount.minAmount ? parseFloat(filters.amount.minAmount) : null;
        const maxAmount = filters.amount.maxAmount ? parseFloat(filters.amount.maxAmount) : null;

        if (minAmount && dayTotal < minAmount) return false;
        if (maxAmount && dayTotal > maxAmount) return false;
        return true;
      });
    }

    // Type filter
    if (!filters.type.cash || !filters.type.credit) {
      filtered = filtered.filter((entry) => {
        if (!filters.type.cash && entry.cashamount > 0) return false;
        if (!filters.type.credit && entry.credits.some((credit) => credit > 0)) return false;
        return true;
      });
    }

    // Location filter
    if (filters.location.selectedLocation) {
      filtered = filtered.filter((entry) => {
        return entry.location === filters.location.selectedLocation;
      });
    }

    return filtered;
  }, [data, filters]);

  // Use monthlyDocuments from database if available, otherwise group filtered data
  const groupedData = useMemo(() => {
    if (monthlyDocuments) {
      // Use the monthlyDocuments from the database, but apply filters to entries
      const filteredGroupedData: GroupedData = {};

      Object.entries(monthlyDocuments).forEach(([monthKey, monthData]) => {
        // Check if this month belongs to the selected location
        if (filters.location.selectedLocation) {
          const locationFromKey = monthKey.split("-")[0]; // Extract location from key (e.g., "Oakville-sep-2025" -> "Oakville")
          if (locationFromKey !== filters.location.selectedLocation) {
            return; // Skip this month if it doesn't match the selected location
          }
        }

        const filteredEntries = monthData.entries.filter((entry) => {
          // Apply the same filters as above
          const entryDate = entry.datelog;
          const startDate = filters.date.startDate ? new Date(filters.date.startDate) : null;
          const endDate = filters.date.endDate ? new Date(filters.date.endDate) : null;

          if (startDate && entryDate < startDate) return false;
          if (endDate && entryDate > endDate) return false;

          const dayTotal = entry.daytotal;
          const minAmount = filters.amount.minAmount ? parseFloat(filters.amount.minAmount) : null;
          const maxAmount = filters.amount.maxAmount ? parseFloat(filters.amount.maxAmount) : null;

          if (minAmount && dayTotal < minAmount) return false;
          if (maxAmount && dayTotal > maxAmount) return false;

          if (!filters.type.cash && entry.cashamount > 0) return false;
          if (!filters.type.credit && entry.credits.some((credit) => credit > 0)) return false;

          return true;
        });

        filteredGroupedData[monthKey] = {
          monthName: monthData.monthName,
          entries: filteredEntries,
        };
      });

      return filteredGroupedData;
    } else {
      // Fallback to grouping filtered data by month and year
      return filteredData.reduce((acc, entry) => {
        const date = new Date(entry.datelog);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("en-US", { year: "numeric", month: "long" });

        // Initialize the month group if it doesn't exist
        if (!acc[monthYear]) {
          acc[monthYear] = {
            monthName,
            entries: [],
          };
        }

        acc[monthYear].entries.push(entry);
        return acc;
      }, {} as GroupedData);
    }
  }, [filteredData, monthlyDocuments, filters]);

  // Sort months in descending order (most recent first)
  const sortedMonths = useMemo(() => {
    return Object.entries(groupedData).sort(([monthKeyA], [monthKeyB]) =>
      monthKeyB.localeCompare(monthKeyA)
    );
  }, [groupedData]);

  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState<string>(sortedMonths[0]?.[0] || "");

  // Update selected month when sortedMonths changes
  useEffect(() => {
    if (sortedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(sortedMonths[0][0]);
    }
  }, [sortedMonths, selectedMonth]);

  // Get current month data
  const currentMonthData = groupedData[selectedMonth] ?? { monthName: "", entries: [] };

  return {
    filteredData,
    groupedData,
    sortedMonths,
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
  };
};
