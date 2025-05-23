import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import WarningIcon from '@mui/icons-material/Warning';
import { useCustomer, useTransactions } from '../../context/useContext'
import { useEffect, useState } from 'react';

/**
 * Displays the current customer's balance in a container. It updates dynamically
 * @returns {JSX.Element} The Balance component
 */
function Balance() {
    const { customer } = useCustomer()
    const { transactions } = useTransactions()
    const [formattedBalance, setFormattedBalance] = useState("0.00")

    useEffect(() => {
        const updateBalance = () => {
            if (customer && typeof customer.balance !== "undefined") {
                setFormattedBalance(Number(customer.balance).toFixed(2))
            }
        }
        updateBalance()
    }, [customer, transactions])

    return (
        <>
            <div className="flex flex-row items-center justify-between w-2/3 h-full sm:pl-1 sm:pr-5 md:pr-3 md:pl-5 lg:px-5 bg-gray-400 rounded-2xl">
                <div className="flex flex-row items-center justify-start">
                    <AttachMoneyIcon className="mr-2" sx={{ color: "black", fontSize: "3vw" }} />
                    <p className="text-black font-bold text-[0.9rem] md:text-[1.2rem] lg:text-[1.5rem] overflow-x-auto container-snap">{formattedBalance}</p>
                </div>
                {Number(formattedBalance) < 0 ? <WarningIcon fontSize="small" /> : <></>}
            </div>
        </>
    )
}

export default Balance
