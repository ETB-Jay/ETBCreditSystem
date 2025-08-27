import { ChangeEvent, FC, memo } from "react";

import { cn } from "../../modals/scripts";
import { CashIcon } from "../icons";

interface FilterInputProps {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: number;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  showDollarSign?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

const FilterInput: FC<FilterInputProps> = memo(
  ({
    value,
    onChange,
    type = "text",
    step,
    disabled,
    name,
    placeholder,
    showDollarSign = false,
    min,
    max,
    className,
  }) => (
    <div
      className={cn(
        "theme-text theme-bg relative flex flex-row items-center justify-center",
        className
      )}
    >
      {showDollarSign && (
        <div className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2">
          <CashIcon className="theme-muted" />
        </div>
      )}
      <input
        className={cn(
          "theme-input-border theme-input-bg placeholder-muted rounded border text-xs",
          "focus:border-accent focus:ring-accent focus:ring-1 focus:outline-none",
          "transition-all duration-200",
          showDollarSign ? "pr-2 pl-8" : "px-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        type={type}
        step={step}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        min={min}
        max={max}
        onClick={(ev) => ev.stopPropagation()}
        aria-label={placeholder}
      />
    </div>
  )
);
FilterInput.displayName = "FilterInput";

export default FilterInput;
