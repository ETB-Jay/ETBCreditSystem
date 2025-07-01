import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import { useCustomer, useCustomerNames, useDisplay } from '../../context/useContext';
import { useEffect, useState } from 'react';

/**
 * Displays the current customer's balance in a container. It updates dynamically
 * @returns {React.ReactElement} The Balance component
 */
function Balance(): React.ReactElement {
    const { customer } = useCustomer();
    const { customers } = useCustomerNames();
    const { setDisplay } = useDisplay();
    const [formattedBalance, setFormattedBalance] = useState('0.00');

    useEffect(() => {
        const updateBalance = () => {
            const currentCustomer = customers.find(c => c.customer_id === customer?.customer_id);
            if (currentCustomer && typeof currentCustomer.balance !== 'undefined') {
                setFormattedBalance(Number(currentCustomer.balance).toFixed(2));
            }
        };
        updateBalance();
    }, [customers, customer?.customer_id]);

    return (
        <div className="flex flex-row items-center justify-between w-fit md:min-w-30 bg-gray-400 rounded-2xl h-full select-none hover:bg-gray-500 ring-2 cursor-pointer" onClick={()=>setDisplay('transaction')}>
            <div className="flex flex-row items-center justify-start md:gap-2 md:pl-2 pr-2">
                <AttachMoneyIcon sx={{fontSize: '25px'}} />
                <p className="text-black font-bold text-sm overflow">{formattedBalance}</p>
            </div>
            {Number(formattedBalance) < 0 ? <WarningIcon fontSize="small" className="mr-2" /> : <></>}
        </div>
    );
}

export default Balance;
