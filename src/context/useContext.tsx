// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { useContext } from "react";

import {
  CustomerContext,
  DisplayContext,
  CustomerNamesContext,
  TransactionContext,
  FilterContext,
  TotalContext,
} from "./Context";

/**
 * Custom hook to access the Customer context.
 * @returns The customer context value.
 * @throws If used outside of CustomerProvider.
 */
const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used in the CustomerProvider");
  }
  return context;
};

/**
 * Custom hook to access the Display context.
 * @returns The display context value.
 * @throws If used outside of DisplayProvider.
 */
const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error("useDisplay must be used in the DisplayProvider");
  }
  return context;
};

/**
 * Custom hook to access the CustomerNames context.
 * @returns The customer names context value.
 * @throws If used outside of CustomerNamesProvider.
 */
const useCustomerNames = () => {
  const context = useContext(CustomerNamesContext);
  if (!context) {
    throw new Error("useCustomerNames must be used in the CustomerNamesProvider");
  }
  return context;
};

/**
 * Custom hook to access the Transactions context.
 * @returns The transactions context value.
 * @throws If used outside of TransactionsProvider.
 */
const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used in the TransactionsProvider");
  }
  return context;
};

/**
 * Custom hook to access the Filters context.
 * @returns The filters context value.
 * @throws If used outside of FilterProvider.
 */
const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used in the FilterProvider");
  }
  return context;
};

/**
 * Custom hook to access the Total context.
 * @returns The total context value.
 * @throws If used outside of TotalProvider.
 */
const useTotal = () => {
  const context = useContext(TotalContext);
  if (!context) {
    throw new Error("useTotal must be used in the TotalProvider");
  }
  return context;
};

// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
export { useCustomer, useDisplay, useCustomerNames, useTransactions, useFilters, useTotal };
