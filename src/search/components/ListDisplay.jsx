import PropTypes from 'prop-types';
import { useCustomer, useCustomerNames } from '../../context/useContext';
import WarningIcon from '@mui/icons-material/Warning';
import { useState, memo, useMemo, useCallback } from 'react';

/**
 * Displays a filtered list of customers based on the provided filter string taken from the search bar
 * 
 * @component
 * @param {string} filter - The filter string used to match customer first or last names (case-insensitive).
 * @returns {JSX.Element} A scrollable list of customer names. Clicking a name sets the selected customer.
 */
function ListDisplay({ filter = '' }) {
    const { setCustomer } = useCustomer();
    const { customers } = useCustomerNames();
    const [selectedIndex, setSelectedIndex] = useState(null);

    const filteredRows = useMemo(() =>
        customers
            .filter((customer) => {
                const fullName = (customer.first_name + ' ' + customer.last_name).toLowerCase();
                return ((customer.first_name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
                    (customer.last_name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
                    (fullName || '').includes(filter.toLowerCase()));
            })
            .sort((a, b) => {
                const lastNameCompare = (a.last_name || '').localeCompare(b.last_name || '');
                return lastNameCompare !== 0 ? lastNameCompare : (a.first_name || '').localeCompare(b.first_name || '');
            }),
        [customers, filter]
    );

    const handleClick = useCallback((customer, index) => {
        setCustomer(customer);
        setSelectedIndex(index);
    }, [setCustomer]);

    return (
        <div className="text-gray-100 h-full overflow-y-auto container-snap">
            <ul className="list-none">
                {filteredRows.map((customer, index) => (
                    <li className={`base flex flex-row items-center justify-between text-xs lg:text-sm px-2 py-1 cursor-pointer rounded-sm 
                    hover:bg-gray-600 hover:font-bold hover:transition-all
                    ${selectedIndex === index ? 'bg-gray-700 font-bold' : 'odd:bg-gray-800 even:bg-gray-700/50'}`}
                        key={`${customer.customer_id}-${index}`}
                        onClick={() => handleClick(customer, index)}>
                        <p className="overflow-x-scroll no-scroll">{`${customer.last_name}, ${customer.first_name}`}</p>
                        {Number(customer.balance) < 0 ? <WarningIcon sx={{ fontSize: '100%' }} /> : <></>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ListDisplay.propTypes = {
    filter: PropTypes.string
};

export default memo(ListDisplay);
