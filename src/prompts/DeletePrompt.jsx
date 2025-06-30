import { useState } from 'react';
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext';
import { Prompt, PromptField, PromptInput, PromptButton } from '../components';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
            const min = (Math.floor(customer.customer_id / 100) - (customer.customer_id % 100 === 0)) * 100 + 1;
            const max = (Math.floor(customer.customer_id / 100) + (customer.customer_id % 100 !== 0)) * 100;
            const arrayName = `${min}_min_${max}_max`;

            const docRef = doc(db, 'customers', arrayName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentCustomers = docSnap.data().customers || [];
                const customerIndex = currentCustomers.findIndex(c => c.customer_id === customer.customer_id);

                if (customerIndex === -1) {
                    setError('Customer not found in database');
                    return;
                }

                currentCustomers.splice(customerIndex, 1);
                await updateDoc(docRef, {
                    customers: currentCustomers,
                    count: currentCustomers.length
                });

                const updatedCustomers = customers.filter(c => c.customer_id !== customer.customer_id);
                setCustomers(updatedCustomers);
                setCustomer(null);
                setDisplay('default');
            } else {
                setError('Customer document not found');
            }
        } catch (err) {
            setError('Failed to delete customer: ' + err.message);
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
                    label={
                        <div className="w-full flex justify-center mb-2 text-center items-center">
                            Type <span className='mx-1 bg-white/10 text-red-700 font-bold px-2 py-1 rounded'>{customer.first_name} {customer.last_name}</span> To Delete This Customer
                        </div>
                    }
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex flex-row gap-5 justify-end">
                <PromptButton
                    onClick={handleDelete}
                    disabled={isSubmitting || confirm !== `${customer.first_name} ${customer.last_name}`}
                    label={isSubmitting ? 'Processing...' : 'Delete'}
                />
                <PromptButton
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                />
            </div>
        </Prompt>
    );
}

export default DeletePrompt;
