import PhoneIcon from '@mui/icons-material/Phone'
import { useCustomer } from '../../context/useContext'

/**
 * Displays the customer's phone number in a formatted style with a phone icon
 * @component
 * @returns {JSX.Element} The PhoneInfo component
 */
function PhoneInfo() {
    const { customer } = useCustomer()
    function formatPhoneNumber(phone) {
        if (!phone) return "N/A"
        const cleaned = ("" + phone).replace(/\D/g, "")
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`
        }
        return phone
    }
    return (
        <div className="flex flex-row items-center justify-start h-2/3 select-none">
            <PhoneIcon className="mr-1" sx={{ color: "white", fontSize: "max(2vw, 20px)" }} />
            <div className="text-white font-semibold text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] whitespace-nowrap max-w-8 md:max-w-20 lg:max-w-none overflow-x-scroll no-scroll">
                {formatPhoneNumber(customer.phone)}
            </div>
        </div>
    )
}

export default PhoneInfo
