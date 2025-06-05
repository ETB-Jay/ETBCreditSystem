import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import WarningIcon from '@mui/icons-material/Warning';
import { useCustomer, useCustomerNames } from '../../context/useContext'
import { useEffect, useState } from 'react';

/**
 * Displays the current customer's balance in a container. It updates dynamically
 * @returns {JSX.Element} The Balance component
 */
function Balance() {
    const { customer } = useCustomer()
    const { customers } = useCustomerNames()
    const [formattedBalance, setFormattedBalance] = useState("0.00")

    useEffect(() => {
        const updateBalance = () => {
            // Find the current customer in the updated customers list
            const currentCustomer = customers.find(c => c.id === customer?.id)
            if (currentCustomer && typeof currentCustomer.balance !== "undefined") {
                setFormattedBalance(Number(currentCustomer.balance).toFixed(2))
            }
        }
        updateBalance()
    }, [customers, customer?.id])

    return (
        <div className="flex flex-row items-center justify-between w-fit bg-gray-400 rounded-2xl lg:h-2/3 select-none">
            <div className="flex flex-row items-center justify-start">
                <AttachMoneyIcon className="mx-2" sx={{fontSize: "min(5vw, 5vh, 25px)"}} />
                <p className="text-black font-bold text-[0.9rem] md:text-[1.1rem] lg:text-[1.2rem]  overflow-x-auto container-snap pr-5">{formattedBalance}</p>
            </div>
            {Number(formattedBalance) < 0 ? <WarningIcon fontSize="small" /> : <></>}
        </div>
    )
}

export default Balance
