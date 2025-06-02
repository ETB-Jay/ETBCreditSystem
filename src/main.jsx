import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CustomerProvider, DisplayProvider, CustomerNamesProvider, TransactionProvider, FilterProvider } from './context/Providers'
import App from './App'
import './container.css'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<DisplayProvider>
			<CustomerProvider>
				<CustomerNamesProvider>
					<TransactionProvider>
						<FilterProvider>
							<App />
						</FilterProvider>
					</TransactionProvider>
				</CustomerNamesProvider>
			</CustomerProvider>
		</DisplayProvider>
	</StrictMode>
)
