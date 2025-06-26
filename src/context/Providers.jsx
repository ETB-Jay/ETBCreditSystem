import { useMemo, useState } from 'react';
import { CustomerContext, DisplayContext, CustomerNamesContext, TransactionContext, FilterContext, TotalContext } from './Context';
import PropTypes from 'prop-types';

// Grouped provider to reduce nesting and context switching
const AppProviders = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [display, setDisplay] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});
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
              <TotalContext.Provider value={totalValue}>
                {children}
              </TotalContext.Provider>
            </FilterContext.Provider>
          </TransactionContext.Provider>
        </CustomerNamesContext.Provider>
      </DisplayContext.Provider>
    </CustomerContext.Provider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppProviders;
