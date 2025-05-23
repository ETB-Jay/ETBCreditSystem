import Airtable from 'airtable'

const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY })
  .base(import.meta.env.VITE_AIRTABLE_BASE_ID)
const customerTable = import.meta.env.VITE_AIRTABLE_CUSTOMER_ID
const transactionTable = import.meta.env.VITE_AIRTABLE_TRANSACTIONS_ID


/**
 * @description getRecords fetches the records from Airtable 
 * @param {*} tableName 
 * @returns 
 */
const getRecords = async (tableName) => {
  try {
    const records = await base(tableName).select().firstPage()
    return records.map(record => ({ id: record.id, ...record.fields }))
  } catch (error) {
    console.error("Error fetching records:", error)
    throw error
  }
}

/**
 * @param {*} transactionData 
 * @param {*} customerData 
 * @returns 
 */
/**
 * Handles a transaction by validating customer IDs, updating the customer's balance,
 * and recording the transaction.
 *
 * @async
 * @function handleTransaction
 * @param {Object} transactionData - The transaction details, including `customer_id` and `change_balance`.
 * @param {Object} customerData - The customer details, including `customer_id`, `id`, and `balance`.
 * @returns {Promise<Object>} The transaction data if successful, or an object with an error property if IDs do not match.
 * @throws {Error} If updating the record or creating the transaction fails.
 */
const handleTransaction = async (transactionData, customerData) => {
  try {
    if (transactionData.customer_id !== customerData.customer_id) {
      return { error: new Error("id does not match!") }
    }
    const newBalance = customerData.balance + transactionData.change_balance
    const updatedData = { balance: newBalance }
    await updateRecord(customerTable, customerData.id, updatedData)
    await createRecord(transactionTable, transactionData)
    return transactionData
  } catch (error) {
    console.error("Error updating record:", error)
    throw error
  }
}

/**
 * @description createRecord inserts the record into Airtable
 * @param {*} tableName 
 * @param {*} data 
 * @returns 
 */
const createRecord = async (tableName, data) => {
  try {
    const record = await base(tableName).create(data)
    return { id: record.id, ...record.fields }
  } catch (error) {
    console.error("Error creating record:", error)
    throw error
  }
}

/**
 * @description updateRecord updates a record in Airtable
 * @param {string} tableName - The name of the table to update
 * @param {string} recordId - The ID of the record to update
 * @param {object} data - The data to update
 * @returns {Promise<object>} The updated record
 */
const updateRecord = async (tableName, recordId, data) => {
  try {
    const record = await base(tableName).update(recordId, data)
    return { id: record.id, ...record.fields }
  } catch (error) {
    console.error("Error updating record:", error)
    throw error
  }
}

export { customerTable, transactionTable, getRecords, createRecord, handleTransaction, updateRecord }
