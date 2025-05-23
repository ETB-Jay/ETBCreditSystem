import { useEffect } from 'react'
import { useCustomerNames } from '../../context/useContext'
import { initializeCustomers } from '../../utils/initializeData'

/**
 * Initializes the customer list by fetching customer records
 *
 * @component
 * @returns {null}
 */
function InitializeCustomers() {
    const { setCustomers } = useCustomerNames();

    useEffect(() => {
        initializeCustomers(setCustomers)
    }, [setCustomers])

    return null
}

export default InitializeCustomers