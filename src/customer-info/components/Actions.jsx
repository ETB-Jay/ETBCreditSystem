import { useDisplay } from '../../context/useContext'
import AskModify from '../../prompts/AskModify'

/**
 * Displays the triple dot icon that gives the user a list of potential actions related to the customer
 * 
 * @component
 * @returns {JSX.Element} The Action component
 */
function Actions() {
    const { display, setDisplay } = useDisplay()
    let hideTimeout = null

    const handleMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
        }
        setDisplay("option")
    }

    const handleMouseLeave = () => {
        hideTimeout = setTimeout(() => {
            if (display === "option") {
                setDisplay("default")
            }
        }, 300)
    }

    const ActionsIcon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                strokeWidth={2}
                stroke="white"
                className="size-5 lg:size-6 hover:stroke-gray-400 cursor-pointer"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 
                0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
            </svg>
        )
    }

    return (
        <div className="relative flex justify-end"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <ActionsIcon />
            {display === "option" && <AskModify />}
        </div>
    )
}

export default Actions