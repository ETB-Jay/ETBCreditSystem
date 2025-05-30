import icon from '../../assets/ETBBanner.png'
import { useTransactions, useCustomer, useDisplay } from '../../context/useContext'
import FilterListIcon from '@mui/icons-material/FilterList'
import DateFilter from './filters/DateFilter'
import Amount from './filters/Amount'
import EmployeeName from './filters/Employee_Name'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * Displays a Table containing the transaction made by the individual
 * @component
 * @returns {JSX.Element} The rendered table transactions or a placeholder if none exist.
 */
function TableDisplay() {
    const { transaction } = useTransactions()
    const { customer } = useCustomer()
    const { display, setDisplay } = useDisplay()
    const [filters, setFilters] = useState({
        date: { startDate: "", endDate: "" },
        amount: { minAmount: "", maxAmount: "" },
        employee: { searchTerm: "" }
    })

    useEffect(() => {
        setFilters({
            date: { startDate: "", endDate: "" },
            amount: { minAmount: "", maxAmount: "" },
            employee: { searchTerm: "" }
        })
        setDisplay("default")
    }, [customer.customer_id, setDisplay])

    const handleFilterChange = (filterType, values) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: values
        }))
    }
    const applyFilters = (rows) => {
        return rows.filter(row => {
            // Date filter
            if (filters.date.startDate || filters.date.endDate) {
                const rowDate = new Date(row.date)
                if (filters.date.startDate) {
                    const startDate = new Date(filters.date.startDate)
                    startDate.setHours(0, 0, 0, 0)
                    if (rowDate < startDate) return false
                }
                if (filters.date.endDate) {
                    const endDate = new Date(filters.date.endDate)
                    endDate.setHours(23, 59, 59, 999)
                    if (rowDate > endDate) return false
                }
            }
            if (filters.amount.minAmount || filters.amount.maxAmount) {
                const amount = row.change_balance
                if (filters.amount.minAmount && amount < parseFloat(filters.amount.minAmount)) return false
                if (filters.amount.maxAmount && amount > parseFloat(filters.amount.maxAmount)) return false
            }
            if (filters.employee.searchTerm) {
                const searchTerm = filters.employee.searchTerm.toLowerCase()
                if (!row.employee_name.toLowerCase().includes(searchTerm)) return false
            }

            return true
        })
    }
    const filteredRows = applyFilters(transaction.filter(row => row.customer_id === customer.customer_id))
    filteredRows.sort((a, b) => new Date(b.date) - new Date(a.date))
    const hasActiveFilters = () => {
        return filters.date.startDate || filters.date.endDate ||
            filters.amount.minAmount || filters.amount.maxAmount ||
            filters.employee.searchTerm
    }
    if ((!filteredRows || filteredRows.length === 0) && !hasActiveFilters()) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <img
                    className="brightness-30 w-auto max-h-4/5 object-contain mx-auto select-none"
                    src={icon}
                    alt="No data"
                />
                <p className="absolute text-white z-10 font-bold text-2xl mg:text-3x1 lg:text-4xl bg-black/50 rounded-xl p-5 select-none">NO TRANSACTIONS YET</p>
            </div>
        )
    }

    const HeaderField = ({ label }) => (
        <th className="relative px-3 py-1 font-semibold whitespace-nowrap cursor-pointer group">
            <div className="flex items-center gap-1"
                onClick={() => setDisplay(display === `${label}Filter` ? null : `${label}Filter`)}>
                {label}
                <FilterListIcon
                    sx={{
                        fontSize: "2vh",
                        verticalAlign: "middle",
                        color: display === `${label}Filter` ? "#3b82f6" : "inherit"
                    }}
                />
            </div>
            {display === "DateFilter" && label === "Date" && (
                <div className="absolute z-50 mt-1 left-0">
                    <DateFilter
                        onFilterChange={(values) => handleFilterChange("date", values)}
                        values={filters.date}
                    />
                </div>
            )}
            {display === "AmountFilter" && label === "Amount" && (
                <div className="absolute z-50 mt-1 left-0">
                    <Amount
                        onFilterChange={(values) => handleFilterChange("amount", values)}
                        values={filters.amount}
                    />
                </div>
            )}
            {display === "EmployeeFilter" && label === "Employee" && (
                <div className="absolute z-50 mt-1 left-0">
                    <EmployeeName
                        onFilterChange={(values) => handleFilterChange("employee", values)}
                        values={filters.employee}
                    />
                </div>
            )}
        </th>
    )

    HeaderField.propTypes = {
        label: PropTypes.string.isRequired
    }

    return (
        <table className="w-full text-xs md:text-sm lg:text-[1rem] text-black">
            <thead className="bg-[#808080] top-0 z-10">
                <tr className="text-left text-black">
                    <HeaderField label={"Date"} />
                    <HeaderField label={"Amount"} />
                    <HeaderField label={"Employee"} />
                    <th className="w-1/3 px-3 py-1 font-semibold whitespace-nowrap">Notes</th>
                </tr>
            </thead>
            <tbody className="overflow-y-scroll container-snap">
                {filteredRows.map((row, idx) => (
                    <tr
                        key={idx}
                        className={row.change_balance < 0 ? "bg-red-300" : "bg-green-300"}
                    >
                        <td className="px-3 py-0.5 max-w-[120px] overflow-x-auto whitespace-nowrap container-snap" title={row.date}>
                            {new Date(new Date(row.date).getTime()).toISOString().replace("T", " ").slice(0, 19)}
                        </td>
                        <td className="px-3 py-0.5 max-w-[120px] overflow-x-auto whitespace-nowrap container-snap" title={row.change_balance}>
                            {row.change_balance < 0 ? "-" : ""}${Number(Math.abs(row.change_balance)).toFixed(2)}
                        </td>
                        <td className="px-3 py-0.5 max-w-[120px] overflow-x-auto whitespace-nowrap container-snap" title={row.employee_name}>
                            {row.employee_name}
                        </td>
                        <td className="pl-3 pr-0 py-0.5">
                            <div className="max-w-[230px] max-h-7 overflow-x-auto whitespace-nowrap container-snap" title={row.notes}>
                                {row.notes}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableDisplay