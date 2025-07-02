import { useDisplay, useCustomerNames, useTotal } from '../context/useContext';
import { useState, useEffect } from 'react';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { db, fetchCustomersOnce, getHighestCustomerId } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDocumentName, validateCustomerInfo, getCustomerDoc } from './scripts';
import type { Customer } from '../types';

/**
 * Checks if an object is empty (has no own properties and is a plain object).
 * @param obj The object to check.
 * @returns True if the object is empty, false otherwise.
 */
function isEmptyObject(obj: object) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Displays a prompt for adding a new customer.
 * @returns The CustomerPrompt component.
 */
function CustomerPrompt() {
    const { setCustomers } = useCustomerNames();
    const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ first_name: '', last_name: '', email: '', phone: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { setDisplay } = useDisplay();
    const { setTotal } = useTotal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setNewCustomer({ first_name: '', last_name: '', email: '', phone: '' });
        setErrors({});
    }, []);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        console.log(newCustomer);
        const errs = validateCustomerInfo(newCustomer);
        if (typeof errs === 'string') {
            setErrors({ submit: errs });
            setIsSubmitting(false);
            return;
        }
        if (Object.values(errs).some(v => v)) {
            setErrors(errs);
            setIsSubmitting(false);
            return;
        }

        try {
            const highestCustomerId = await getHighestCustomerId();
            const newCustomerId = highestCustomerId + 1;
            const arrayName = getDocumentName(newCustomerId);
            const currentCustomers = await getCustomerDoc(arrayName);
            const docRef = doc(db, 'customers', arrayName);

            const customerData = {
                customer_id: newCustomerId,
                first_name: (newCustomer.first_name ?? '').trim(),
                last_name: (newCustomer.last_name ?? '').trim(),
                email: (newCustomer.email ?? '').trim(),
                phone: (newCustomer.phone ?? '').trim(),
                balance: 0,
                transactions: []
            };

            if (currentCustomers.length > 0 && !isEmptyObject(currentCustomers[0])) {
                await updateDoc(docRef, {
                    customers: [...currentCustomers, customerData],
                    count: currentCustomers.length + 1
                });
            } else {
                await setDoc(docRef, {
                    count: 1,
                    customers: [customerData]
                });
            }
            try {
                const customersData = await fetchCustomersOnce();
                setCustomers(customersData.customers);
                setTotal(customersData.total);
            } catch (error) {
                console.error(error);
            }
            setDisplay('default');
        } catch (error) {
            console.error('Error adding customer:', error);
            setErrors({ submit: 'Failed to add customer. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setNewCustomer({});
        setErrors({});
        setDisplay('default');
    };

    return (
        <Prompt title="New Customer">
            <PromptField error={errors.first_name}>
                <PromptInput
                    label="First Name"
                    type="text"
                    value={newCustomer.first_name ?? ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.last_name}>
                <PromptInput
                    label="Last Name"
                    type="text"
                    value={newCustomer.last_name ?? ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.email}>
                <PromptInput
                    label="Email"
                    name="email"
                    type="email"
                    value={newCustomer.email ?? ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.phone}>
                <PromptInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={newCustomer.phone ?? ''}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="(123) 456-7890"
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-end space-x-3">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Processing...' : 'Add Customer'}
                    icon={null}
                />
                <PromptButton
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                    icon={null}
                />
            </div>
        </Prompt>
    );
}

export default CustomerPrompt;