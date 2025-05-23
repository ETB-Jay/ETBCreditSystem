import { FilterContainer, FilterField, FilterLabel, FilterInput } from './components'
import PropTypes from 'prop-types'

function EmployeeName({ onFilterChange, values }) {
    const handleSearchChange = (value) => {
        if (onFilterChange) {
            onFilterChange({
                searchTerm: value
            })
        }
    }

    return (
        <FilterContainer>
            <FilterField>
                <FilterLabel label="Employee Name" />
                <FilterInput
                    type="text"
                    value={values.searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search employee..."
                />
            </FilterField>
        </FilterContainer>
    )
}

EmployeeName.propTypes = {
    onFilterChange: PropTypes.func,
    values: PropTypes.shape({
        searchTerm: PropTypes.string
    })
}

export default EmployeeName
