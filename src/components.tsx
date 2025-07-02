import React from 'react';

interface MainContainerProps {
    children: React.ReactNode;
}
/**
 * Main container component for wrapping content in a styled div.
 * @param props The props for the MainContainer.
 * @returns The rendered container.
 */
const MainContainer = ({ children }: MainContainerProps) => (
    <div className="flex flex-col bg-gray-800 p-2 overflow-y-scroll container-snap rounded-2xl my-2 mx-1 border border-gray-700 ">
        {children}
    </div>
);

interface PromptProps {
    children: React.ReactNode;
    title: React.ReactNode;
    onClose?: () => void;
}
/**
 * Prompt container component for wrapping prompts in a styled div.
 * @param props The props for the Prompt.
 * @returns The rendered prompt dialog.
 */
const Prompt = ({ children, title }: PromptProps) => (
    <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-xs select-none">
        <div className="relative flex flex-col items-center justify-center rounded-xl bg-gray-900 w-2/3 md:w-7/12 lg:w-1/2 xl:w-1/3 p-4 border border-gray-700 shadow-xl prompt-animate">
            <div className="text-gray-100 font-bold text-lg mb-2">{title}</div>
            {children}
        </div>
    </div>
);

interface PromptFieldProps {
    children: React.ReactNode;
    error?: string;
}
/**
 * Field wrapper for prompt forms and error messages.
 * @param props The props for the PromptField.
 * @returns The rendered field with error display.
 */
const PromptField = ({ children, error = undefined }: PromptFieldProps) => (
    <div className="flex flex-col w-full mb-3">
        {children}
        {error ? <div className="text-red-500 text-xs mt-1 ml-1">{error}</div> : null}
    </div>
);

interface PromptInputProps {
    label?: string | React.ReactElement;
    value: string;
    onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    step?: string;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
}
/**
 * Input component for prompts.
 * @param props The props for the PromptInput.
 * @returns The rendered input field.
 */
const PromptInput = ({ label, value, onChange, type = 'text', step, disabled, name, placeholder }: PromptInputProps) => (
    <div className="flex flex-col w-full min-w-2/5 gap-0.5">
        <div className="text-gray-200 font-medium text-sm mb-1">{label}</div>
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

interface PromptButtonProps {
    onClick: () => void;
    disabled: boolean;
    warning?: boolean;
    label: string;
    icon: React.ReactNode;
}
/**
 * Button component for prompts.
 * @param props The props for the PromptButton.
 * @returns The rendered button.
 */
const PromptButton = ({ onClick, disabled, warning = false, label, icon }: PromptButtonProps) => (
    <button
        className={`text-sm font-bold items-center justify-center px-4 py-1.5 rounded-md w-fit border border-gray-700 transition-colors cursor-pointer disabled:cursor-not-allowed text-gray-200 ${warning ? 'bg-red-900 hover:bg-red-800 active:bg-red-950 disabled:bg-red-950/50' : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 disabled:bg-gray-700/50'}`}
        onClick={onClick}
        disabled={disabled}
    >
        {icon}
        {label}
    </button>
);

interface FilterContainerProps {
    children: React.ReactNode;
}
/**
 * Container for filter UI elements.
 * @param props The props for the FilterContainer.
 * @returns The rendered filter container.
 */
const FilterContainer = ({ children }: FilterContainerProps) => (
    <div className="absolute w-fit bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded p-1 shadow-lg">
        {children}
    </div>
);

interface FilterFieldProps {
    children: React.ReactNode;
    label: string;
}
/**
 * Field wrapper for filter inputs and labels.
 * @param props The props for the FilterField.
 * @returns The rendered filter field.
 */
const FilterField = ({ children, label }: FilterFieldProps) => (
    <div className="flex flex-col gap-1.5 p-1 min-w-[100px]">
        <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-200">{label}</p>
            {children}
        </div>
    </div>
);

interface FilterInputProps {
    type: string;
    value: string;
    onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    dollar?: boolean;
    min?: string;
    max?: string;
    step?: string;
}
/**
 * Input component for filters.
 * @param props The props for the FilterInput.
 * @returns The rendered filter input field.
 */
const FilterInput = ({ type, value, onChange, placeholder, dollar = false, min, max }: FilterInputProps) => (
    <div className="relative flex flex-row items-center">
        {dollar && <span className="text-gray-400 mr-1 text-xs">$</span>}
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
