import { FilterContainer, FilterField, FilterLabel, FilterInput } from "./components"
import { useFilters } from "../../../context/useContext"

function Amount() {
    const { filters, setFilters } = useFilters()
    
    return (
        <FilterContainer>
            <FilterField>
                <FilterLabel label="Minimum Amount" />
                <FilterInput
                    type="number"
                    value={filters.amount?.minAmount}
                    onChange={(e) => setFilters({...filters, amount: {...filters.amount, minAmount: e.target.value}})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                />
            </FilterField>
            <FilterField>
                <FilterLabel label="Maximum Amount" />
                <FilterInput
                    type="number"
                    value={filters.amount?.maxAmount}
                    onChange={(e) => setFilters({...filters, amount: {...filters.amount, maxAmount: e.target.value}})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                />
            </FilterField>
        </FilterContainer>
    );
}

export default Amount;
