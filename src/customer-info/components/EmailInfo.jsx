import EmailIcon from '@mui/icons-material/Email';
import { useCustomer } from '../../context/useContext';

/**
 * Displays the customer's email in a formatted style with a enail icon
 * @component
 * @returns {JSX.Element} The EmailInfo component
 */
function EmailInfo() {
    const { customer } = useCustomer();
    return (
        <div className="flex flex-row items-center justify-start max-w-1/5 h-2/3 select-none">
            <EmailIcon className="mr-1" sx={{ color: 'white', fontSize: 'max(2vw, 20px)' }} />
            <div className="text-white font-semibold text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] max-w-8 md:max-w-35 lg:max-w-none overflow-x-scroll no-scroll">{customer.email ? customer.email : 'N/A'}</div>
        </div>
    );
}

export default EmailInfo;
