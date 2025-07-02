import React from 'react';
import { useState } from 'react';
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext';
import { Prompt, PromptField, PromptInput, PromptButton } from '../components';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDocumentName, getCustomerDoc } from './scripts';
import { Customer } from '../types';

/**
 * Displays a prompt for confirming and deleting a customer.
 * @returns The DeletePrompt component.
 */
function DeletePrompt(): React.ReactElement {
    const { setDisplay } = useDisplay();
    const { customer, setCustomer } = useCustomer();
    const { customers, setCustomers } = useCustomerNames();
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const arrayName = getDocumentName(customer?.customer_id ?? 0);
            const currentCustomers = await getCustomerDoc(arrayName);
            const customerIndex = currentCustomers.findIndex((c: Customer) => c.customer_id === customer?.customer_id);

            if (customerIndex === -1) {
                setError('Customer not found in database');
                return;
            }

            currentCustomers.splice(customerIndex, 1);
            await updateDoc(doc(db, 'customers', arrayName), {
                customers: currentCustomers,
                count: currentCustomers.length
            });

            const updatedCustomers = customers.filter((c: Customer) => c.customer_id !== customer?.customer_id);
            setCustomers(updatedCustomers);
            setCustomer(null);
            setDisplay('default');
        } catch (err) {
            setError('Failed to delete customer: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setConfirm('');
        setError('');
        setDisplay('default');
    };

    const labelText = (
        <span className="flex justify-center items-center w-full">
            Type <span className="mx-1 bg-red-900 text-white px-2 py-0.5 rounded">{customer ? customer.first_name + ' ' + customer.last_name : ''}</span> To Delete This Customer
        </span>
    );

    return (
        <Prompt title="Delete Customer">
            <PromptField error={error}>
                <PromptInput
                    label={labelText}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex flex-row gap-5 justify-end">
                <PromptButton
                    onClick={handleDelete}
                    disabled={isSubmitting || !customer || confirm !== `${customer.first_name} ${customer.last_name}`}
                    label={isSubmitting ? 'Processing...' : 'Delete'}
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

export default DeletePrompt;
