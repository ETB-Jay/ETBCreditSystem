import { useState, useEffect } from 'react';
import { useDisplay } from '../context/useContext';
import AddCustomer from './components/AddCustomer';
import ListDisplay from './components/ListDisplay';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Renders the "Search" grid, containing the search bar, the list display, the "AddCustomer" icon, and the Report prompt. 
 * 
 * @component
 * @returns {JSX.Element} The rendered customer search bar, adding customer button, information icon, and list of customers. 
 */
function Search() {
    const [search, setSearch] = useState();
    const { setDisplay } = useDisplay();

    useEffect(() => {
        setSearch('');
    }, []);

    return (
        <div className="flex flex-col bg-gray-800 p-2 overflow-y-scroll container-snap select-none rounded-2xl my-2 mx-1 border border-gray-700">
            <div className="flex flex-row items-center mb-1.5">
                <input
                    className="rounded-sm w-full h-full text-xs font-bold bg-gray-900 text-gray-100 px-1 md:px-2 border border-gray-700 placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500 "
                    type="text"
                    placeholder="search customer..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <AddCustomer />
                <InfoIcon className="cursor-pointer hover:brightness-50" onClick={() => setDisplay('report')} sx={{ color: 'white', fontSize: '20px' }} />
            </div>
            <ListDisplay filter={search} />
        </div>
    );
}

export default Search;
