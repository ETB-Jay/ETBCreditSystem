import { handleTransaction, getRecords, customerTable } from '../airtable/airtable'
import { useState, useEffect } from 'react'
import { useDisplay, useCustomer, useCustomerNames, useTransactions } from '../context/useContext'
import { Prompt, PromptTitle, PromptButton, PromptField, PromptInput } from './components'
import { initializeCustomers, initializeTransactions } from '../initializeData'

/**
 * A prompt that allows the user to add a new transaction to the system. It appears only
 * when the state is "transaction"
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function TransactionPrompt() {
    const { customer, setCustomer } = useCustomer()
    const [newTransaction, setNewTransaction] = useState({})
    const { setDisplay } = useDisplay()
    const [errors, setErrors] = useState({
        insufficient: "",
        noEmployee: ""
    })
    const [isSubmitting, setIsSubmitting] = useState()
    const [payment, setPayment] = useState({ add: false, sub: false })
    const { setCustomers } = useCustomerNames()
    const { setTransaction } = useTransactions()

    useEffect(() => {
        setNewTransaction({})
        setErrors({
            insufficient: "",
            noEmployee: ""
        })
        setPayment({ add: false, sub: false })
    }, [])

    const handlePaymentType = (type) => {
        const newPaymentState = {
            add: type === "add",
            sub: type === "sub"
        }
        setPayment(newPaymentState)
        if (newTransaction.change_balance) {
            const amount = Math.abs(Number(newTransaction.change_balance))
            setNewTransaction({
                ...newTransaction,
                change_balance: type === "add" ? amount : -amount
            })
        }
    }

    const updateTransaction = async () => {
        if (isSubmitting) return false
        setIsSubmitting(true)
        setErrors("")

        try {
            const delta = Math.abs(Number(newTransaction.change_balance))
            if (!newTransaction.change_balance || isNaN(delta)) {
                setErrors(errors => ({ ...errors, insufficient: "Amount is required and must be a valid number." }))
                return false
            } else if (!newTransaction.employee_name?.trim()) {
                setErrors(errors => ({ ...errors, noEmployee: "Please enter your name!" }))
                return false
            }
            const transactionData = {
                ...newTransaction,
                customer_id: customer.customer_id,
                date: new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
            }
            const result = await handleTransaction(transactionData, customer)
            if (!result) {
                setErrors(prev => ({ ...prev, insufficient: "Transaction failed - no response received" }))
                return false
            } else if (result.error) {
                setErrors(prev => ({ ...prev, insufficient: result.error.message || "Transaction failed" }))
                return false
            }
            // Initialize both customers and transactions data
            await Promise.all([
                initializeCustomers(setCustomers),
                initializeTransactions(setTransaction)
            ])
            // Update the current customer with fresh data
            const updatedCustomers = await getRecords(customerTable, { filterByFormula: `{id} = "${customer.id}"` })
            setCustomer(updatedCustomers[0])
            return true
        } catch (error) {
            setErrors(prev => ({ ...prev, insufficient: error.message || "An unexpected error occurred during the transaction" }))
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async () => {
        const valid = await updateTransaction()
        if (valid) {
            setDisplay("default")
        }
    }

    return (
        <Prompt>
            <PromptTitle label="New Transaction"></PromptTitle>
            <PromptField label="Amount" error={errors.insufficient}>
                <div className="flex items-center gap-2 w-full">
                    <PromptInput
                        type="number"
                        step="0.01"
                        value={newTransaction.change_balance ? Math.abs(Number(newTransaction.change_balance)) : ""}
                        onChange={(input) => {
                            const value = input.target.value;
                            const amount = value ? Number(value) : "";
                            setNewTransaction({
                                ...newTransaction,
                                change_balance: payment.sub ? -amount : amount
                            });
                        }}
                        disabled={isSubmitting}
                    />
                    <button
                        className={`bg-emerald-500/20 rounded-full h-7 w-7 flex items-center justify-center hover:bg-emerald-500/40 cursor-pointer transition-colors ${payment.add ? "bg-emerald-500/50 ring-2 ring-emerald-500/60" : ""}`}
                        onClick={() => handlePaymentType("add")}
                    >+</button>
                    <button
                        className={`bg-rose-500/20 rounded-full h-7 w-7 flex items-center justify-center hover:bg-rose-500/40 cursor-pointer transition-colors ${payment.sub ? "bg-rose-500/50 ring-2 ring-rose-500/60" : ""}`}
                        onClick={() => handlePaymentType("sub")}
                    >-</button>
                </div>
            </PromptField>
            <PromptField label="Employee Name" error={errors.noEmployee}>
                <PromptInput
                    value={newTransaction.employee_name}
                    onChange={(input) => setNewTransaction({ ...newTransaction, employee_name: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Notes">
                <PromptInput
                    value={newTransaction.notes}
                    onChange={(input) => setNewTransaction({ ...newTransaction, notes: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-center gap-4 mt-2">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Save Changes"}
                </PromptButton>
                <PromptButton
                    onClick={() => setDisplay("default")}
                    disabled={isSubmitting}
                >
                    Cancel
                </PromptButton>
            </div>
        </Prompt>
    )
}

export default TransactionPrompt

