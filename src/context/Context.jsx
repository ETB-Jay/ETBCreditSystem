import { createContext } from 'react'

/**
 * @description Context for the Customer's Name. This is used for 
 * controlling the state of the table relative to the selected name on the list.
 */
const CustomerContext = createContext()
CustomerContext.displayName = "CustomerContext"

/**
 * @description Context for the current Display. 
 * There are 5 unique displays:
 * - "default" - the default display when the app loads in
 * - "user" - the display when adding a new user
 * - "transaction" - the display when adding a new transaction
 * - "report" - the display when viewing the report
 * - "edit" - the display when editing a customer's details
 */
const DisplayContext = createContext("login")
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

/**
 * @description Context to store the Filter Data.
 */
const FilterContext = createContext()
FilterContext.displayName = "FilterContext"

/**
 * @description Context to store the total number of customers.
 */
const TotalContext = createContext(0)
TotalContext.displayName = "TotalContext"

export { 
    CustomerContext, 
    DisplayContext, 
    CustomerNamesContext, 
    TransactionContext,
    FilterContext,
    TotalContext
}