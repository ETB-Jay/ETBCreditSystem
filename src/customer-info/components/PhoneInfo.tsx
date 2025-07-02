import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import { useCustomer } from '../../context/useContext';

/**
 * Displays the customer's phone number in a formatted style with a phone icon.
 * @returns The PhoneInfo component.
 */
function PhoneInfo(): React.ReactElement {
    const { customer } = useCustomer();
    /**
     * Formats a phone number string to (XXX) XXX-XXXX or returns 'N/A' if invalid.
     * @param phone The phone number string.
     * @returns The formatted phone number or the original string if invalid.
     */
    const formatPhoneNumber = (phone: string): string => {
        if (!phone) return 'N/A';
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    };
    return (
        <div className="flex flex-row items-center justify-start h-2/3 select-none">
            <PhoneIcon className="mr-1" sx={{ color: 'white', fontSize: 'max(2vw, 20px)' }} />
            <div className="text-white font-semibold text-sm whitespace-nowrap max-w-7 md:max-w-10 lg:max-w-20 overflow-x-scroll container-snap">
                {formatPhoneNumber(customer?.phone ?? '')}
            </div>
        </div>
    );
}

export default PhoneInfo;
