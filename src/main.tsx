import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppProviders from './context/Providers';
import App from './App';
import './container.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppProviders>
			<App />
		</AppProviders>
	</StrictMode>
);
