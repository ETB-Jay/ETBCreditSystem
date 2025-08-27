import { ReactNode, memo } from "react";

import { cn } from "../../modals/scripts";

interface ModalButtonProps {
  onClick?: () => void;
  disabled: boolean;
  warning?: boolean;
  label: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
}

const ModalButton = memo(
  ({
    onClick,
    disabled,
    warning = false,
    label,
    icon,
    variant = "primary",
    size = "md",
    type = "button",
  }: ModalButtonProps) => {
    const baseClasses =
      "inline-flex items-center justify-center cursor-pointer font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 w-full focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
      success: "btn-success",
    };

    const buttonVariant = warning ? "danger" : variant;

    return (
      <button
        className={cn(baseClasses, variantClasses[buttonVariant], sizeClasses[size])}
        onClick={onClick}
        disabled={disabled}
        // eslint-disable-next-line react/button-has-type
        type={type}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </button>
    );
  }
);
ModalButton.displayName = "ModalButton";

export default ModalButton;
