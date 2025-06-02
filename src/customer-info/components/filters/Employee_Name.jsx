import { FilterContainer, FilterField, FilterLabel, FilterInput } from './components'
import { useFilters } from '../../../context/useContext'

function EmployeeName() {
    const { filters, setFilters } = useFilters()
    
    const handleSearchChange = (value) => {
        setFilters(prev => ({
            ...prev,
            employee: {
                ...prev.employee,
                searchTerm: value.trim().toLowerCase()
            }
        }))
    }

    return (
        <FilterContainer>
            <FilterField>
                <FilterLabel label="Employee Name" />
                <FilterInput
                    type="text"
                    value={filters.employee?.searchTerm || ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search employee..."
                    autoComplete="off"
                    spellCheck="false"
                />
            </FilterField>
        </FilterContainer>
    );
}

export default EmployeeName;
