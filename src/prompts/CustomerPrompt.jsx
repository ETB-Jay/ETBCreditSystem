import { createRecord } from '../airtable'
import { useDisplay, useCustomerNames } from '../context/useContext'
import { useState, useEffect } from 'react'
import { Prompt, PromptButton, PromptField, PromptInput, PromptTitle } from './components'
import { initializeCustomers } from '../initializeData'

/**
 * A prompt that allows the user to add a new customer to the system. It appears only
 * when the state is "customer"
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function CustomerPrompt() {
    const { setCustomers } = useCustomerNames()
    const [newCustomer, setNewCustomer] = useState({})
    const [errors, setErrors] = useState({})
    const { setDisplay } = useDisplay()
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
        } else if (first_name.trim().length < 2) {
            errs.first_name = "First name must be at least 2 characters"
        }

        if (!last_name?.trim()) {
            errs.last_name = "Last name is required"
        } else if (last_name.trim().length < 2) {
            errs.last_name = "Last name must be at least 2 characters"
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

    /**
     * Calls setCustomers and updates the new list of customers. 
     * @returns {boolean} If the newCustomer is valid
     */
    const updateCustomer = async () => {
        if (isSubmitting) return false
        setIsSubmitting(true)
        setErrors({})

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setIsSubmitting(false)
            return false
        }

        try {
            const newCustomerData = {
                ...newCustomer,
                first_name: newCustomer.first_name.trim(),
                last_name: newCustomer.last_name.trim(),
                email: newCustomer.email?.trim() || "",
                phone: newCustomer.phone?.trim() || "",
                balance: 0
            }
            await createRecord("customers", newCustomerData)
            await initializeCustomers(setCustomers)
            return true
        } catch (error) {
            setErrors({ submit: "Failed to create customer. Please try again." })
            console.error(error.message)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async () => {
        const valid = await updateCustomer()
        if (valid) {
            setDisplay("default")
        }
    }

    return (
        <Prompt>
            <PromptTitle label="Add a New Customer"></PromptTitle>
            <PromptField label="First Name" error={errors.first_name}>
                <PromptInput
                    value={newCustomer.first_name}
                    onChange={(input) => setNewCustomer({ ...newCustomer, first_name: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Last Name" error={errors.last_name}>
                <PromptInput
                    value={newCustomer.last_name}
                    onChange={(input) => setNewCustomer({ ...newCustomer, last_name: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Email" error={errors.email}>
                <PromptInput
                    type="email"
                    value={newCustomer.email}
                    onChange={(input) => setNewCustomer({ ...newCustomer, email: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label="Phone" error={errors.phone}>
                <PromptInput
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(input) => setNewCustomer({ ...newCustomer, phone: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-center gap-4">
                <PromptButton 
                    onClick={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Save Changes"}
                </PromptButton>
                <PromptButton 
                    onClick={() => setDisplay("default")}
                    disabled={isSubmitting}>
                    Cancel
                </PromptButton>
            </div>
        </Prompt>
    )
}

export default CustomerPrompt