import { useEffect, useState } from 'react'
import Search from './search/Search'
import CustomerInfo from './customer-info/CustomerInfo'
import { useDisplay, useCustomerNames, useTotal } from './context/useContext'
import { fetchCustomers } from './firebase'
import CustomerPrompt from './prompts/CustomerPrompt'
import TransactionPrompt from './prompts/TransactionPrompt'
import Report from './prompts/Report'
import EditCustomer from './prompts/EditCustomer'

/**
 * Main application component. Renders the display grid and the main prompts. 
 * It fetches the list of customers and renders it accordingly. 
 *
 * @component
 * @returns {JSX.Element} The Application UI
 */
function App() {
	const { setTotal } = useTotal()
	const { display } = useDisplay()
	const { setCustomers } = useCustomerNames()
	const [error, setError] = useState(null)

	useEffect(() => {
		const loadData = async () => {
			try {
				const [customersData] = await Promise.all([
					fetchCustomers()
				])
				setCustomers(customersData.customers)
				setTotal(customersData.total)
			} catch (error) {
				console.error('Error loading data:', error)
				setError('Failed to load data. Please try again.')
			}
		}
		loadData()
	}, [setCustomers])
	
	return (
		<>
			<div className="bg-gray-900 absolute grid grid-cols-[25%_74%] md:grid-cols-[25%_74.5%] gap-[1%] md:gap-[0.5%] w-full h-full">
				<Search />
				<CustomerInfo />
			</div>
			{display === "user" && <CustomerPrompt />}
			{display === "transaction" && <TransactionPrompt />}
			{display === "report" && <Report />}
			{display === "edit" && <EditCustomer />}
			{error && <div className="error-message">{error}</div>}
		</>
	)
}

export default App
