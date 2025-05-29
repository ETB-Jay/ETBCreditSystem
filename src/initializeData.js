import { getRecords, customerTable, transactionTable } from './airtable/airtable'

/**
 * Fetches and initializes customer data
 * @param {Function} setCustomers - Updates customer state
 * @returns {Promise<void>}
 */
const initializeCustomers = async (setCustomers) => {
    try {
        const data = await getRecords(customerTable)
        data.sort((a, b) => {
            const lastNameCompare = a.last_name.localeCompare(b.last_name)
            if (lastNameCompare !== 0) return lastNameCompare
            return a.first_name.localeCompare(b.first_name)
        })
        setCustomers(data)
    } catch (error) {
        console.error('Error fetching customers:', error)
    }
}

/**
 * Fetches and initializes transaction data
 * @param {Function} setTransaction - Updates transaction state
 * @returns {Promise<void>}
 */
const initializeTransactions = async (setTransaction) => {
    try {
        const data = await getRecords(transactionTable)
        setTransaction(data)
    } catch (error) {
        console.error('Error fetching transactions:', error)
    }
}

export { initializeCustomers, initializeTransactions }
