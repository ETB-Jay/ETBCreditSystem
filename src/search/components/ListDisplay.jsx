import PropTypes from 'prop-types'
import { useCustomer, useCustomerNames } from '../../context/useContext'
import WarningIcon from '@mui/icons-material/Warning'
import { useState } from 'react'

/**
 * Displays a filtered list of customers based on the provided filter string taken from the search bar
 * 
 * @component
 * @param {string} filter - The filter string used to match customer first or last names (case-insensitive).
 * @returns {JSX.Element} A scrollable list of customer names. Clicking a name sets the selected customer.
 */
function ListDisplay({ filter = "" }) {
    const { setCustomer } = useCustomer()
    const { customers } = useCustomerNames()
    const [selectedIndex, setSelectedIndex] = useState(null)

    const filteredRows = customers
        .filter(customer =>
            ((customer.first_name?.toLowerCase() || "").includes(filter.toLowerCase()) ||
            (customer.last_name?.toLowerCase() || "").includes(filter.toLowerCase()))
        )
        .sort((a, b) => {
            // First compare by last name
            const lastNameCompare = (a.last_name || "").localeCompare(b.last_name || "");
            // If last names are equal, compare by first name
            return lastNameCompare !== 0 ? lastNameCompare : (a.first_name || "").localeCompare(b.first_name || "");
        });

    const handleClick = (customer, index) => {
        setCustomer(customer)
        setSelectedIndex(index)
    }

    return (
        <div className="text-gray-100 h-full overflow-y-auto container-snap">
            <ul className="list-none p-0 m-0">
                {filteredRows.map((customer, index) => (
                    <li className={`flex flex-row items-center justify-between text-xs lg:text-sm px-2 py-1 cursor-pointer rounded-sm 
                    hover:bg-gray-600 hover:font-bold hover:transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.5)]
                    ${selectedIndex === index ? "bg-gray-700 font-bold shadow-[0_4px_8px_rgba(0,0,0,0.6)]" : "odd:bg-gray-800 even:bg-gray-700/50"}`}
                        key={customer.id}
                        onClick={() => handleClick(customer, index)}>
                        <p className="overflow-x-scroll container-snap">{`${customer.last_name}, ${customer.first_name}`}</p>
                        {Number(customer.balance) < 0 ? <WarningIcon sx={{ fontSize: "100%" }} /> : <></>}
                    </li>
                ))}
            </ul>
        </div>
    )
}

ListDisplay.propTypes = {
    filter: PropTypes.string
}

export default ListDisplay
