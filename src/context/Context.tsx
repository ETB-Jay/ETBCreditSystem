// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { createContext, Dispatch, SetStateAction } from "react";

import { Customer, Display, Filters, Transaction } from "../types";

/**
 * @description Context for the Customer's Name. This is used for
 * controlling the state of the table relative to the selected name on the list.
 */
interface CustomerContextType {
  customer: Customer | null;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
}
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);
CustomerContext.displayName = "CustomerContext";

/**
 * @description Context for the current Display.
 * There are 6 unique displays:
 * - "default" - the default display when the app loads in
 * - "user" - the display when adding a new user
 * - "transaction" - the display when adding a new transaction
 * - "report" - the display when viewing the report
 * - "edit" - the display when editing a customer's details
 * - "delete" - the display when deleting a customer
 */
interface DisplayContextType {
  display: Display;
  setDisplay: Dispatch<SetStateAction<Display>>;
}

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);
DisplayContext.displayName = "DisplayContext";

/** @description Context for the Customer Names. */
interface CustomerNamesContextType {
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
}
const CustomerNamesContext = createContext<CustomerNamesContextType | undefined>(undefined);
CustomerNamesContext.displayName = "CustomerNamesContext";

/** @description Context to store the Transactional Data. */
interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
}
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);
TransactionContext.displayName = "TransactionContext";

/** @description Context to store the Filter Data. */
interface FilterContextType {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);
FilterContext.displayName = "FilterContext";

/** @description Context to store the total number of customers. */
interface TotalContextType {
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
}

const TotalContext = createContext<TotalContextType | undefined>(undefined);
TotalContext.displayName = "TotalContext";

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export {
  CustomerContext,
  DisplayContext,
  CustomerNamesContext,
  TransactionContext,
  FilterContext,
  TotalContext,
};
