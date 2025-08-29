import React, { type ReactNode } from "react";

import ModalButton from "./ModalButton";

interface ModalButtonGroupProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
  cancelIcon?: ReactNode;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  className?: string;
  submitButtonProps?: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "disabled" | "type"
  >;
  cancelButtonProps?: Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "disabled" | "type"
  >;
}

const ModalButtonGroup = ({
  onSubmit,
  onCancel,
  submitLabel = "Confirm",
  cancelLabel = "Cancel",
  submitIcon = null,
  cancelIcon = null,
  isSubmitting = false,
  submitDisabled = false,
  cancelDisabled = false,
  className = "flex w-full space-x-3",
  submitButtonProps = {},
  cancelButtonProps = {},
}: ModalButtonGroupProps) => {
  return (
    <div className={className}>
      {onSubmit && (
        <ModalButton
          onClick={onSubmit}
          disabled={isSubmitting || submitDisabled}
          label={submitLabel}
          icon={submitIcon}
          type="submit"
          {...submitButtonProps}
        />
      )}
      {onCancel && (
        <ModalButton
          onClick={onCancel}
          disabled={isSubmitting || cancelDisabled}
          label={cancelLabel}
          icon={cancelIcon}
          variant="secondary"
          type="button"
          {...cancelButtonProps}
        />
      )}
    </div>
  );
};

export default ModalButtonGroup;
