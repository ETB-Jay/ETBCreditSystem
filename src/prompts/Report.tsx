import { useEffect, useState } from 'react';
import { useDisplay, useCustomerNames, useTotal } from '../context/useContext';
import { Prompt, PromptButton, PromptField } from '../components';
import DownloadIcon from '@mui/icons-material/Download';
import JSZip from 'jszip';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Transaction } from '../types';

type TransactionWithCustomer = Transaction & {
    customer_id: number;
    first_name: string;
    last_name: string;
};

/**
 * Displays a system information report and allows downloading customer and transaction data as CSV files.
 * @returns The Report component.
 */
function Report() {
    const { customers } = useCustomerNames();
    const { setDisplay } = useDisplay();
    const [outstanding, setOutstanding] = useState(0);
    const [totalCredit, setTotalCredit] = useState('0');
    const [allTransactions, setAllTransactions] = useState<TransactionWithCustomer[]>([]);
    const { total } = useTotal();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
            const transactions: TransactionWithCustomer[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.customers && Array.isArray(data.customers)) {
                    data.customers.forEach(customer => {
                        if (customer.transactions && Array.isArray(customer.transactions)) {
                            customer.transactions.forEach((transaction: Transaction) => {
                                transactions.push({
                                    ...transaction,
                                    customer_id: customer.customer_id,
                                    first_name: customer.first_name,
                                    last_name: customer.last_name
                                });
                            });
                        }
                    });
                }
            });
            setAllTransactions(transactions);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const negativeBalanceCustomers = customers.filter(customer => Number(customer.balance) < 0);
        setOutstanding(negativeBalanceCustomers.length);

        const total = customers.reduce((sum, customer) => sum + Number(customer.balance), 0);
        setTotalCredit(total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' }));
    }, [customers]);

    const handleDownload = async () => {
        try {
            const zip = new JSZip();
            const date = new Date().toISOString().split('T')[0].replace(',', ';');

            const customerHeaders = ['customer_id', 'first_name', 'last_name', 'email', 'phone', 'balance'];
            const customerCsvContent = [
                customerHeaders.join(','),
                ...customers.map(customer => [
                    customer.customer_id || '',
                    customer.first_name || '',
                    customer.last_name || '',
                    customer.email || '',
                    customer.phone || '',
                    customer.balance || 0
                ].join(','))
            ].join('\n');

            const transactionHeaders = ['customer_id', 'first_name', 'last_name', 'day', 'time', 'change_balance', 'employee_name', 'notes'];
            const transactionCsvContent = [
                transactionHeaders.join(','),
                ...allTransactions.map(transaction => [
                    transaction.customer_id || '',
                    transaction.first_name || '',
                    transaction.last_name || '',
                    (transaction.date && typeof transaction.date === 'object' && 'seconds' in transaction.date)
                        ? new Date(transaction.date.seconds * 1000).toLocaleString()
                        : (transaction.date instanceof Date ? transaction.date.toLocaleString() : ''),
                    transaction.change_balance || 0,
                    transaction.employee_name || '',
                    (transaction.notes || '').replace(/,/g, '')
                ].join(','))
            ].join('\n');

            zip.file('customers.csv', customerCsvContent);
            zip.file('transactions.csv', transactionCsvContent);

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(content);

            link.setAttribute('href', url);
            link.setAttribute('download', `etb_credit_report_${date}.zip`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating download:', error);
            alert('There was an error generating the download. Please try again.');
        }
    };

    return (
        <Prompt title='SYSTEM INFORMATION'>
            <div className="absolute top-4 right-4">
                <a href='https://github.com/ETB-Jay/ETBCreditSystem'>
                    <img className='h-6 hover:brightness-50 active:brightness-75 cursor-pointer transition-all' draggable='false' src='githubLogo.png' alt="GitHub Logo" />
                </a>
            </div>
            <PromptField>
                <p className="text-white font-bold bg-white/5 rounded-2xl p-3">
                    Number of Customers: <span className='ml-1 font-semibold'>{total}</span>
                </p>
            </PromptField>
            <PromptField>
                <p className="text-white font-bold bg-white/5 rounded-2xl p-3">
                    Total Credit: <span className='ml-1 font-semibold'>{totalCredit}</span>
                </p>
            </PromptField>
            <PromptField>
                <p className="text-white font-semibold bg-white/5 rounded-2xl p-3">
                    Number of Outstanding Individuals: <span className='ml-1 font-semibold'>{outstanding}</span>
                </p>
            </PromptField>
            <div className='flex flex-row gap-x-2'>
                <PromptButton onClick={() => setDisplay('default')} label="Close" disabled={false} icon={null} />
                <PromptButton onClick={handleDownload}
                    icon={<DownloadIcon sx={{ fontSize: '20px' }} />}
                    label="Download"
                    disabled={false}
                />
            </div>
        </Prompt>
    );
}

export default Report;
