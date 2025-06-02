import { useMemo, useState } from 'react'
import { CustomerContext, DisplayContext, CustomerNamesContext, TransactionContext, FilterContext } from './Context'
import PropTypes from 'prop-types'

const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState({})
  const CustomerObject = useMemo(() => ({ customer, setCustomer }), [customer, setCustomer])
  return (
    <CustomerContext.Provider value={CustomerObject}>
      {children}
    </CustomerContext.Provider>
  )
}

CustomerProvider.propTypes = {
  children: PropTypes.node.isRequired
}

const DisplayProvider = ({ children }) => {
  const [display, setDisplay] = useState("default")
  const DisplayObject = useMemo(() => ({ display, setDisplay }), [display, setDisplay])
  return (
    <DisplayContext.Provider value={DisplayObject}>
      {children}
    </DisplayContext.Provider>
  )
}

DisplayProvider.propTypes = {
  children: PropTypes.node.isRequired
}

const CustomerNamesProvider = ({ children }) => {
  const [customers, setCustomers] = useState([])
  const CustomerNamesObject = useMemo(() => ({ customers, setCustomers }), [customers, setCustomers])
  return (
    <CustomerNamesContext.Provider value={CustomerNamesObject}>
      {children}
    </CustomerNamesContext.Provider>
  )
}

CustomerNamesProvider.propTypes = {
  children: PropTypes.node.isRequired
}

const TransactionProvider = ({ children }) => {
  const [transaction, setTransaction] = useState([])
  const TransactionObject = useMemo(() => {
    return { transaction, setTransaction }
  }, [transaction, setTransaction])
  return (
    <TransactionContext.Provider value={TransactionObject}>
      {children}
    </TransactionContext.Provider>
  )
}

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired
}

const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({})
  const FilterObject = useMemo(() => ({ filters, setFilters }), [filters, setFilters])
  return (
    <FilterContext.Provider value={FilterObject}>
      {children}
    </FilterContext.Provider>
  )
}

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { CustomerProvider, DisplayProvider, CustomerNamesProvider, TransactionProvider, FilterProvider }
