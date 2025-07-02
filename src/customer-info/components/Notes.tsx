import React, { useCallback, useEffect, useState } from 'react';
import { useCustomer } from '../../context/useContext';
import CheckIcon from '@mui/icons-material/Check';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDocumentName, getCustomerDoc } from '../../prompts/scripts';
import { Customer } from '../../types';

/**
 * Displays and allows editing of the customer's notes field.
 * @returns The Notes component.
 */
function Notes(): React.ReactElement {
    const { customer } = useCustomer();
    const [tempNote, setTempNote] = useState<string>(customer?.notes || '');
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleNoteSubmit = useCallback(async () => {
        if (!tempNote || !customer) {
            return;
        }
        setSubmitting(true);
        try {
            const arrayName = getDocumentName(customer.customer_id);
            const currentCustomers = await getCustomerDoc(arrayName);
            const updatedCustomers = currentCustomers.map((c: Customer) =>
                c.customer_id === customer.customer_id
                    ? {
                        ...c,
                        notes: tempNote
                    }
                    : c
            );
            await updateDoc(doc(db, 'customers', arrayName), { customers: updatedCustomers });
        } finally {
            setSubmitting(false);
        }
    }, [tempNote, customer]);

    useEffect(() => {
        setTempNote('');
    }, [customer]);

    return (
        <div className='h-full w-full relative hidden sm:flex flex-row items-center justify-center'>
            <div className='absolute left-2 top-1/2 -translate-y-1/2'><EditNoteIcon className='text-white' /></div>
            <input
                className={`base ${submitting ? 'bg-yellow-300' : 'bg-white/20'} transition-all duration-300 rounded-2xl ring-1 ring-gray-900/20 text-white px-9.5 text-xs w-full h-full`}
                value={tempNote}
                placeholder={customer?.notes || 'add note...'}
                onChange={e => setTempNote(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') handleNoteSubmit();
                }}
                disabled={submitting}
            />
            <button
                className={`flex absolute right-2 rounded-full items-center justify-center h-fit transition-colors duration-150
                    ${tempNote ? 'bg-white/5 hover:bg-white/10 text-emerald-400 cursor-pointer' : 'bg-white/5 text-gray-400 cursor-not-allowed'}`}
                onClick={handleNoteSubmit}
                disabled={!tempNote || submitting}
            >
                <CheckIcon
                    fontSize='small'
                    className={`${tempNote ? 'text-emerald-400' : 'text-gray-400'}`}
                />
            </button>
        </div>
    );
};

export default Notes;
