import { useMemo, useState } from 'react'
import { CustomerContext, DisplayContext, CustomerNamesContext, TransactionContext, FilterContext, TotalContext } from './Context'
import PropTypes from 'prop-types'

const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null)
  const value = useMemo(() => ({ customer, setCustomer }), [customer])
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

const DisplayProvider = ({ children }) => {
  const [display, setDisplay] = useState(null)
  const value = useMemo(() => ({ display, setDisplay }), [display])
  return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>
}

const CustomerNamesProvider = ({ children }) => {
  const [customers, setCustomers] = useState([])
  const value = useMemo(() => ({ customers, setCustomers }), [customers])
  return <CustomerNamesContext.Provider value={value}>{children}</CustomerNamesContext.Provider>
}

const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])
  const value = useMemo(() => ({ transactions, setTransactions }), [transactions])
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({})
  const value = useMemo(() => ({ filters, setFilters }), [filters])
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

const TotalProvider = ({ children }) => {
  const [total, setTotal] = useState(0)
  const value = useMemo(() => ({ total, setTotal }), [total])
  return <TotalContext.Provider value={value}>{children}</TotalContext.Provider>
}

const Providers = ({ children }) => {
  return (
    <CustomerProvider>
      <DisplayProvider>
        <CustomerNamesProvider>
          <TransactionProvider>
            <FilterProvider>
              <TotalProvider>
                {children}
              </TotalProvider>
            </FilterProvider>
          </TransactionProvider>
        </CustomerNamesProvider>
      </DisplayProvider>
    </CustomerProvider>
  )
}

Providers.propTypes = {
  children: PropTypes.node.isRequired
}

export { CustomerProvider, DisplayProvider, CustomerNamesProvider, TransactionProvider, FilterProvider, TotalProvider }
export default Providers
