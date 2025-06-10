import { useDisplay } from '../../context/useContext'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

/**
 * Displays the triple dot icon that gives the user a list of potential actions related to the customer
 * 
 * @component
 * @returns {JSX.Element} The Action component
 */
function Actions() {
    const { setDisplay } = useDisplay()

    const AddTransactionButton = () => {
        return (
            <div className="stroke-white hover:brightness-50 cursor-pointer"
                onClick={() => setDisplay("transaction")}>
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5} stroke="inherit" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v10m5-5h-10" />
                </svg>
            </div>
        );
    }

    const EditCustomerButton = () => {
        return (
            <EditIcon className="cursor-pointer hover:brightness-50" onClick={() => setDisplay("edit")} sx={{ color: "white", fontSize: "20px" }} />
        );
    }

    return (
        <div className="relative flex flex-row items-start justify-end">
            <AddTransactionButton />
            <EditCustomerButton />
        </div>
    )
}

export default Actions