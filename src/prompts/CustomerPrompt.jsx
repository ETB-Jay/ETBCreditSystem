import { useDisplay, useCustomerNames, useTotal } from '../context/useContext';
import { useState, useEffect } from 'react';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { db, fetchCustomers, getHighestCustomerId } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getDocumentName, validateCustomerInfo } from './scripts';

/**
 * A prompt that allows the user to add a new customer to the system. It appears only
 * when the state is "customer"
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function CustomerPrompt() {
    const { setCustomers } = useCustomerNames();
    const [newCustomer, setNewCustomer] = useState({});
    const [errors, setErrors] = useState({});
    const { setDisplay } = useDisplay();
    const { setTotal } = useTotal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setNewCustomer({});
        setErrors('');
    }, []);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const errs = validateCustomerInfo(newCustomer);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setIsSubmitting(false);
            return;
        }

        try {
            const highestCustomerId = await getHighestCustomerId();
            const newCustomerId = highestCustomerId + 1;
            const arrayName = getDocumentName(newCustomerId);

            const docRef = doc(db, 'customers', arrayName);
            const docSnap = await getDoc(docRef);

            const customerData = {
                customer_id: newCustomerId,
                first_name: newCustomer.first_name.trim(),
                last_name: newCustomer.last_name.trim(),
                email: newCustomer.email?.trim() || '',
                phone: newCustomer.phone?.trim() || '',
                balance: 0,
                transactions: []
            };

            if (docSnap.exists()) {
                const currentCustomers = docSnap.data().customers || [];
                await updateDoc(docRef, {
                    customers: [...currentCustomers, customerData],
                    count: currentCustomers.length + 1
                });
            } else {
                await setDoc(docRef, {
                    count: 1,
                    customers: [customerData]
                });
            };
            try {
                const [customersData] = await Promise.all([
                    fetchCustomers()
                ]);
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
        setErrors('');
        setDisplay('default');
    };

    return (
        <Prompt title="New Customer">
            <PromptField error={errors.first_name}>
                <PromptInput
                    label="First Name"
                    type="text"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.last_name}>
                <PromptInput
                    label="Last Name"
                    type="text"
                    value={newCustomer.last_name}
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
                    value={newCustomer.email}
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
                    value={newCustomer.phone}
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
                />
                <PromptButton
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                />
            </div>
        </Prompt>
    );
}

export default CustomerPrompt;