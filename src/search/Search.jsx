import { useState } from 'react'
import { useDisplay } from '../context/useContext'
import AddCustomer from './components/AddCustomer'
import ListDisplay from './components/ListDisplay'
import InfoIcon from '@mui/icons-material/Info'

/**
 * Renders the UI for the customer search bar, adding customer button, 
 * information icon, and list of customers.
 * @component
 * @returns {JSX.Element} The rendered customer search bar, adding customer button, information icon, and list of customers. 
 */
function Search() {
    const [search, setSearch] = useState()
    const { setDisplay } = useDisplay()
    return (
        <div className="flex align-center justify-center flex-col bg-[#303030] p-2">
            <div className="flex flex-row items-center mb-1.5">
                <input
                    id="search-bar"
                    className="rounded-sm w-full h-full text-[0.8rem] md:text-[0.85rem] lg:text-[0.9rem] md:font-bold bg-[#bab4b4] text-black px-1 md:px-2 border-none placeholder::color-black/50 outline-none"
                    type="text"
                    placeholder="search customer..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <AddCustomer />
                <InfoIcon className="cursor-pointer hover:brightness-50" onClick={() => setDisplay("report")} sx={{ color: "white", fontSize: "20px" }} />
            </div>
            <ListDisplay filter={search} />
        </div>
    )
}

export default Search
