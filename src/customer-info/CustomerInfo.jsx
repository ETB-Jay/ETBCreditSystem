import { useCustomer } from '../context/useContext'
import icon from '../assets/ETBBanner.png'
import EmailInfo from './components/EmailInfo'
import PhoneInfo from './components/PhoneInfo'
import Balance from './components/Balance'
import Actions from './components/Actions'
import TableDisplay from './components/TableDisplay'

/**
 * Displays the customer information and transaction history
 * 
 * @component
 * @returns {JSX.Element} The CustomerInfo component
 */
function CustomerInfo() {
    const { customer } = useCustomer()
    if (Object.keys(customer).length === 0) {
        return (
            <div className="flex align-center flex-col bg-gray-800 p-2 rounded-2xl m-2 ml-0 border border-gray-700">
                <div className="flex flex-row items-center justify-center h-full">
                    <img src={icon} alt="ETB Banner" className="w-2/3 h-auto opacity-50" />
                </div>
            </div>
        )
    }
    return (
        <div className="flex align-center flex-col bg-gray-800 p-2 rounded-2xl m-2 ml-0 border border-gray-700 overflow-y-auto">
            <div className="relative grid grid-cols-[95%_5%] sm:mb-[2vh] md:mb-[1vw] xl:mb-[0.5vw] md:h-1/12">
                <div className="flex flex-row items-center ml-3 gap-4 lg:gap-x-12 w-[95%]">
                    <EmailInfo />
                    <PhoneInfo />
                    <Balance />
                </div>
                <Actions />
            </div>
            <TableDisplay />
        </div>
    )
}

export default CustomerInfo
