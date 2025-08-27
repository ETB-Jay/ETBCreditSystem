import { FC, ReactNode } from "react";

import { cn } from "../../modals/scripts";

interface FilterContainerProps {
  children: ReactNode;
  className?: string;
}

const FilterContainer: FC<FilterContainerProps> = ({ children, className }) => (
  <div
    className={cn(
      "shadow-theme absolute rounded border-2 p-1",
      "theme-panel theme-text theme-border border",
      className
    )}
  >
    {children}
  </div>
);

export default FilterContainer;
