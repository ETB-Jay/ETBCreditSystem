import React from 'react';
import PropTypes from 'prop-types';
import { useCustomer, useCustomerNames } from '../../context/useContext';
import WarningIcon from '@mui/icons-material/Warning';
import { useState, memo, useMemo, useCallback } from 'react';
import { Customer } from '../../types';

/**
 * Displays a filtered list of customers based on the provided filter string.
 * @param props The filter string used to match customer names.
 * @returns A scrollable list of customer names.
 */
function ListDisplay({ filter = '' }): React.ReactElement {
    const { setCustomer } = useCustomer();
    const { customers } = useCustomerNames();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

    const handleClick = useCallback((customer: Customer, index: number) => {
        setCustomer(customer);
        setSelectedIndex(index);
    }, [setCustomer]);

    return (
        <div className="text-gray-100 overflow-y-scroll container-snap">
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
