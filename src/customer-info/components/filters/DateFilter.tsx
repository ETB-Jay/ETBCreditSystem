// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { ReactElement } from "react";

import { FilterContainer, FilterField, FilterInput } from "../../../components";
import { useFilters } from "../../../context/useContext";

/** Filter component for selecting a date range for transactions. */
function DateFilter(): ReactElement {
  const { filters, setFilters } = useFilters();

  const handleDateChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        [type === "start" ? "startDate" : "endDate"]: value,
      },
    }));
  };

  return (
    <FilterContainer>
      <FilterField label="Start Date">
        <FilterInput
          type="date"
          value={filters.date.startDate || ""}
          onChange={(ev) => handleDateChange("start", ev.target.value)}
          max={filters.date.endDate || undefined}
          placeholder="Start date"
        />
      </FilterField>
      <FilterField label="End Date">
        <FilterInput
          type="date"
          value={filters.date.endDate || ""}
          onChange={(ev) => handleDateChange("end", ev.target.value)}
          min={filters.date.startDate || undefined}
          placeholder="End date"
        />
      </FilterField>
    </FilterContainer>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default DateFilter;
