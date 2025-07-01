import { useCustomer, useCustomerNames, useDisplay, useFilters } from '../../context/useContext';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DateFilter from './filters/DateFilter';
import Amount from './filters/Amount';
import EmployeeName from './filters/Employee_Name';
import { useEffect, useState, useMemo } from 'react';
import { Customer, Transaction, Display } from '../../types';

/**
 * Displays a Table containing the transaction made by the individual
 * @component
 * @returns {JSX.Element} The rendered table transactions or a placeholder if none exist.
 */
function TableDisplay(): React.ReactElement {
    const { customer } = useCustomer();
    const { customers } = useCustomerNames();
    const { display, setDisplay } = useDisplay();
    const { filters, setFilters } = useFilters();
    const [filteredRows, setFilteredRows] = useState<Transaction[]>([]);

    const defaultFilters = {
        date: { startDate: '', endDate: '' },
        amount: { minAmount: '', maxAmount: '' },
        employee: { searchTerm: '' }
    };

    function deepEqual(obj1: any, obj2: any): boolean {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    useEffect(() => {
        if (!deepEqual(filters, defaultFilters)) {
            setFilters(defaultFilters);
        }
        if (display !== 'default') {
            setDisplay('default');
        }
    }, [customer?.customer_id, customer?.transactions?.length]);

    const applyFilters = useMemo(() => (rows: Transaction[]) => {
        return rows.filter((row: Transaction) => {
            if (filters.date?.startDate || filters.date?.endDate) {
                const rowDate = new Date((row.date as { seconds: number }).seconds * 1000);
                if (filters.date.startDate) {
                    const startDate = new Date(filters.date.startDate);
                    startDate.setHours(0, 0, 0, 0);
                    if (rowDate < startDate) return false;
                }
                if (filters.date.endDate) {
                    const endDate = new Date(filters.date.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    if (rowDate > endDate) return false;
                }
            }
            if (filters.amount?.minAmount || filters.amount?.maxAmount) {
                const amount = row.change_balance;
                if (filters.amount.minAmount && amount < parseFloat(filters.amount.minAmount)) return false;
                if (filters.amount.maxAmount && amount > parseFloat(filters.amount.maxAmount)) return false;
            }
            if (filters.employee?.searchTerm) {
                const searchTerm = filters.employee.searchTerm.toLowerCase();
                if (!row.employee_name.toLowerCase().includes(searchTerm)) return false;
            }
            return true;
        });
    }, [filters]);

    useEffect(() => {
        const currentCustomer = customers.find((c: Customer) => c.customer_id === customer?.customer_id);
        const transactions: Transaction[] = currentCustomer?.transactions || [];
        const filtered = applyFilters(transactions);
        filtered.sort((a: Transaction, b: Transaction) => (b.date as { seconds: number }).seconds - (a.date as { seconds: number }).seconds);
        setFilteredRows(filtered);
    }, [customers, filters, customer?.customer_id, applyFilters]);

    const hasActiveFilters = () => {
        return filters.date?.startDate || filters.date?.endDate ||
            filters.amount?.minAmount || filters.amount?.maxAmount ||
            filters.employee?.searchTerm;
    };

    interface HeaderFieldProps {
        label: string;
    }
    const HeaderField = ({ label }: HeaderFieldProps) => (
        <th className="relative px-3 py-1 font-semibold whitespace-nowrap cursor-pointer group text-sm bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-200">
            <div className="flex items-center gap-1"
                onClick={() => setDisplay(display === `${label}Filter` ? 'default' as Display : `${label}Filter` as Display)}>
                {label}
                <FilterListIcon
                    sx={{
                        fontSize: '0.9rem',
                        verticalAlign: 'middle',
                        color: display === `${label}Filter` ? '#60a5fa' : '#9ca3af',
                        transition: 'color 0.2s ease'
                    }}
                />
            </div>
        </th>
    );

    if ((!filteredRows || filteredRows.length === 0) && !hasActiveFilters()) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <img
                    className="brightness-30 w-auto max-h-4/5 object-contain mx-auto select-none"
                    src="./ETBBanner.png"
                    alt="No data"
                />
                <p className="absolute text-white z-10 font-bold text-2xl mg:text-3x1 lg:text-4xl bg-black/50 rounded-xl p-5 select-none">NO TRANSACTIONS YET</p>
            </div>
        );
    }

    return (
        <div className="max-h-9/10 rounded-xl overflow-y-scroll container-snap border border-gray-700 shadow-lg bg-gray-900">
            <div className="absolute">
                {display === ('DateFilter' as unknown as Display) && (
                    <div className="absolute z-50 mt-8 left-[2vw] select-none">
                        <DateFilter />
                    </div>
                )}
                {display === ('AmountFilter' as unknown as Display) && (
                    <div className="absolute z-50 mt-8 left-[16vw] select-none">
                        <Amount />
                    </div>
                )}
                {display === ('EmployeeFilter' as unknown as Display) && (
                    <div className="absolute z-50 mt-8 left-[34vw] select-none">
                        <EmployeeName />
                    </div>
                )}
            </div>
            <table className="w-full text-xs md:text-sm lg:text-md text-gray-200 select-none">
                <thead className="sticky top-0 z-10">
                    <tr className="text-left">
                        <HeaderField label={'Date'} />
                        <HeaderField label={'Amount'} />
                        <HeaderField label={'Employee'} />
                        <th className="w-full max-w-[400px] px-3 py-1 font-semibold whitespace-nowrap text-sm bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-200">Notes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {filteredRows.map((row, idx) => (
                        <tr
                            key={idx}
                            className="hover:bg-gray-800/50 transition-colors duration-150 ease-in-out"
                        >
                            <td className="px-3 py-0.5 max-w-[200px] overflow-x-scroll no-scroll whitespace-nowrap container-snap text-sm" title={row.date && (row.date as { seconds: number }).seconds ? new Date((row.date as { seconds: number }).seconds * 1000).toISOString() : 'Invalid date'}>
                                {row.date && (row.date as { seconds: number }).seconds ? new Date((row.date as { seconds: number }).seconds * 1000).toLocaleString().replace('T', ' ').slice(0, 19) : 'Invalid date'}
                            </td>
                            <td className="px-3 py-0.5 max-w-[120px] overflow-x-scroll no-scroll whitespace-nowrap container-snap text-sm" title={String(row.change_balance)}>
                                {row.change_balance < 0 ?
                                    <ArrowDropDownIcon sx={{ color: '#f87171', transition: 'transform 0.2s ease' }} /> :
                                    <ArrowDropUpIcon sx={{ color: '#4ade80', transition: 'transform 0.2s ease' }} />
                                }${Number(Math.abs(row.change_balance)).toFixed(2)}
                            </td>
                            <td className="px-3 py-0.5 max-w-[120px] overflow-x-scroll no-scroll whitespace-nowrap container-snap text-sm" title={row.employee_name}>
                                {row.employee_name}
                            </td>
                            <td className="px-3 py-1">
                                <div className="max-w-[400px] w-full whitespace-nowrap text-sm text-gray-400" title={row.notes}>
                                    {row.notes}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableDisplay;