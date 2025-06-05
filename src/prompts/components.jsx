import PropTypes from 'prop-types'

const Prompt = ({ children }) => (
    <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] transition-normal">
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 h-fit w-2/3 md:w-7/12 lg:w-1/2 xl:w-1/3 p-4 border border-gray-700 shadow-xl">
            {children}
        </div>
    </div>
)

Prompt.propTypes = {
    children: PropTypes.node.isRequired
}

const PromptTitle = ({ label }) => (
    <p className="text-gray-100 font-bold text-lg mb-2 select-none">{label}</p>
)

PromptTitle.propTypes = {
    label: PropTypes.string.isRequired
}

const PromptField = ({ label, children, error=undefined }) => (
    <div className="flex flex-col w-full mb-3">
        <div className="flex flex-row items-center gap-4">
            <p className="text-gray-200 font-semibold text-sm min-w-[110px] text-right select-none">{label}</p>
            <div className="flex-1">
                {children}
            </div>
        </div>
        {error ? <div className="text-red-400 text-xs ml-[136px] select-none">{error}</div> : null}
    </div>
)

PromptField.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    error: PropTypes.string,
    labelWidth: PropTypes.string
}

const PromptInput = ({ value, onChange, type = "text", step, disabled, name, placeholder }) => (
    <input
        className="text-gray-200 text-[0.8rem] bg-gray-800 rounded-md px-3 py-1.5 h-7 w-full outline-none transition-colors focus:bg-gray-700 hover:bg-gray-700 border border-gray-700 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        type={type}
        step={step}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
    />
)

PromptInput.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    placeholder: PropTypes.string
}

const PromptButton = ({ onClick, disabled, children }) => (
    <button
        className={`flex flex-row gap-x-1 text-sm font-bold bg-gray-800 text-gray-200 rounded-md px-4 py-1.5 w-fit cursor-pointer transition-colors select-none hover:bg-gray-700 active:bg-gray-600 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
)

PromptButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired
}

export { Prompt, PromptTitle, PromptButton, PromptField, PromptInput }
