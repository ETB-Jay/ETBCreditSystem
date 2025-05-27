import { useEffect, useState } from 'react'
import { useDisplay, useCustomerNames } from '../context/useContext'
import { Prompt, PromptButton, PromptField, PromptTitle } from './components'

/**
 * A prompt containing a report of the current number of customers, total credit
 * across those customers, and the total number of outstanding individuals in the
 * system. 
 * @returns {JSX.Element} The Report prompt
 */
function Report() {
    const { customers } = useCustomerNames()
    const { setDisplay } = useDisplay()
    const [outstanding, setOutstanding] = useState(0)

    useEffect(() => {
        setOutstanding(customers.filter(customer => customer.balance < 0).length)
    }, [customers])

    if (customers.length === 0) {
        return;
    }

    return (
        <Prompt>
            <PromptTitle label={"SYSTEM INFORMATION"}></PromptTitle>
            <PromptField label={"Number of Customers:"}>
                <p className="text-white font-semibold">{customers.length}</p>
            </PromptField>
            <PromptField label={"Total Credit Across All Customers:"}>
                <p className="text-white font-semibold">
                    {customers
                        .reduce((total, customer) => total + customer.balance, 0)
                        .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </PromptField>
            <PromptField label={"Number of Outstanding Individuals:"}>
                <p className="text-white font-semibold">{outstanding || 0}</p>
            </PromptField>
            <PromptButton onClick={() => setDisplay("default")} className="bg-red-500 cursor-pointer hover:">Close</PromptButton>
        </Prompt>
    )
}

export default Report
