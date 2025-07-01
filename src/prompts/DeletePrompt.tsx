import { useState } from 'react';
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext';
import { Prompt, PromptField, PromptInput, PromptButton } from '../components';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDocumentName } from './scripts';

function DeletePrompt() {
    const { setDisplay } = useDisplay();
    const { customer, setCustomer } = useCustomer();
    const { customers, setCustomers } = useCustomerNames();
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (confirm !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        try {
            setIsSubmitting(true);
            const arrayName = getDocumentName(customer?.customer_id ?? 0);
            
            const docRef = doc(db, 'customers', arrayName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentCustomers = docSnap.data().customers || [];
                const customerIndex = currentCustomers.findIndex((c: any) => c.customer_id === customer?.customer_id);

                if (customerIndex === -1) {
                    setError('Customer not found in database');
                    return;
                }

                currentCustomers.splice(customerIndex, 1);
                await updateDoc(docRef, {
                    customers: currentCustomers,
                    count: currentCustomers.length
                });

                const updatedCustomers = customers.filter((c: any) => c.customer_id !== customer?.customer_id);
                setCustomers(updatedCustomers);
                setCustomer(null);
                setDisplay('default');
            } else {
                setError('Customer document not found');
            }
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

    return (
        <Prompt title="Delete Customer">
            <PromptField error={error}>
                <PromptInput
                    label={`Type ${customer ? customer.first_name + ' ' + customer.last_name : ''} To Delete This Customer`}
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
