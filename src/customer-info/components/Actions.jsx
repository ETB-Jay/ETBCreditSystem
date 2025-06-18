import { useDisplay } from '../../context/useContext'
import AddCardIcon from '@mui/icons-material/AddCard';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

/**
 * Displays the triple dot icon that gives the user a list of potential actions related to the customer
 * 
 * @component
 * @returns {JSX.Element} The Action component
 */
function Actions() {
    const { setDisplay } = useDisplay()

    const UserButton = ({icon, display}) => {
        const IconComponent = icon;
        return (
            <IconComponent
                className="cursor-pointer hover:brightness-50"
                onClick={() => setDisplay(display)}
                sx={{ color: "white", fontSize: "18px" }}
            />
        )
    }

    return (
        <div className="bg-blue-950/50 hover:bg-blue-950/75 ring-1 hover:ring-black/90  shadow-md shadow-black rounded-2xl px-2 h-2/3 flex flex-row items-center justify-center gap-2">
            <UserButton icon={AddCardIcon} display={"transaction"}/>
            <UserButton icon={EditIcon} display={"edit"}/>
            <UserButton icon={DeleteIcon} display={"delete"}/>
        </div>
    )
}

export default Actions