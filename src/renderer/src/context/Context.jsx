import { createContext } from 'react'

/**
 * @description Context for the Customer's Name. This is used for 
 * controlling the state of the table relative to the selected name on the list.
 */
const CustomerContext = createContext()
CustomerContext.displayName = "CustomerContext"

/**
 * @description Context for the current Display. 
 */
const DisplayContext = createContext("default")
DisplayContext.displayName = "DisplayContext"

/**
 * @description Context for the Customer Names.
 */
const CustomerNamesContext = createContext()
CustomerNamesContext.displayName = "CustomerNamesContext"

/**
 * @description Context to store the Transactional Data.
 */
const TransactionContext = createContext()
TransactionContext.displayName = "TransactionContext"

export { 
    CustomerContext, 
    DisplayContext, 
    CustomerNamesContext, 
    TransactionContext 
}