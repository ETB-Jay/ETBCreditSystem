import { useEffect, useState } from 'react';
import Search from './search/Search';
import CustomerInfo from './customer-info/CustomerInfo';
import { useDisplay, useCustomerNames, useTotal } from './context/useContext';
import { fetchCustomers } from './firebase';
import CustomerPrompt from './prompts/CustomerPrompt';
import TransactionPrompt from './prompts/TransactionPrompt';
import Report from './prompts/Report';
import EditCustomer from './prompts/EditCustomer';
import DeletePrompt from './prompts/DeletePrompt';

/**
 * Main application component. Renders the display grid and the main prompts. 
 * It fetches the list of customers and renders it accordingly. 
 *
 * @component
 * @returns {JSX.Element} The Application UI
 */
function App() {
	const { setTotal } = useTotal();
	const { display } = useDisplay();
	const { setCustomers } = useCustomerNames();
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [customersData] = await Promise.all([
					fetchCustomers()
				]);
				setCustomers(customersData.customers);
				setTotal(customersData.total);
			} catch (error) {
				setError(`Failed to load data: ${error}`);
			}
		};
		loadData();
	}, [setCustomers]);
	
	return (
		<>
			<div className="bg-gray-900 absolute grid grid-cols-[25%_75%] w-full h-full">
				<Search />
				<CustomerInfo />
			</div>
			{display === 'user' && <CustomerPrompt />}
			{display === 'transaction' && <TransactionPrompt />}
			{display === 'report' && <Report />}
			{display === 'edit' && <EditCustomer />}
			{display === 'delete' && <DeletePrompt />}
			{error && <div className="error-message">{error}</div>}
		</>
	);
}

export default App;
