import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from './context/Providers'
import App from './App'
import './container.css'

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>
)
