import PhoneIcon from '@mui/icons-material/Phone';
import { useCustomer } from '../../context/useContext';

function PhoneInfo() {
    const { customer } = useCustomer();
    function formatPhoneNumber(phone: string) {
        if (!phone) return 'N/A';
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }
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
