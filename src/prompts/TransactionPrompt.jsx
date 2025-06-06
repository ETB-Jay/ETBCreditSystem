import { useState, useEffect } from 'react'
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext'
import { Prompt, PromptTitle, PromptButton, PromptField, PromptInput } from './components'
import { db } from '../firebase'
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore'

/**
 * A prompt that allows the user to add a new transaction to the system. It appears only
 * when the state is "transaction".
 * 
 * @component
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function TransactionPrompt() {
    const { customer } = useCustomer()
    const { setCustomers } = useCustomerNames()
    const [newTransaction, setNewTransaction] = useState({})
    const { setDisplay } = useDisplay()
    const [errors, setErrors] = useState({
        invalidValue: "",
        noEmployee: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [payment, setPayment] = useState({
        add: false,
        sub: false
    })

    useEffect(() => {
        setNewTransaction({})
        setErrors({
            invalidValue: "",
            noEmployee: ""
        })
        setPayment({ add: false, sub: false })
    }, [])

    //
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

    //
    const updateTransaction = async () => {
        if (isSubmitting) {
            return false
        }
        setIsSubmitting(true)
        setErrors({
            invalidValue: "",
            noEmployee: ""
        })
        try {
            const delta = Number(newTransaction.change_balance)
            console.log(newTransaction.change_balance)
            if (!delta || isNaN(delta)) {
                setErrors(errors => ({ ...errors, invalidValue: "Amount is Required and Must be a Valid Number!" }))
                return false
            } else if (!(/^(-)?\d+(\.\d{1,2})?$/.test(delta))) {
                setErrors(errors => ({ ...errors, invalidValue: "Amount Must Have a Valid Number of Decimal Places!" }))
                return false
            } else if (!payment.add && !payment.sub) {
                setErrors(errors => ({ ...errors, invalidValue: "Please Indicate Transaction Type!" }))
                return false
            } else if (!newTransaction.employee_name?.trim()) {
                setErrors(errors => ({ ...errors, noEmployee: "Please Enter Your Name!" }))
                return false
            }
            const transactionData = {
                employee_name: newTransaction.employee_name.trim(),
                change_balance: Number(delta),
                notes: newTransaction.notes?.trim() || "",
                date: Timestamp.now()
            }
            if (!customer) {
                console.error('Customer is undefined')
                throw new Error('Customer data is not properly loaded')
            }
            const min = (Math.floor(customer.customer_id / 100) - (customer.customer_id % 100 === 0)) * 100 + 1
            const max = (Math.floor(customer.customer_id / 100) + (customer.customer_id % 100 !== 0)) * 100
            const arrayName = `${min}_min_${max}_max`
            const customerDoc = await getDoc(doc(db, 'customers', arrayName))
            const currentCustomers = customerDoc.data()?.customers || []

            const updatedCustomers = currentCustomers.map(c => {
                if (c.customer_id === customer.customer_id) {
                    return {
                        ...c,
                        transactions: [...(c.transactions || []), transactionData],
                        balance: Number(c.balance) + transactionData.change_balance
                    }
                }
                return c
            })
            await updateDoc(doc(db, 'customers', arrayName), {
                customers: updatedCustomers
            })
            setCustomers(prevCustomers => 
                prevCustomers.map(c => 
                    c.customer_id === customer.customer_id 
                        ? {
                            ...c,
                            balance: Number(c.balance) + Number(transactionData.change_balance),
                            transactions: [...(c.transactions || []), transactionData]
                        }
                        : c
                )
            )

            return true
        } catch (error) {
            setErrors(prev => ({ ...prev, invalidValue: error.message || "An unexpected error occurred during the transaction" }))
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
            <PromptTitle label="New Transaction" />
            <PromptField label="Amount" error={errors.invalidValue}>
                <div className="flex items-center gap-2 w-full">
                    <PromptInput
                        type="number"
                        step="0.01"
                        value={newTransaction.change_balance ? Math.abs(Number(newTransaction.change_balance)) : ""}
                        onChange={(input) => {
                            const value = input.target.value;
                            const amount = value ? Math.abs(Number(value)) : "";
                            setNewTransaction({
                                ...newTransaction,
                                change_balance: payment.sub ? -amount : amount
                            });
                        }}
                        disabled={isSubmitting}
                    />
                    <button
                        className={`bg-emerald-500/20 rounded-full h-7 w-7 flex items-center justify-center hover:bg-emerald-500/40 cursor-pointer transition-colors select-none ${payment.add ? "bg-emerald-500/50 ring-2 ring-emerald-500/60" : ""}`}
                        onClick={() => handlePaymentType("add")}
                    >
                        +
                    </button>
                    <button
                        className={`bg-rose-500/20 rounded-full h-7 w-7 flex items-center justify-center hover:bg-rose-500/40 cursor-pointer transition-colors select-none ${payment.sub ? "bg-rose-500/50 ring-2 ring-rose-500/60" : ""}`}
                        onClick={() => handlePaymentType("sub")}
                    >
                        -
                    </button>
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
                    {isSubmitting ? "Processing..." : "Confirm"}
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

