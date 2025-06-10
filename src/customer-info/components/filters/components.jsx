import PropTypes from 'prop-types';

const FilterContainer = ({ children }) => (
    <div className="absolute w-fit bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded p-1 shadow-lg">
        {children}
    </div>
)

FilterContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const FilterField = ({ children }) => (
    <div className="flex flex-col gap-1.5 p-1 min-w-[100px]">
        <div className="flex flex-col gap-1">
            {children}
        </div>
    </div>
)

FilterField.propTypes = {
    children: PropTypes.node.isRequired
}

const FilterLabel = ({ label }) => (
    <p className="text-xs font-medium text-gray-200">
        {label}
    </p>
)

FilterLabel.propTypes = {
    label: PropTypes.node.isRequired
}

const FilterInput = ({
    type, value, onChange, placeholder, dollar=false, min, max
}) => (
    <div className="relative flex flex-row items-center">
        {dollar ? <span className="text-gray-400 mr-1 text-xs">$</span> : <></>}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            className={`px-2 py-0.5 text-xs bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500
            ${type === 'date' ? '[color-scheme:dark]' : ''}`}
            onClick={(e) => e.stopPropagation()}
        />
    </div>
)

FilterInput.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    dollar: PropTypes.bool,
    min: PropTypes.string,
    max: PropTypes.string
}

export { FilterContainer, FilterField, FilterLabel, FilterInput }
