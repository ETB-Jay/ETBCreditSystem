import { useDisplay } from '../../context/useContext'

/**
 * Renders a button that allows the user to add a new customer.
 * Triggers the `setDisplay` function from the `useDisplay` context
 *
 * @component
 * @returns {JSX.Element} A "+" button that triggers "CustomerPrompt.jsx"
 */
function AddCustomer() {
    const { setDisplay } = useDisplay()
    return (
        <div className="ml-0.5 stroke-white hover:brightness-50 cursor-pointer"
            onClick={() => setDisplay("user")}>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 18"
                strokeWidth={2.5} stroke="inherit" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v10m5-5h-10" />
            </svg>
        </div>
    )
}

export default AddCustomer
