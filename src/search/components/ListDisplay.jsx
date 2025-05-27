import PropTypes from 'prop-types'
import { useCustomer, useCustomerNames } from '../../context/useContext'
import WarningIcon from '@mui/icons-material/Warning'
import { useState } from 'react'

/**
 * Displays a filtered list of customers based on the provided filter string.
 * 
 * @component
 * @param {Object} props
 * @param {string} filter - The filter string used to match customer first or last names (case-insensitive).
 * @returns {JSX.Element} A scrollable list of customer names. Clicking a name sets the selected customer.
 */
function ListDisplay({ filter = "" }) {
    const { setCustomer } = useCustomer()
    const { customers } = useCustomerNames()
    const [selectedIndex, setSelectedIndex] = useState(null)

    const filteredRows = customers.filter(row =>
        row &&
        Object.keys(row).length > 1 &&
        ((row.first_name?.toLowerCase() || "").includes(filter.toLowerCase()) ||
            (row.last_name?.toLowerCase() || "").includes(filter.toLowerCase()))
    )

    const handleClick = (row, index) => {
        setCustomer(row)
        setSelectedIndex(index)
    }

    return (
        <div className="text-white h-full">
            <ul className="list-none p-0 m-0 overflow-y-auto container-snap">
                {filteredRows.map((row, index) => (
                    <li className={`flex flex-row items-center justify-between text-[0.8rem] 
                    md:text-[0.9rem] lg:text-[0.95rem] px-2 py-[0.15rem] cursor-pointer rounded-sm 
                    hover:bg-[#404040] hover:font-bold hover:transition-colors
                    ${selectedIndex === index ? "bg-[#2e2e2e] font-bold" : "odd:bg-[#c1c1c143] even:bg-[#ffffff55]"}`}
                        key={index}
                        onClick={() => handleClick(row, index)}>
                        <p className="overflow-x-scroll container-snap">{`${row.last_name}, ${row.first_name}`}</p>
                        {row.balance < 0 ? <WarningIcon sx={{ fontSize: "100%" }} /> : <></>}
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
