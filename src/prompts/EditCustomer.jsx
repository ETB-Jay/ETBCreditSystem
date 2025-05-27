import { useState } from 'react'
import { updateRecord, getRecords, customerTable } from '../airtable/airtable'
import { useCustomer, useDisplay, useCustomerNames } from '../context/useContext'
import { Prompt, PromptTitle, PromptButton, PromptField, PromptInput } from './components'
import { initializeCustomers } from '../initializeData'

/**
 * A prompt containing a form that allows the user to edit the customer in question.
 * 
 * @component
 * @returns {JSX.Element} The EditCustomer prompt component.
 */
function EditCustomer() {

    const { customer, setCustomer } = useCustomer()
    const { setDisplay } = useDisplay()
    const { setCustomers } = useCustomerNames()
    const [temp, setTemp] = useState(customer)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setTemp(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Validation function
    const validate = (customer) => {
        const errs = {}
        const { first_name, last_name, email, phone } = customer
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
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async () => {
        if (isSubmitting) return false
        setIsSubmitting(true)
        setErrors({})

        const isValid = validate(temp)
        if (!isValid) {
            setIsSubmitting(false)
            return false
        }

        try {
            const { id, ...newCustomerData } = {
                ...temp,
                first_name: temp.first_name.trim(),
                last_name: temp.last_name.trim(),
                email: temp.email?.trim() || "",
                phone: temp.phone?.trim() || ""
            }
            delete newCustomerData.customer_id
            await updateRecord(customerTable, id, newCustomerData)
            
            // Initialize customers data to get fresh data
            await initializeCustomers(setCustomers)
            // Update the current customer with the fresh data
            const updatedCustomers = await getRecords(customerTable, { filterByFormula: `{id} = "${id}"` })
            setCustomer(updatedCustomers[0])
            setDisplay("default")
        } catch (error) {
            setErrors({ submit: "Failed to update customer. Please try again." })
            console.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setTemp({})
        setErrors("")
        setDisplay("default")
    }

    return (
        <Prompt>
            <PromptTitle label={"Edit Customer Information"} />
            <PromptField label={"First Name"} error={errors.first_name}>
                <PromptInput
                    type="text"
                    name="first_name"
                    value={temp.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label={"Last Name"} error={errors.last_name}>
                <PromptInput
                    type="text"
                    name="last_name"
                    value={temp.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label={"Email"} error={errors.email}>
                <PromptInput
                    type="email"
                    name="email"
                    value={temp.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField label={"Phone Number"} error={errors.phone}>
                <PromptInput
                    type="tel"
                    name="phone"
                    value={temp.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-end space-x-3">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Save Changes"}
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

export default EditCustomer 
