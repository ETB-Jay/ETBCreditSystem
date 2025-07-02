interface Transaction {
    /** @requires change_balance cannot have more than 2 decimal places */
    change_balance: number;
    date: Date | { seconds: number };
    employee_name: string;
    notes: string;
}

interface Customer {
    /** @requires balance cannot have more than 2 decimal places */
    balance: number;
    customer_id: number;
    /** @requires email must follow the correct email address format <username>@<domain>.<tld> */
    email: string;
    first_name: string;
    last_name: string;
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

type Display = 'default' | 'user' | 'transaction' | 'report' | 'edit' | 'delete' | 'login';

export type { Customer, Transaction, CustomerList, Display, Filters };