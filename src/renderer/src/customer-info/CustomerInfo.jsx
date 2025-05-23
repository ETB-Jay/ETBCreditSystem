import Actions from './components/Actions'
import EmailInfo from './components/EmailInfo'
import PhoneInfo from './components/PhoneInfo'
import Balance from './components/Balance'
import TableDisplay from './components/TableDisplay'
import { useCustomer } from '../context/useContext'
import icon from '../../../../resources/ETBBanner.png'

/**
 * CustomerInfo component displays customer-related information. It shows the banner if no info is available
 *
 * @component
 * @returns {JSX.Element} Customer Information
 */
function CustomerInfo() {
    const { customer } = useCustomer()
    if (Object.keys(customer).length === 0) {
        return (
            <div className="flex items-center flex-col bg-[#303030] p-2 justify-center w-full">
                <img className="brightness-40 h-2/3 w-auto" src={icon} draggable="false"></img>
            </div>
        )
    }
    return (
        <>
            <div className="flex align-center flex-col bg-[#303030] p-2">
                <div className="relative grid grid-cols-[95%_5%] sm:mb-[2vh] md:mb-[1vw] xl:mb-[0.5vw] md:h-1/12 ">
                    <div className="flex flex-row items-center ml-3 w-[95%]">
                        <EmailInfo />
                        <PhoneInfo />
                        <Balance />
                    </div>
                    <Actions />
                </div>
                <TableDisplay />
            </div>
        </>
    )
}

export default CustomerInfo
