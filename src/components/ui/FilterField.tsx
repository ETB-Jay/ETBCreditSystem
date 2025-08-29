import React, { type ReactNode, memo } from "react";

import { cn } from "../../credit/modals/scripts";

interface FilterFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

const FilterField: React.FC<FilterFieldProps> = memo(({ label, children, error, className }) => (
  <div className={cn("theme-panel theme-text flex min-w-[100px] flex-col gap-1.5 p-1", className)}>
    <div className="theme-text text-xs font-medium">{label}</div>
    {children}
    {error && <div className="theme-text text-xs text-red-600">{error}</div>}
  </div>
));

FilterField.displayName = "FilterField";

export default FilterField;
