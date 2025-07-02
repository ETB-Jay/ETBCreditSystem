import React from 'react';
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
import LoginPrompt from './prompts/LoginPrompt';

/**
 * Main application component. Renders the display grid and the main prompts. 
 * It fetches the list of customers and renders it accordingly. 
 *
 * @component
 * @returns The Application UI
 */
function App(): React.ReactElement {
	const { setTotal } = useTotal();
	const { display } = useDisplay();
	const { setCustomers } = useCustomerNames();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const unsubscribe = fetchCustomers(({ customers, total }) => {
					setCustomers(customers);
					setTotal(total);
				});
				return () => unsubscribe();
			} catch (error) {
				setError(`Failed to load data: ${error}`);
			}
		};
		loadData();
	}, []);
	
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
			{display === 'login' && <LoginPrompt />}
			{error && <div className="error-message">{error}</div>}
		</>
	);
}

export default App;
