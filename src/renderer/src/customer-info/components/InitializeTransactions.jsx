import { useEffect } from 'react'
import { useTransactions } from '../../context/useContext'
import { initializeTransactions } from '../../utils/initializeData'

/**
 * Initializes the transaction list by fetching transaction records
 *
 * @component
 * @returns {null}
 */
function InitializeTransactions() {
    const { setTransaction } = useTransactions()

    useEffect(() => {
        initializeTransactions(setTransaction)
    }, [setTransaction])

    return null
}

export default InitializeTransactions