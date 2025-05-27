import { useDisplay } from '../context/useContext'

/**
 * Displays the options to edit the customer in question and create a new transaction
 * 
 * @component
 * @returns {JSX.Element} The AskModify prompt
 */
function AskModify() {
    const { setDisplay } = useDisplay()

    return (
        <div
            className="absolute right-5 top-0 bg-[#d7e2f5] font-bold rounded flex flex-col z-10 w-[130px] lg:w-[150px] p-1 transition-all duration-200"
        >
            <div
                className="text-[0.8rem] lg:text-[1rem] hover:bg-[#bacbe8] px-2 rounded-sm cursor-pointer select-none transition-colors duration-150"
                onClick={() => { setDisplay("transaction") }}
            >
                New Transaction
            </div>
            <div
                className="text-[0.8rem] lg:text-[1rem] hover:bg-[#bacbe8] px-2 rounded-sm cursor-pointer select-none transition-colors duration-150"
                onClick={() => { setDisplay("edit") }}
            >
                Edit Customer
            </div>
        </div>
    )
}

export default AskModify
