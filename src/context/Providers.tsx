import PropTypes from "prop-types";
import React, { PropsWithChildren, useMemo, useState } from "react";

import {
  CustomerContext,
  DisplayContext,
  CustomerNamesContext,
  TransactionContext,
  FilterContext,
  TotalContext,
} from "./Context";
import { Customer, Display, Filters, Transaction } from "../types";

/**
 * Groups all context providers for the application to reduce nesting and context switching.
 * @param props The children to be wrapped by providers.
 * @returns The wrapped children with all providers.
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

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
