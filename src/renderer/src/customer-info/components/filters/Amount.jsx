import { FilterContainer, FilterField, FilterLabel, FilterInput } from "./components"
import PropTypes from 'prop-types'

function Amount({ onFilterChange, values }) {
    const handleAmountChange = (type, value) => {
        const numericValue = value.replace(/[^0-9.-]/g, "")
        if (onFilterChange) {
            onFilterChange({
                minAmount: type === "min" ? numericValue : values.minAmount,
                maxAmount: type === "max" ? numericValue : values.maxAmount
            })
        }
    }
    return (
        <FilterContainer>
            <FilterField>
                <FilterLabel label="Minimum Amount" />
                <div className="relative flex flex-row items-center justify-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <FilterInput
                        type="text"
                        value={values.minAmount}
                        onChange={(e) => handleAmountChange("min", e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </FilterField>
            <FilterField>
                <FilterLabel label="Maximum Amount" />
                <div className="relative flex flex-row items-center justify-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <FilterInput
                        type="text"
                        value={values.maxAmount}
                        onChange={(e) => handleAmountChange("max", e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </FilterField>
        </FilterContainer>
    )
}

Amount.propTypes = {
    onFilterChange: PropTypes.func,
    values: PropTypes.shape({
        minAmount: PropTypes.string,
        maxAmount: PropTypes.string
    })
}

export default Amount
