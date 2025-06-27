import { useCustomer } from '../context/useContext';
import icon from '../assets/ETBBanner.png';
import EmailInfo from './components/EmailInfo';
import PhoneInfo from './components/PhoneInfo';
import Balance from './components/Balance';
import Actions from './components/Actions';
import Notes from './components/Notes';
import TableDisplay from './components/TableDisplay';
import { MainContainer } from '../components';

/**
 * Displays the customer information and transaction history
 * 
 * @component
 * @returns {JSX.Element} The CustomerInfo component
 */
function CustomerInfo() {
    const { customer } = useCustomer();
    if (!customer) {
        return (
            <MainContainer>
                <div className="flex flex-row items-center justify-center h-full">
                    <img src={icon} alt="ETB Banner" className="w-2/3 h-auto opacity-50" />
                </div>
            </MainContainer>
        );
    }
    return (
        <MainContainer>
            <div className="z-10 bg-gray-800 pb-2 gap-5 flex flex-row justify-between sm:mb-[2vh] md:mb-[1vw] xl:mb-[0.5vw] md:h-1/12">
                <div className="flex flex-row items-center ml-2 mt-1 gap-x-3 lg:gap-x-4 w-full">
                    <EmailInfo />
                    <PhoneInfo />
                    <Balance />
                    <Notes />
                </div>
                <Actions />
            </div>
            <TableDisplay />
        </MainContainer>
    );
}

export default CustomerInfo;
