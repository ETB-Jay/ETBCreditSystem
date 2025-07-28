interface Transaction {
  /** @requires change_balance cannot have more than 2 decimal places */
  changeBalance: number;
  date: Date | { seconds: number };
  employeeName: string;
  notes: string;
}

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

interface CustomerList {
  customers: Customer[];
  /** @requires number must be a non-negative integer */
  total: number;
}

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

export type { Customer, Transaction, CustomerList, Display, Filters };
