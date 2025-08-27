import { FC, ReactNode, useEffect } from "react";

import { ClearIcon } from "../icons";

interface ModalProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  handleClose?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  closeable?: boolean;
}

const Modal: FC<ModalProps> = ({
  children,
  title,
  icon,
  handleClose,
  isLoading = false,
  loadingText = "Processing...",
  closeable = true,
}) => {
  useEffect(() => {
    if (!closeable || !handleClose) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleClose, closeable]);

  const loadingContent = (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="loading-spinner h-10 w-10 animate-spin rounded-full border-4" />
        <div className="loading-spinner absolute inset-0 animate-ping rounded-full border-4 border-transparent" />
      </div>
      <div className="loading-text ml-3 font-medium">{loadingText}</div>
    </div>
  );

  const content = isLoading ? loadingContent : <div className="space-y-4">{children}</div>;

  return (
    <div className="theme-backdrop fixed inset-0 flex min-h-screen items-center justify-center overflow-y-auto text-center backdrop-blur-md">
      <div className="modal-animate theme-bg theme-border relative z-100 min-w-1/2 rounded-2xl border p-6 shadow-2xl">
        <h3 className="white-text mb-3 inline-flex w-full items-center justify-center gap-2 text-xl font-semibold">
          {title}
          {icon}
        </h3>
        {closeable && handleClose && (
          <button
            type="button"
            className="white-text modal-close-hover modal-close-focus absolute top-2 right-2 rounded-full p-2 transition-all duration-200 focus:outline-none"
            onClick={handleClose}
          >
            <ClearIcon sx={{ width: 16, height: 16 }} className="theme-muted cursor-pointer" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
};

export default Modal;
