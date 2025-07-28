/** A Transaction as stored in Firebase */
interface Transaction {
  /** @requires change_balance cannot have more than 2 decimal places */
  changeBalance: number;
  date: Date | { seconds: number };
  employeeName: string;
  notes: string;
}

/** A Customer as stored in Firebase */
interface Customer {
  /** @requires balance cannot have more than 2 decimal places */
  balance: number;
  customerID: number;
  /** @requires email must follow the correct email address format <username>@<domain>.<tld> */
  email: string;
  firstName: string;
  lastName: string;
  notes: string;
  /** @requires phone must be a 10 digit number */
  phone: string;
  transactions: Transaction[];
}

/** A list of Customers */
interface CustomerList {
  customers: Customer[];
  /** @requires number must be a non-negative integer */
  total: number;
}

/** Table Filters */
interface Filters {
  date: {
    startDate: string;
    endDate: string;
  };
  amount: {
    minAmount: string;
    maxAmount: string;
  };
  employee: {
    searchTerm: string;
  };
}

/** The different displays */
type Display =
  | "default"
  | "user"
  | "transaction"
  | "report"
  | "edit"
  | "delete"
  | "login"
  | "DateFilter"
  | "AmountFilter"
  | "EmployeeFilter";

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export type { Customer, Transaction, CustomerList, Display, Filters };
