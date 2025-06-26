import { useState } from 'react';
import { useCustomer } from '../../context/useContext';
import CheckIcon from '@mui/icons-material/Check';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Notes = () => {
    const { customer } = useCustomer();
    const [tempNote, setTempNote] = useState(customer.notes || '');

    const handleNoteSubmit = async () => {
        if (!tempNote) {
            return;
        };
        const min = (Math.floor(customer.customer_id / 100) - (customer.customer_id % 100 === 0)) * 100 + 1;
        const max = (Math.floor(customer.customer_id / 100) + (customer.customer_id % 100 !== 0)) * 100;
        const arrayName = `${min}_min_${max}_max`;
        const customerDoc = await getDoc(doc(db, 'customers', arrayName));
        const currentCustomers = customerDoc.data()?.customers || [];
        const updatedCustomers = currentCustomers.map(c =>
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
        <div className='h-full w-full relative hidden md:flex flex-row items-center justify-center'>
            <input
                className='base bg-white/20 rounded-2xl ring-2 text-black py-1.5 px-3 text-sm w-full '
                value={tempNote}
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
