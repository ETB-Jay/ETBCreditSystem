import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  PropsWithChildren,
  useState,
  useMemo,
} from "react";

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

/**
 * Groups all context providers for the application to reduce nesting and context switching.
 * @param props The children to be wrapped by providers.
 */
const AppProviders = ({ children }: PropsWithChildren) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [display, setDisplay] = useState<Display>("login");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({
    date: { startDate: "", endDate: "" },
    amount: { minAmount: "", maxAmount: "" },
    employee: { searchTerm: "" },
  });
  const [total, setTotal] = useState(0);

  const customerValue = useMemo(() => ({ customer, setCustomer }), [customer]);
  const displayValue = useMemo(() => ({ display, setDisplay }), [display]);
  const customersValue = useMemo(() => ({ customers, setCustomers }), [customers]);
  const transactionsValue = useMemo(() => ({ transactions, setTransactions }), [transactions]);
  const filtersValue = useMemo(() => ({ filters, setFilters }), [filters]);
  const totalValue = useMemo(() => ({ total, setTotal }), [total]);

  return (
    <CustomerContext.Provider value={customerValue}>
      <DisplayContext.Provider value={displayValue}>
        <CustomerNamesContext.Provider value={customersValue}>
          <TransactionContext.Provider value={transactionsValue}>
            <FilterContext.Provider value={filtersValue}>
              <TotalContext.Provider value={totalValue}>{children}</TotalContext.Provider>
            </FilterContext.Provider>
          </TransactionContext.Provider>
        </CustomerNamesContext.Provider>
      </DisplayContext.Provider>
    </CustomerContext.Provider>
  );
};

export {
  CustomerContext,
  DisplayContext,
  CustomerNamesContext,
  TransactionContext,
  FilterContext,
  TotalContext,
  useCustomer,
  useDisplay,
  useCustomerNames,
  useTransactions,
  useFilters,
  useTotal,
  AppProviders,
};
