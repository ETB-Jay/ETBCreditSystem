import { useDisplay } from '../context/useContext'

/**
 * Displays the options to edit the customer in question and create a new transaction
 * 
 * @component
 * @returns {JSX.Element} The AskModify prompt
 */
function AskModify() {
    const { setDisplay } = useDisplay()

    const Button = ({ label, onClick }) => {
        return (
            <div className="text-[0.8rem] text-gray-200 hover:bg-gray-700 px-2 rounded-sm cursor-pointer select-none transition-colors duration-150"
            onClick={onClick}>
                {label}
            </div>
        )
    }

    return (
        <div className="absolute right-5 top-0 bg-gray-800 font-bold rounded flex flex-col z-100 w-[130px] lg:w-[150px] p-1 transition-all duration-200 border border-gray-700 shadow-lg">
            <Button label="New Transaction" onClick={() => { setDisplay("transaction") }}/>
            <Button label="Edit Customer" onClick={() => { setDisplay("edit") }}/>
        </div>
    )
}

export default AskModify
