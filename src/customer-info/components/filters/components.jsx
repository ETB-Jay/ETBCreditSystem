import PropTypes from 'prop-types';

const FilterContainer = ({ children }) => (
    <div className="absolute w-fit bg-[#d7e2f5] border-3 border-gray-500 hover:bg-[#bacbe8] rounded p-1">
        {children}
    </div>
)

FilterContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const FilterField = ({ children }) => (
    <div className="flex flex-col gap-2 p-1 min-w-[100px]">
        <div className="flex flex-col gap-1">
            {children}
        </div>
    </div>
)

FilterField.propTypes = {
    children: PropTypes.node.isRequired
}

const FilterLabel = ({ label }) => (
    <p className="text-xs lg:text-sm font-medium">
        {label}
    </p>
)

FilterLabel.propTypes = {
    label: PropTypes.node.isRequired
}

const FilterInput = ({
    type, value, onChange, placeholder
}) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
    />
)

FilterInput.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
}

export { FilterContainer, FilterField, FilterLabel, FilterInput }
