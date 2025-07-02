import React from 'react';
import { useState, useEffect } from 'react';
import { useDisplay, useCustomer } from '../context/useContext';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { db } from '../firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { getDocumentName, getCustomerDoc } from './scripts';
import { Customer } from '../types';

/**
 * A prompt that allows the user to add a new transaction to the system. It appears only when the state is 'transaction'.
 * @returns The TransactionPrompt component.
 */
function TransactionPrompt(): React.ReactElement {
    const { customer, setCustomer } = useCustomer();
    interface TransactionInput {
        change_balance: string;
        employee_name: string;
        notes: string;
    }
    const transactionTemplate: TransactionInput = {
        change_balance: '',
        employee_name: '',
        notes: ''
    };
    const [newTransaction, setNewTransaction] = useState<TransactionInput>(transactionTemplate);
    const { setDisplay } = useDisplay();
    const [errors, setErrors] = useState({ invalidValue: '', noEmployee: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [payment, setPayment] = useState({ add: false, sub: false });
    const [employees, setEmployees] = useState<string[]>([]);
    const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
    const [newEmployeeName, setNewEmployeeName] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
        setNewTransaction(transactionTemplate);
        setErrors({ invalidValue: '', noEmployee: '' });
        setPayment({ add: false, sub: false });
        const stored = localStorage.getItem('employees');
        setEmployees(stored ? JSON.parse(stored) : []);
    }, []);

    useEffect(() => {
        console.log('payment state changed:', payment);
    }, [payment]);

    const handlePaymentType = (type: 'add' | 'sub') => {
        console.log(type);
        setPayment({ add: type === 'add', sub: type === 'sub' });
    };

    const updateTransaction = async () => {
        if (isSubmitting) return false;
        setIsSubmitting(true);
        setErrors({ invalidValue: '', noEmployee: '' });
        try {
            const delta = newTransaction.change_balance;
            if (!delta || !/^\d*(\.\d{1,2})?$/.test(delta)) {
                setErrors(e => ({ ...e, invalidValue: !delta ? 'Amount is Required and Must be a Valid Number!' : 'Amount Must Have a Valid Number of Decimal Places!' }));
                return false;
            } else if (!payment.add && !payment.sub) {
                setErrors(e => ({ ...e, invalidValue: 'Please Indicate Transaction Type!' }));
                return false;
            } else if (!newTransaction.employee_name?.trim()) {
                setErrors(e => ({ ...e, noEmployee: 'Please Enter Your Name!' }));
                return false;
            }
            const signedDelta = payment.sub ? -Number(delta) : Number(delta);
            const transactionData = {
                employee_name: newTransaction.employee_name.trim(),
                change_balance: signedDelta,
                notes: newTransaction.notes?.trim() || '',
                date: Timestamp.now()
            };
            if (!customer) throw new Error('Customer data is not properly loaded');
            const arrayName = getDocumentName(customer.customer_id);
            const currentCustomers = await getCustomerDoc(arrayName);
            const updatedCustomers = currentCustomers.map((c: Customer) =>
                c.customer_id === customer.customer_id
                    ? {
                        ...c,
                        transactions: [...(c.transactions || []), transactionData],
                        balance: Math.round((Number(c.balance) + Number(transactionData.change_balance)) * 100) / 100
                    }
                    : c
            );
            await updateDoc(doc(db, 'customers', arrayName), { customers: updatedCustomers });
            const updatedCustomer = updatedCustomers.find((c: Customer) => c.customer_id === customer.customer_id);
            if (updatedCustomer) setCustomer(updatedCustomer);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                setErrors(e => ({ ...e, invalidValue: error.message || 'An unexpected error occurred during the transaction' }));
            } else {
                setErrors(e => ({ ...e, invalidValue: 'An unexpected error occurred during the transaction' }));
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        const valid = await updateTransaction();
        if (valid) setDisplay('default');
    };

    interface SideButtonProps {
        label: React.ReactNode;
        color: string;
        onClick: () => void;
        disabled?: boolean;
        title?: string;
    }
    const SideButton = ({ label, color, onClick, disabled = false, title = '' }: SideButtonProps) => (
        <button
            className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-center ring-2 rounded-full p-0.5 transition-all ${color}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {label}
        </button>
    );

    return (
        <Prompt title="New Transaction">
            <PromptField error={errors.invalidValue}>
                <PromptInput
                    label={
                        <div className="flex flex-row gap-3 items-center">
                            Amount
                            <SideButton
                                label={<AddIcon fontSize='small' />}
                                color={`text-white ring-emerald-950 ${payment.add ? ' bg-emerald-800' : 'bg-emerald-700/30 hover:bg-emerald-800/60 active:bg-emerald-900'}`}
                                onClick={() => {
                                    console.log('Add button clicked');
                                    handlePaymentType('add');
                                }}
                            />
                            <SideButton
                                label={<RemoveIcon fontSize='small' />}
                                color={`text-white ring-red-950 ${payment.sub ? ' bg-red-900' : 'bg-red-800/30 hover:bg-red-900/60 active:bg-red-950'}`}
                                onClick={() => {
                                    console.log('Sub button clicked');
                                    handlePaymentType('sub');
                                }}
                            />
                            <div className='flex flex-row gap-3 ml-auto'>
                                <span className="bg-gray-800 text-gray-200 px-2 py-1 rounded font-mono text-xs border border-gray-700">
                                    Current: <span className="font-bold">{Number(customer?.balance).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</span>
                                </span>
                                {(payment.add || payment.sub) &&
                                    <span className={`${payment.add && 'bg-emerald-700/30 ring-emerald-950'} ${payment.sub && 'bg-red-800/30 ring-red-950'} transition-all px-2 py-1 rounded font-mono text-xs ring-2 `}>
                                        New: <span className="font-bold">{(Number(customer?.balance) + (payment.sub ? -Number(newTransaction.change_balance) : Number(newTransaction.change_balance))).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</span>
                                    </span>
                                }
                            </div>
                        </div>
                    }
                    type="text"
                    step="0.01"
                    value={newTransaction.change_balance}
                    onChange={input => {
                        let value = input.target.value;
                        value = value.replace(/[^0-9.]/g, '');
                        const parts = value.split('.');
                        if (parts.length > 2) {
                            value = parts[0] + '.' + parts.slice(1).join('');
                        }
                        if (value.includes('.')) {
                            const [intPart, decPart] = value.split('.');
                            value = intPart + '.' + decPart.slice(0, 2);
                        }
                        setNewTransaction({
                            ...newTransaction,
                            change_balance: value
                        });
                    }}
                    disabled={isSubmitting}
                />
            </PromptField>
            <PromptField error={errors.noEmployee}>
                <div className="text-gray-200 font-medium text-sm mb-1">Employee Name</div>
                <div className='flex flex-row items-center gap-2 w-full'>
                    {!showAddEmployee ? (
                        <div className='flex-1 flex flex-row items-center justify-center gap-1 relative'>
                            <div className="relative w-full">
                                <button
                                    type="button"
                                    className={`flex justify-between items-center w-full text-gray-200 text-sm bg-gray-800 rounded-md px-2 py-0.5 h-7 outline-none transition-colors focus:bg-gray-500 hover:bg-gray-700 border border-gray-700 placeholder-gray-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isSubmitting && setShowDropdown(v => !v)}
                                    disabled={isSubmitting}
                                >
                                    {newTransaction.employee_name || 'Select employee'}
                                    <span className="ml-2">▼</span>
                                </button>
                                {showDropdown && !isSubmitting && (
                                    <div className="absolute z-50 mt-1 w-full max-h-30 overflow-y-scroll container-snap bg-gray-800 border border-gray-700 rounded shadow-lg">
                                        {employees.length === 0 && (
                                            <div className="px-3 py-2 text-gray-400 text-xs">No employees</div>
                                        )}
                                        {employees.map(employee => (
                                            <div
                                                key={employee}
                                                className={`px-3 py-2 cursor-pointer hover:bg-gray-700 transition-all text-white text-xs ${employee === newTransaction.employee_name ? 'bg-gray-700 font-bold' : ''}`}
                                                onClick={() => {
                                                    setNewTransaction({ ...newTransaction, employee_name: employee });
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                {employee}
                                            </div>
                                        ))}
                                        <div
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-red-200 text-xs font-semibold"
                                            onClick={() => {
                                                setShowAddEmployee(true);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Add New Employee
                                        </div>
                                    </div>
                                )}
                            </div>
                            {newTransaction.employee_name && (
                                <SideButton
                                    label={<DeleteIcon fontSize="small" />}
                                    color="bg-red-800 text-white hover:bg-red-900 active:bg-red-950 ring-red-900 ml-1"
                                    onClick={() => {
                                        const updated = employees.filter(e => e !== newTransaction.employee_name);
                                        setEmployees(updated);
                                        localStorage.setItem('employees', JSON.stringify(updated));
                                        setNewTransaction({ ...newTransaction, employee_name: '' });
                                    }}
                                    disabled={isSubmitting}
                                    title={`Delete ${newTransaction.employee_name}`}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-row items-center gap-2 w-full">
                            <PromptInput
                                placeholder="New Name"
                                value={newEmployeeName}
                                onChange={e => setNewEmployeeName(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <SideButton
                                color={'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 ring-emerald-900'}
                                label={<AddIcon fontSize="small" />}
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
                                label={<ClearIcon fontSize="small" />}
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
            <PromptField>
                <PromptInput
                    label="Notes"
                    value={newTransaction.notes}
                    onChange={input => setNewTransaction({ ...newTransaction, notes: input.target.value })}
                    disabled={isSubmitting}
                />
            </PromptField>
            <div className="flex flex-row gap-5 justify-end mt-4">
                <PromptButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Processing...' : 'Confirm'}
                    icon={null}
                />
                <PromptButton
                    onClick={() => setDisplay('default')}
                    label="Cancel"
                    disabled={isSubmitting}
                    icon={null}
                />
            </div>
        </Prompt>
    );
}

export default TransactionPrompt;

