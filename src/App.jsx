import { useEffect } from 'react'
import Search from './search/Search'
import CustomerInfo from './customer-info/CustomerInfo'
import CustomerPrompt from './prompts/CustomerPrompt'
import TransactionPrompt from './prompts/TransactionPrompt'
import Report from './prompts/Report'
import EditCustomer from './prompts/EditCustomer'
import { useDisplay, useCustomerNames, useTransactions } from './context/useContext'
import { initializeCustomers, initializeTransactions } from './initializeData'


/**
 * Main application component. Renders the display grid and any prompts.
 * It also calls initializeTransactions and initializeCustomers when they are 
 * updated. 
 *
 * @component
 * @returns {JSX.Element} The Application UI
 */
function App() {
	const { display } = useDisplay()
	const { setCustomers } = useCustomerNames()
	const { setTransaction } = useTransactions()

	useEffect(() => {
		initializeTransactions(setTransaction)
	}, [setTransaction])

	useEffect(() => {
		initializeCustomers(setCustomers)
	}, [setCustomers])

	return (
		<>
			<div className="bg-[#1f1f1f] absolute grid grid-cols-[25%_74%] md:grid-cols-[25%_74.5%] gap-[1%] md:gap-[0.5%] w-full h-full">
				<Search />
				<CustomerInfo />
			</div>
			{display === "user" && <CustomerPrompt />}
			{display === "transaction" && <TransactionPrompt />}
			{display === "report" && <Report />}
			{display === "edit" && <EditCustomer />}
		</>
	)
}

export default App
