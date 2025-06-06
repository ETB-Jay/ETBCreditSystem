import { useDisplay, useCustomerNames, useTotal } from '../context/useContext'
import { useState, useEffect } from 'react'
import { Prompt, PromptButton, PromptField, PromptInput, PromptTitle } from './components'
import { db } from '../firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

/**
 * A prompt that allows the user to add a new customer to the system. It appears only
 * when the state is "customer"
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function CustomerPrompt() {
    const { setCustomers, customers } = useCustomerNames()
    const [newCustomer, setNewCustomer] = useState({})
    const [errors, setErrors] = useState({})
    const { setDisplay } = useDisplay()
    const { total, setTotal } = useTotal()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setNewCustomer({})
        setErrors("")
    }, [])

    /**
     * Validates the new Customer
     * @returns {boolean} If the newCustomer is valid
     */
    const validate = () => {
        const errs = {}
        const { first_name, last_name, email, phone } = newCustomer

        if (!first_name?.trim()) {
            errs.first_name = "First name is required"
        }

        if (!last_name?.trim()) {
            errs.last_name = "Last name is required"
        }

        const emailTrimmed = email?.trim() || ""
        const phoneTrimmed = phone?.trim() || ""
        const phoneDigits = phoneTrimmed.replace(/\D/g, "")
        if (emailTrimmed && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailTrimmed)) {
            errs.email = "Please enter a valid email address"
        }
        if (phoneTrimmed && phoneDigits.length !== 10) {
            errs.phone = "Phone number must be 10 digits"
        }
        return errs
    }

    const handleSubmit = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)

        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            setIsSubmitting(false)
            return
        }

        try {
            const customerData = {
                customer_id: total + 1,
                first_name: newCustomer.first_name.trim(),
                last_name: newCustomer.last_name.trim(),
                email: newCustomer.email?.trim() || "",
                phone: newCustomer.phone?.trim() || "",
                balance: 0,
                transactions: []
            }
            
            const min = (Math.floor(customerData.customer_id / 100) - (customerData.customer_id % 100 === 0)) * 100 + 1
            const max = (Math.floor(customerData.customer_id / 100) + (customerData.customer_id % 100 !== 0)) * 100
            const arrayName = `${min}_min_${max}_max`

            const docRef = doc(db, 'customers', arrayName)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const currentCustomers = docSnap.data().customers || []
                await updateDoc(docRef, {
                    customers: [...currentCustomers, customerData],
                    count: currentCustomers.length + 1
                })
            } else {
                await setDoc(docRef, {
                    customers: [customerData],
                    count: 1
                })
            }

            setCustomers([...customers, customerData])
            setTotal(total + 1)

            setDisplay("default")
        } catch (error) {
            console.error('Error adding customer:', error)
            setErrors({ submit: "Failed to add customer. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setNewCustomer({})
        setErrors("")
        setDisplay("default")
    }

    return (
        <Prompt>
            <PromptTitle label="New Customer" />
            <PromptField label="First Name" error={errors.first_name}>
                <PromptInput
                    type="text"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Last Name" error={errors.last_name}>
                <PromptInput
                    type="text"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Email" error={errors.email}>
                <PromptInput
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Phone Number" error={errors.phone}>
                <PromptInput
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-end space-x-3">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Add Customer"}
                </PromptButton>
                <PromptButton
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}>
                    Cancel
                </PromptButton>
            </div>
        </Prompt>
    )
}

export default CustomerPrompt