import { ReactElement } from "react";

import { FilterContainer, FilterField, FilterInput } from "../../../components";
import { useFilters } from "../../../context/useContext";

/**
 * Filter component for specifying minimum and maximum transaction amounts.
 * @returns The Amount filter component.
 */
function Amount(): ReactElement {
  const { filters, setFilters } = useFilters();

  return (
    <FilterContainer>
      <FilterField label="Minimum Amount">
        <FilterInput
          type="number"
          value={filters.amount.minAmount}
          onChange={(ev) =>
            setFilters({ ...filters, amount: { ...filters.amount, minAmount: ev.target.value } })
          }
          placeholder="0.00"
          dollar
        />
      </FilterField>
      <FilterField label="Maximum Amount">
        <FilterInput
          type="number"
          value={filters.amount.maxAmount}
          onChange={(ev) =>
            setFilters({ ...filters, amount: { ...filters.amount, maxAmount: ev.target.value } })
          }
          placeholder="0.00"
          min={filters.amount.minAmount}
          dollar
        />
      </FilterField>
    </FilterContainer>
  );
}

export default Amount;
