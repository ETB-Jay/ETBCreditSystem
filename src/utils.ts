import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Row } from "./types";

const cn = (...inputs: (string | undefined | null | false)[]): string => twMerge(clsx(inputs));

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatCellValue = (header: string, value: Date | number): string => {
  if (header === "datelog") {
    return (value as Date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value as number);
};

// =============================================================================
// CALCULATION FUNCTIONS (Raw Numbers)
// =============================================================================

const calculateLifetimeTotal = (data: Row[]): number =>
  data.reduce((accumulator, currentValue) => accumulator + currentValue.daytotal, 0);

// Calculates average daily earnings
const calculateAveragePerDay = (data: Row[]): number => calculateLifetimeTotal(data) / data.length;

// Calculates total cash amount across all data
const calculateLifetimeCash = (data: Row[]): number =>
  data.reduce((accumulator, currentVal) => accumulator + currentVal.cashamount, 0);

// Calculates total credit card amounts across all data
const calculateLifetimeCredit = (data: Row[]): number =>
  data.reduce(
    (accumulator, currentVal) =>
      accumulator + currentVal.credits.reduce((sum, credit) => sum + credit, 0),
    0
  );

// =============================================================================
// FORMATTED OUTPUT FUNCTIONS (Currency Strings)
// =============================================================================

// Returns lifetime total earnings as formatted currency
const LifetimeTotal = (data: Row[]): string => formatCurrency(calculateLifetimeTotal(data));

// Returns average daily earnings as formatted currency
const AveragePerDay = (data: Row[]): string => formatCurrency(calculateAveragePerDay(data));

// Returns lifetime cash total as formatted currency
const LifetimeCash = (data: Row[]): string => formatCurrency(calculateLifetimeCash(data));

// Returns lifetime credit card total as formatted currency
const LifetimeCredit = (data: Row[]): string => formatCurrency(calculateLifetimeCredit(data));

// =============================================================================
// DATABASE UTILITIES
// =============================================================================

// Sanitizes location string for database table name
const sanitizeTableName = (location: string): string => {
  return location.toLowerCase().replace(/[^a-z0-9]/g, "_");
};

// Validates credit column name format (c1, c2, etc.)
const validateCreditColumnName = (columnName: string): boolean => {
  return /^c[0-9]+$/.test(columnName);
};

// Validates date format (YYYY-MM-DD)
const validateDateFormat = (dateString: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

// Validates file type for image uploads
const validateImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

// Validates file size (max 5MB)
const validateFileSize = (file: File): boolean => {
  return file.size <= 5 * 1024 * 1024;
};

/**
 * Checks if an entry can be edited based on its date.
 * Editing is only allowed on the day of logging and the day after.
 */
const canEditEntry = (entryDate: Date | { toDate: () => Date }): boolean => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Normalize dates to compare only year, month, and day (ignore time)
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Handle both Date objects and Firebase timestamps
  let normalizedEntryDate: Date;
  if (entryDate instanceof Date) {
    normalizedEntryDate = normalizeDate(entryDate);
  } else if (typeof entryDate === "object" && entryDate !== null && "toDate" in entryDate) {
    normalizedEntryDate = normalizeDate((entryDate as { toDate: () => Date }).toDate());
  } else {
    normalizedEntryDate = normalizeDate(new Date(entryDate));
  }

  const normalizedToday = normalizeDate(today);
  const normalizedYesterday = normalizeDate(yesterday);

  // Allow editing if entry is from today or yesterday
  return (
    normalizedEntryDate.getTime() === normalizedToday.getTime() ||
    normalizedEntryDate.getTime() === normalizedYesterday.getTime()
  );
};

/**
 * Checks if the current date has already been logged.
 * Returns true if an entry exists for today's date.
 */
const isCurrentDateLogged = (logData: Array<{ datelog: Date }>): boolean => {
  const today = new Date();

  // Normalize dates to compare only year, month, and day (ignore time)
  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const normalizedToday = normalizeDate(today);

  // Check if any entry has today's date
  return logData.some((entry) => {
    // Handle both Date objects and Firebase timestamps
    let entryDate: Date;
    if (entry.datelog instanceof Date) {
      entryDate = entry.datelog;
    } else if (
      typeof entry.datelog === "object" &&
      entry.datelog !== null &&
      "toDate" in entry.datelog
    ) {
      entryDate = (entry.datelog as { toDate: () => Date }).toDate();
    } else {
      entryDate = new Date(entry.datelog);
    }

    const normalizedEntryDate = normalizeDate(entryDate);
    return normalizedEntryDate.getTime() === normalizedToday.getTime();
  });
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // UI Utilities
  cn,

  // Formatting Utilities
  formatCurrency,
  formatCellValue,

  // Calculation Functions (Raw Numbers)
  calculateLifetimeTotal,
  calculateAveragePerDay,
  calculateLifetimeCash,
  calculateLifetimeCredit,

  // Formatted Output Functions (Currency Strings)
  LifetimeTotal,
  AveragePerDay,
  LifetimeCash,
  LifetimeCredit,

  // Database Utilities
  sanitizeTableName,
  validateCreditColumnName,
  validateDateFormat,
  validateImageFile,
  validateFileSize,
  canEditEntry,
  isCurrentDateLogged,
};
