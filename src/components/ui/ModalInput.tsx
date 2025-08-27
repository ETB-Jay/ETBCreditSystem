import {
  ChangeEvent,
  KeyboardEvent,
  ReactElement,
  useMemo,
  useState,
  isValidElement,
  cloneElement,
} from "react";

import { cn } from "../../modals/scripts";
import { VisibilityOnIcon, VisibilityOffIcon } from "../icons";

interface ModalInputProps {
  icon?: ReactElement;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  sideButtons?: ReactElement;
  required?: boolean;
  autoComplete?: string;
  ariaDescribedby?: string;
}

const ModalInput = ({
  icon,
  value,
  onChange,
  onKeyDown,
  type = "text",
  step,
  disabled,
  placeholder,
  sideButtons,
  required = false,
  autoComplete,
  ariaDescribedby,
}: ModalInputProps) => {
  const [showPass, setShowPass] = useState<boolean>(false);

  const inputType = (() => {
    if (type === "password") {
      return showPass ? "text" : "password";
    }
    return type;
  })();

  const ShowPassword = useMemo(() => {
    const iconClass = cn(
      "absolute top-1/2 right-2 -translate-y-1/2 transition-all",
      "cursor-pointer hover:brightness-50 theme-muted z-10 leading-none"
    );
    const Icon = showPass ? VisibilityOnIcon : VisibilityOffIcon;
    const ariaLabel = showPass ? "Hide password" : "Show password";
    return (
      <button
        type="button"
        className={iconClass}
        onClick={() => setShowPass(!showPass)}
        onKeyDown={(ev) => ev.key === "Enter" && setShowPass(!showPass)}
        aria-label={ariaLabel}
      >
        <Icon sx={{ width: 20, height: 20 }} />
      </button>
    );
  }, [showPass]);

  const FormattedIcon = useMemo(() => {
    if (!isValidElement(icon)) return null;

    return cloneElement(icon as ReactElement<any>, {
      className: cn("theme-muted absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"),
      sx: { width: 16, height: 16 },
    });
  }, [icon]);

  const rightPadding = useMemo(() => (type === "password" ? "pr-10" : "pr-6"), [type]);

  return (
    <div className="relative flex w-full min-w-2/5 flex-row items-center justify-center gap-3">
      <input
        className={cn(
          "theme-input-bg theme-text theme-input-border h-full w-full cursor-text rounded-md p-1 text-xs transition-all outline-none",
          "focus:border-accent focus:ring-accent focus:ring-1 focus:outline-none disabled:cursor-not-allowed",
          icon ? "pl-10" : "pl-3",
          rightPadding
        )}
        type={inputType}
        step={step}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedby}
      />
      {FormattedIcon}
      {type === "password" && ShowPassword}
      {sideButtons && <div className="flex flex-row gap-2">{sideButtons}</div>}
    </div>
  );
};

export default ModalInput;
