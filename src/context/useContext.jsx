import { CustomerContext, DisplayContext, CustomerNamesContext, TransactionContext} from './Context'
import { useContext } from 'react'

const useCustomer = () => {
    const context = useContext(CustomerContext)
    if (!context) {
        throw new Error("useCustomer must be used in the CustomerProvider")
    }
    return context
}

const useDisplay = () => {
  const context = useContext(DisplayContext)
  if (!context) {
    throw new Error("useDisplay must be used in the DisplayProvider")
  }
  return context
}

const useCustomerNames = () => {
    const context = useContext(CustomerNamesContext)
    if (!context) {
        throw new Error("useCustomerNames must be used in the CustomerNamesProvider")
    }
    return context
}


const useTransactions = () => {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error("useTransactions must be used in the TransactionsProvider")
    }
    return context
}


export { useCustomer, useDisplay, useCustomerNames, useTransactions }
