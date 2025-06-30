const MainContainer = ({ children }) => (
    <div className="flex flex-col bg-gray-800 p-2 overflow-y-scroll container-snap rounded-2xl my-2 mx-1 border border-gray-700 ">
        {children}
    </div>
);

const Prompt = ({ children, title }) => (
    <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] select-none">
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900 w-2/3 md:w-7/12 lg:w-1/2 xl:w-1/3 p-4 border border-gray-700 shadow-xl">
            <p className="text-gray-100 font-bold text-lg mb-2">{title}</p>
            {children}
        </div>
    </div>
);

const PromptField = ({ children, error = undefined }) => (
    <div className="flex flex-col w-full mb-3">
        {children}
        {error ? <div className="text-red-500 text-xs mt-1 ml-1">{error}</div> : null}
    </div>
);

const PromptInput = ({ label, value, onChange, type = 'text', step, disabled, name, placeholder }) => (
    <div className="flex flex-col w-full min-w-2/5 gap-0.5">
        <label className="text-gray-200 font-medium text-sm mb-1">{label}</label>
        <input
            className="text-gray-200 text-sm bg-gray-800 rounded-md px-2 py-0.5 h-7 w-full outline-none focus:bg-gray-500 hover:bg-gray-700 border border-gray-700 placeholder-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            type={type}
            step={step}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
        />
    </div>
);

const PromptButton = ({ onClick, disabled, warning = false, label, icon }) => (
    <button
        className={`text-sm font-bold items-center justify-center px-4 py-1.5 rounded-md w-fit border border-gray-700 transition-colors cursor-pointer disabled:cursor-not-allowed text-gray-200 ${warning ? 'bg-red-900 hover:bg-red-800 active:bg-red-950 disabled:bg-red-950/50' : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 disabled:bg-gray-700/50'}`}
        onClick={onClick}
        disabled={disabled}
    >
        {icon}
        {label}
    </button>
);

const FilterContainer = ({ children }) => (
    <div className="absolute w-fit bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded p-1 shadow-lg">
        {children}
    </div>
);

const FilterField = ({ children, label }) => (
    <div className="flex flex-col gap-1.5 p-1 min-w-[100px]">
        <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-200">{label}</p>
            {children}
        </div>
    </div>
);

const FilterInput = ({ type, value, onChange, placeholder, dollar = false, min, max }) => (
    <div className="relative flex flex-row items-center">
        {dollar ? <span className="text-gray-400 mr-1 text-xs">$</span> : null}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            className="px-2 py-0.5 text-xs bg-gray-900 text-gray-200 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
            onClick={e => e.stopPropagation()}
        />
    </div>
);

export { MainContainer };
export { Prompt, PromptButton, PromptField, PromptInput };
export { FilterContainer, FilterField, FilterInput };
