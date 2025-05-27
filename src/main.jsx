import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './container.css'
import App from './App'
import { CustomerProvider, DisplayProvider, CustomerNamesProvider, TransactionProvider } from './context/Providers'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<DisplayProvider>
			<CustomerProvider>
				<CustomerNamesProvider>
					<TransactionProvider>
						<App />
					</TransactionProvider>
				</CustomerNamesProvider>
			</CustomerProvider>
		</DisplayProvider>
	</StrictMode>
)
