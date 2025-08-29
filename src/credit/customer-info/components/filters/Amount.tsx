import { FilterContainer, FilterField, FilterInput } from "../../../../components";
import { useFilters } from "../../../../context/Context";

import type { ReactElement } from "react";

/** Filter component for specifying minimum and maximum transaction amounts. */
const Amount = (): ReactElement => {
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
        />
      </FilterField>
    </FilterContainer>
  );
};

export default Amount;
