import { useState, useEffect } from 'react';
import { useDisplay, useCustomer, useCustomerNames } from '../context/useContext';
import { Prompt, PromptTitle, PromptButton, PromptField, PromptInput } from './components';
import { db } from '../firebase';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * A prompt that allows the user to add a new transaction to the system. It appears only
 * when the state is "transaction".
 * 
 * @component
 * @returns {JSX.Element} The TransactionPrompt prompt
 */
function TransactionPrompt() {
    const { customer } = useCustomer();
    const { setCustomers } = useCustomerNames();
    const [newTransaction, setNewTransaction] = useState({});
    const { setDisplay } = useDisplay();
    const [errors, setErrors] = useState({ invalidValue: '', noEmployee: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payment, setPayment] = useState({ add: false, sub: false });
    const [employees, setEmployees] = useState([]);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState('');

    useEffect(() => {
        setNewTransaction({});
        setErrors({ invalidValue: '', noEmployee: '' });
        setPayment({ add: false, sub: false });
        const stored = localStorage.getItem('employees');
        setEmployees(stored ? JSON.parse(stored) : []);
    }, []);

    const handlePaymentType = (type) => {
        setPayment({ add: type === 'add', sub: type === 'sub' });
        if (newTransaction.change_balance) {
            const amount = Math.abs(Number(newTransaction.change_balance));
            setNewTransaction({
                ...newTransaction,
                change_balance: type === 'add' ? amount : -amount
            });
        }
    };

    const updateTransaction = async () => {
        if (isSubmitting) return false;
        setIsSubmitting(true);
        setErrors({ invalidValue: '', noEmployee: '' });
        try {
            const delta = Number(newTransaction.change_balance);
            if (!delta || isNaN(delta)) {
                setErrors(e => ({ ...e, invalidValue: 'Amount is Required and Must be a Valid Number!' }));
                return false;
            } else if (!(/^(-)?\d+(\.\d{1,2})?$/.test(delta))) {
                setErrors(e => ({ ...e, invalidValue: 'Amount Must Have a Valid Number of Decimal Places!' }));
                return false;
            } else if (!payment.add && !payment.sub) {
                setErrors(e => ({ ...e, invalidValue: 'Please Indicate Transaction Type!' }));
                return false;
            } else if (!newTransaction.employee_name?.trim()) {
                setErrors(e => ({ ...e, noEmployee: 'Please Enter Your Name!' }));
                return false;
            }
            const transactionData = {
                employee_name: newTransaction.employee_name.trim(),
                change_balance: Number(delta),
                notes: newTransaction.notes?.trim() || '',
                date: Timestamp.now()
            };
            if (!customer) throw new Error('Customer data is not properly loaded');
            const min = (Math.floor(customer.customer_id / 100) - (customer.customer_id % 100 === 0)) * 100 + 1;
            const max = (Math.floor(customer.customer_id / 100) + (customer.customer_id % 100 !== 0)) * 100;
            const arrayName = `${min}_min_${max}_max`;
            const customerDoc = await getDoc(doc(db, 'customers', arrayName));
            const currentCustomers = customerDoc.data()?.customers || [];
            const updatedCustomers = currentCustomers.map(c =>
                c.customer_id === customer.customer_id
                    ? {
                        ...c,
                        transactions: [...(c.transactions || []), transactionData],
                        balance: Number(c.balance) + transactionData.change_balance
                    }
                    : c
            );
            await updateDoc(doc(db, 'customers', arrayName), { customers: updatedCustomers });
            setCustomers(prevCustomers =>
                prevCustomers.map(c =>
                    c.customer_id === customer.customer_id
                        ? {
                            ...c,
                            balance: Number(c.balance) + Number(transactionData.change_balance),
                            transactions: [...(c.transactions || []), transactionData]
                        }
                        : c
                )
            );
            return true;
        } catch (error) {
            setErrors(e => ({ ...e, invalidValue: error.message || 'An unexpected error occurred during the transaction' }));
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        const valid = await updateTransaction();
        if (valid) setDisplay('default');
    };

    const SideButton = ({ label, color, onClick, disabled, title }) => (
        <button
            type="button"
            className={`${disabled ? 'opacity-50 cursor-not-allowed': 'cursor-pointer'} flex items-center justify-center ring-2 rounded-full p-0.5 transition-all ${color}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {label}
        </button>
    );

    return (
        <Prompt>
            <PromptTitle label="New Transaction" />
            <PromptField label="Amount" error={errors.invalidValue}>
                <div className="flex items-center gap-2 w-full">
                    <PromptInput
                        type="number"
                        step="0.01"
                        value={newTransaction.change_balance ? Math.abs(Number(newTransaction.change_balance)) : ''}
                        onChange={input => {
                            const value = input.target.value;
                            const amount = value ? Math.abs(Number(value)) : '';
                            setNewTransaction({
                                ...newTransaction,
                                change_balance: payment.sub ? -amount : amount
                            });
                        }}
                        disabled={isSubmitting}
                    />
                    <SideButton
                        label={<AddIcon fontSize='xs' />}
                        color={`bg-emerald-700/30 text-white hover:bg-emerald-800/60 active:bg-emerald-900 ring-emerald-950 ${payment.add ? ' bg-emerald-800' : ''}`}
                        onClick={() => handlePaymentType('add')}
                    />
                    <SideButton
                        label={<RemoveIcon fontSize='xs' />}
                        color={`bg-red-800/30 text-white hover:bg-red-900/60 active:bg-red-950 ring-red-950 ${payment.sub ? ' bg-red-900' : ''}`}
                        onClick={() => handlePaymentType('sub')}
                    />
                </div>
            </PromptField>
            <PromptField label="Employee Name" error={errors.noEmployee}>
                <div className='flex flex-row items-center gap-2 w-full'>
                    {!showAddEmployee ? (
                        <div className='flex-1 flex flex-row items-center gap-1'>
                            <select
                                className='custom-select-arrow flex justify-center items-center disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-200 text-sm bg-gray-800 rounded-md px-2 py-0.5 h-7 w-full outline-none transition-colors focus:bg-gray-500 hover:bg-gray-700 border border-gray-700 placeholder-gray-500 pr-7'
                                value={newTransaction.employee_name || ''}
                                onChange={e => {
                                    if (e.target.value === 'add-new') {
                                        setShowAddEmployee(true);
                                    } else {
                                        setShowAddEmployee(false);
                                        setNewTransaction({ ...newTransaction, employee_name: e.target.value });
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                <option value='' disabled>Select employee</option>
                                {employees.map(employee => (
                                    <option key={employee} value={employee}>{employee}</option>
                                ))}
                                <option value="add-new">Add New Employee</option>
                            </select>
                            {employees.map(employee => (
                                <SideButton
                                    key={employee + '-delete'}
                                    label={<DeleteIcon fontSize="xs" />}
                                    color="bg-red-800 text-white hover:bg-red-900 active:bg-red-950 ring-red-900 ml-1"
                                    onClick={() => {
                                        const updated = employees.filter(e => e !== employee);
                                        setEmployees(updated);
                                        localStorage.setItem('employees', JSON.stringify(updated));
                                        if (newTransaction.employee_name === employee) {
                                            setNewTransaction({ ...newTransaction, employee_name: '' });
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    title={`Delete ${employee}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-row items-center gap-2 w-full">
                            <PromptInput
                                placeholder="New name"
                                value={newEmployeeName}
                                onChange={e => setNewEmployeeName(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <SideButton
                                color={'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 ring-emerald-900'}
                                label={<AddIcon fontSize='xs' />}
                                onClick={() => {
                                    const trimmed = newEmployeeName.trim();
                                    if (trimmed && !employees.includes(trimmed)) {
                                        const updated = [...employees, trimmed];
                                        setEmployees(updated);
                                        localStorage.setItem('employees', JSON.stringify(updated));
                                        setNewTransaction({ ...newTransaction, employee_name: trimmed });
                                        setShowAddEmployee(false);
                                        setNewEmployeeName('');
                                    }
                                }}
                                disabled={newEmployeeName.trim() === '' || employees.includes(newEmployeeName.trim())}
                                title="Add employee"
                            />
                            <SideButton
                                color={'bg-gray-800 text-gray-200 hover:bg-gray-900 active:bg-black ring-gray-950/50'}
                                label={<ClearIcon fontSize='xs' />}
                                onClick={() => {
                                    setShowAddEmployee(false);
                                    setNewEmployeeName('');
                                }}
                                title="Cancel"
                            />
                        </div>
                    )}
                </div>
            </PromptField>
            <PromptField label="Notes">
                <PromptInput
                    value={newTransaction.notes}
                    onChange={input => setNewTransaction({ ...newTransaction, notes: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex justify-center gap-4 mt-2">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : 'Confirm'}
                </PromptButton>
                <PromptButton
                    onClick={() => setDisplay('default')}
                >
                    Cancel
                </PromptButton>
            </div>
        </Prompt>
    );
}

export default TransactionPrompt;

