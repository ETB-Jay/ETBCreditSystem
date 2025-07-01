import { useState } from 'react';
import { useCustomer } from '../../context/useContext';
import CheckIcon from '@mui/icons-material/Check';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDocumentName } from '../../prompts/scripts';

function Notes() {
    const { customer } = useCustomer();
    const [tempNote, setTempNote] = useState(customer?.notes || '');

    const handleNoteSubmit = async () => {
        if (!tempNote || !customer) {
            return;
        }
        const arrayName = getDocumentName(customer.customer_id);
        const customerDoc = await getDoc(doc(db, 'customers', arrayName));
        const currentCustomers = customerDoc.data()?.customers || [];
        const updatedCustomers = currentCustomers.map((c: any) =>
            c.customer_id === customer.customer_id
                ? {
                    ...c,
                    notes: tempNote
                }
                : c
        );
        await updateDoc(doc(db, 'customers', arrayName), { customers: updatedCustomers });
    };

    return (
        <div className='h-full w-full relative hidden sm:flex flex-row items-center justify-center'>
            <div className='absolute left-2 top-1/2 -translate-y-1/2'><EditNoteIcon className='text-white'/></div>
            <input
                className='base bg-white/20 rounded-2xl ring-1 ring-gray-900/20 text-white px-9.5 text-xs w-full h-full'
                value={tempNote}
                placeholder='Add a note...'
                onChange={e => setTempNote(e.target.value)}
            />
            <button
                className={`flex absolute right-2 p-0.5 rounded-full items-center justify-center h-fit transition-colors duration-150
                    ${tempNote ? 'bg-white/5 hover:bg-white/10 text-emerald-400 cursor-pointer' : 'bg-white/5 text-gray-400 cursor-not-allowed'}`}
                onClick={handleNoteSubmit}
                disabled={!tempNote}
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
