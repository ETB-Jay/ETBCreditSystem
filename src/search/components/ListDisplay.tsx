// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import WarningIcon from "@mui/icons-material/Warning";
import { useState, memo, useMemo, useCallback, ReactElement, KeyboardEvent } from "react";

import { useCustomer, useCustomerNames } from "../../context/useContext";
import { cn } from "../../prompts/scripts";
import { Customer } from "../../types";

/**
 * Displays a filtered list of customers based on the provided filter string.
 * @param props The filter string used to match customer names.
 */
const ListDisplay = memo(({ filter }: { filter: string }): ReactElement => {
  const { setCustomer } = useCustomer();
  const { customers } = useCustomerNames();
  const [, setSelectedIndex] = useState<number | null>(null);

  const filteredRows = useMemo(
    () =>
      customers
        .filter((customer) => {
          const firstName = customer.firstName || "";
          const lastName = customer.lastName || "";
          const fullName = `${firstName} ${lastName}`.toLowerCase();
          return (
            firstName.toLowerCase().includes(filter.toLowerCase()) ||
            lastName.toLowerCase().includes(filter.toLowerCase()) ||
            fullName.includes(filter.toLowerCase())
          );
        })
        .sort((itemA, itemB) => {
          const lastNameA = itemA.lastName || "";
          const lastNameB = itemB.lastName || "";
          const firstNameA = itemA.firstName || "";
          const firstNameB = itemB.firstName || "";
          const lastNameCompare = lastNameA.localeCompare(lastNameB);
          return lastNameCompare === 0 ? firstNameA.localeCompare(firstNameB) : lastNameCompare;
        }),
    [customers, filter]
  );

  const handleClick = useCallback(
    (customer: Customer, index: number) => {
      setCustomer(customer);
      setSelectedIndex(index);
    },
    [setCustomer]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent, customer: Customer, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick(customer, index);
      }
    },
    [handleClick]
  );

  const baseClasses = cn(
    "base flex cursor-pointer flex-row items-center justify-between",
    "px-2 py-1 text-xs hover:bg-gray-600 cursor-pointer w-full"
  );

  return (
    <div className="container-snap overflow-y-scroll text-gray-100">
      <ul className="list-none">
        {filteredRows.map((customer, index) => {
          const customerName = `${customer.lastName || ""}, ${customer.firstName || ""}`;
          const warningIcon = (Number(customer.balance) < 0) && <WarningIcon fontSize="inherit" />;

          return (
            <li
              key={customer.customerID}
              className="rounded-sm transition-all odd:bg-gray-800 even:bg-gray-700/50"
            >
              <button
                type="button"
                className={cn(baseClasses)}
                onClick={() => handleClick(customer, index)}
                onKeyDown={(event) => handleKeyDown(event, customer, index)}
                aria-labelledby={`customer-name-${customer.customerID}`}
              >
                <span
                  className="no-scroll overflow-x-scroll text-left transition-all hover:font-bold"
                  id={`customer-name-${customer.customerID}`}
                >
                  {customerName}
                </span>
                {warningIcon}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
ListDisplay.displayName = "ListDisplay";

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default ListDisplay;
