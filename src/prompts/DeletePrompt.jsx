import { useState } from 'react';
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext';
import { Prompt, PromptTitle, PromptField, PromptInput, PromptButton } from './components';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function DeletePrompt() {
    const { setDisplay } = useDisplay();
    const { customer, setCustomer } = useCustomer();
    const { customers, setCustomers } = useCustomerNames();
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (confirm !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        try {
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
        }
    };

    const handleCancel = () => {
        setConfirm('');
        setError('');
        setDisplay('default');
    };

    return (
        <Prompt>
            <PromptTitle label="Delete Customer" />
            <div className="flex flex-col items-center gap-4">
                <div className="text-gray-200 text-sm whitespace-nowrap">
                    DO YOU WANT TO DELETE 
                    <span className='block-inline bg-gray-800/80 ring-2 ring-gray-950 font-bold text-xs rounded py-1 px-2 mx-2'>{customer?.first_name} {customer?.last_name}</span>?
                </div>
                <PromptField label="Type 'DELETE' to confirm">
                    <PromptInput 
                        placeholder="Type DELETE to confirm"
                        value={confirm}
                        onChange={(e) => {
                            setConfirm(e.target.value);
                            setError('');
                        }}
                    />
                </PromptField>
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
            <div className="flex justify-end space-x-3">
                <PromptButton
                    onClick={handleCancel}
                >
                    CANCEL
                </PromptButton>
                <PromptButton
                    onClick={handleDelete}
                    warning={true}
                    disabled={confirm !== 'DELETE'}
                >
                    DELETE
                </PromptButton>
            </div>
        </Prompt>
    );
}

export default DeletePrompt;
