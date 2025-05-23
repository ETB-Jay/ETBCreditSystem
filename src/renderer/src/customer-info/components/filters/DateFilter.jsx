import { FilterContainer, FilterField, FilterLabel, FilterInput } from './components'
import PropTypes from 'prop-types'

function DateFilter({ onFilterChange, values }) {
    const handleDateChange = (type, value) => {
        if (onFilterChange) {
            onFilterChange({
                startDate: type === "start" ? value : values.startDate,
                endDate: type === "end" ? value : values.endDate
            })
        }
    }

    return (
        <FilterContainer>
            <FilterField>
                <FilterLabel label="Start Date" />
                <FilterInput
                    type="date"
                    value={values.startDate}
                    onChange={(e) => handleDateChange("start", e.target.value)}
                />
            </FilterField>
            <FilterField>
                <FilterLabel label="End Date" />
                <FilterInput
                    type="date"
                    value={values.endDate}
                    onChange={(e) => handleDateChange("end", e.target.value)}
                />
            </FilterField>
        </FilterContainer>
    )
}

DateFilter.propTypes = {
    onFilterChange: PropTypes.func,
    values: PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string
    })
}

export default DateFilter
