// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  ChangeEvent,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from "react";

import { cn } from "./prompts/scripts";

/**
 * Main container component for wrapping content in a styled div.
 * @param props The props for the MainContainer.
 * @returns The rendered container.
 */
const MainContainer = ({ children }: PropsWithChildren) => (
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
  <div className="mb-3 flex w-full flex-col gap-2 text-white relative">
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
          aria-label={placeholder}
          autoComplete="no"
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

const GithubLink = "https://github.com/ETB-Jay/ETBCreditSystem";
const GithubIcon = () => (
  <a href={GithubLink} target="_blank" rel="noopener noreferrer" aria-label={GithubLink}>
    <svg width="25" height="25" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={
          "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 " +
          "3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 " +
          "2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015" +
          ".324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 " +
          "4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 " +
          "0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 " +
          "13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 " +
          "12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 " +
          "13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 " +
          "24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 " +
          "1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 " +
          "75.788 0 48.854 0z"
        }
        fill="#fff"
      />
    </svg>
  </a>
);

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export { MainContainer };
export { Prompt, PromptButton, PromptField, PromptInput };
export { FilterContainer, FilterField, FilterInput };
export { GithubIcon };
