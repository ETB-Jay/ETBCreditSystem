import { FilterContainer, FilterField, FilterInput } from "../../../../components";
import { useFilters } from "../../../../context/Context";

import type { ReactElement } from "react";

/** Filter component for searching transactions by employee name. */
const EmployeeName = (): ReactElement => {
  const { filters, setFilters } = useFilters();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      employee: {
        ...prev.employee,
        searchTerm: value.trim().toLowerCase(),
      },
    }));
  };

  return (
    <FilterContainer>
      <FilterField label="Employee Name">
        <FilterInput
          type="text"
          value={filters.employee.searchTerm || ""}
          onChange={(ev) => handleSearchChange(ev.target.value)}
          placeholder="Search employee..."
        />
      </FilterField>
    </FilterContainer>
  );
};

export default EmployeeName;
