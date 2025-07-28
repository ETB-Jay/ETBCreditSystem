import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  ChangeEvent,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from "react";

import cn from "./components/utils";

interface MainContainerProps {
  children: ReactNode;
}
/**
 * Main container component for wrapping content in a styled div.
 * @param props The props for the MainContainer.
 * @returns The rendered container.
 */
const MainContainer = ({ children }: MainContainerProps) => (
  <div
    className={cn(
      "container-snap mx-1 my-2 flex flex-col overflow-y-scroll",
      "rounded-2xl border border-gray-700 bg-gray-800 p-2"
    )}
  >
    {children}
  </div>
);

interface PromptProps {
  children: ReactNode;
  title: ReactNode;
}
/**
 * Prompt container component for wrapping prompts in a styled div.
 * @param props The props for the Prompt.
 * @returns The rendered prompt dialog.
 */
const Prompt = ({ children, title }: PromptProps) => (
  <div className="fixed inset-0 z-10 flex items-center justify-center backdrop-blur-xs select-none">
    <div
      className={cn(
        "prompt-animate relative flex w-2/3 flex-col items-center justify-center",
        "rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-xl md:w-7/12 lg:w-1/2 xl:w-1/3"
      )}
    >
      <div className="mb-2 text-lg font-bold text-gray-100">{title}</div>
      {children}
    </div>
  </div>
);

interface PromptFieldProps {
  children: ReactNode;
  error?: string;
}
/**
 * Field wrapper for prompt forms and error messages.
 * @param props The props for the PromptField.
 * @returns The rendered field with error display.
 */
const PromptField = ({ children, error = undefined }: PromptFieldProps) => (
  <div className="mb-3 flex w-full flex-col gap-2 text-white">
    {children}
    {error && <div className="mt-1 ml-1 text-xs text-red-500">{error}</div>}
  </div>
);

interface PromptInputProps {
  icon?: ReactElement;
  value: string;
  onChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  label?: string;
  sideButtons?: ReactElement;
}
/**
 * Input component for prompts.
 * @param props The props for the PromptInput.
 * @returns The rendered input field.
 */
const PromptInput = ({
  icon,
  value,
  onChange,
  type = "text",
  step,
  disabled,
  name,
  placeholder,
  sideButtons,
}: PromptInputProps) => {
  const [showPass, setShowPass] = useState<boolean>(false);

  const inputType = showPass ? "type" : type;

  const ShowPassword = useMemo(() => {
    const sharedProps = {
      fontSize: "small" as const,
      className: cn(
        "absolute top-1/2 right-2 -translate-y-1/2 transition-all",
        "cursor-pointer hover:brightness-50"
      ),
      onClick: () => setShowPass((prev) => !prev),
    };

    return showPass ? <VisibilityIcon {...sharedProps} /> : <VisibilityOffIcon {...sharedProps} />;
  }, [showPass]);

  const FormattedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<any>, {
      className: `${(icon.props as any).className ?? ""} absolute left-2 top-1/2 -translate-y-1/2`,
    })
    : null;

  const rightPadding = useMemo(() => (type === "password" ? "pr-10" : "pr-3"), [type]);

  return (
    <div className="relative flex w-full min-w-2/5 flex-row items-center justify-center gap-3">
      <div className="relative flex-[4]">
        <input
          className={cn("rounded-md bg-gray-800 text-xs text-gray-200 h-7 w-full border",
            "border-gray-700 py-0.5 placeholder-gray-500 transition-all outline-none",
            "hover:bg-gray-700 focus:bg-gray-700/80 disabled:cursor-not-allowed",
            "disabled:bg-gray-200 [&:-webkit-autofill]:border-transparent",
            "[&:-webkit-autofill]:shadow-[inset_0_0_0_200px_rgba(55,65,81,1)]",
            "[&:-webkit-autofill]:[-webkit-text-fill-color:rgb(147,197,253)]",
            icon ? "pl-9" : "pl-3", rightPadding
          )}
          type={inputType}
          step={step}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          autoComplete="on"
          aria-label={placeholder}
        />
        {icon && FormattedIcon}
        {type === "password" && !sideButtons && ShowPassword}
      </div>
      {sideButtons && <div className="flex flex-row gap-2">{sideButtons}</div>}
    </div>
  );
};

interface PromptButtonProps {
  onClick: () => void;
  disabled: boolean;
  warning?: boolean;
  label: string;
  icon: ReactNode;
}
/**
 * Button component for prompts.
 * @param props The props for the PromptButton.
 * @returns The rendered button.
 */
const PromptButton = ({ onClick, disabled, warning = false, label, icon }: PromptButtonProps) => (
  <button
    className={cn(
      "w-fit cursor-pointer items-center justify-center rounded-md border border-gray-700 px-4",
      "py-1.5 text-sm font-bold text-gray-200 transition-colors disabled:cursor-not-allowed",
      warning
        ? "bg-red-900 hover:bg-red-800 active:bg-red-950 disabled:bg-red-950/50"
        : "bg-gray-800 hover:bg-gray-700 active:bg-gray-600 disabled:bg-gray-700/50"

    )}
    onClick={onClick}
    disabled={disabled}
    type="button"
  >
    {icon}
    {label}
  </button>
);

interface FilterContainerProps {
  children: ReactNode;
}
/**
 * Container for filter UI elements.
 * @param props The props for the FilterContainer.
 * @returns The rendered filter container.
 */
const FilterContainer = ({ children }: FilterContainerProps) => (
  <div className="absolute rounded border-2 bg-gray-800 p-1 shadow-xl shadow-black/20">
    {children}
  </div>
);

interface FilterFieldProps {
  children: ReactNode;
  label: string;
}
/**
 * Field wrapper for filter inputs and labels.
 * @param props The props for the FilterField.
 * @returns The rendered filter field.
 */
const FilterField = ({ children, label }: FilterFieldProps) => (
  <div className="flex min-w-[100px] flex-col gap-1.5 p-1">
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-gray-200">{label}</p>
      {children}
    </div>
  </div>
);

interface FilterInputProps {
  type: string;
  value: string;
  onChange: (_e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  dollar?: boolean;
  min?: string;
  max?: string;
}
/**
 * Input component for filters.
 * @param props The props for the FilterInput.
 * @returns The rendered filter input field.
 */
const FilterInput = ({
  type,
  value,
  onChange,
  placeholder,
  dollar = false,
  min,
  max,
}: FilterInputProps) => (
  <div className="relative flex flex-row items-center justify-center text-white">
    {dollar && <AttachMoneyIcon fontSize="small" />}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={cn(
        "rounded border border-gray-700 bg-gray-900 px-2 py-0.5 text-xs text-gray-200",
        "placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      )}
      onClick={(ev) => ev.stopPropagation()}
      aria-label={placeholder}
    />
  </div>
);

export { MainContainer };
export { Prompt, PromptButton, PromptField, PromptInput };
export { FilterContainer, FilterField, FilterInput };
