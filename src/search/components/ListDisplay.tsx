import { memo, ReactElement, useMemo, useCallback, KeyboardEvent } from "react";

import { WarningIcon } from "../../components";
import { useCustomer, useCustomerNames } from "../../context/Context";
import { cn } from "../../modals/scripts";
import { Customer } from "../../types";

/**
 * Displays a filtered list of customers based on the provided filter string.
 * @param props The filter string used to match customer names.
 */
const ListDisplay = memo(({ filter }: { filter: string }): ReactElement => {
  const { customer: selectedCustomer, setCustomer } = useCustomer();
  const { customers } = useCustomerNames();

  const filteredRows = useMemo(
    () =>
      customers
        .filter((customer) => {
          const firstName = customer.firstName || "";
          const lastName = customer.lastName || "";
          const fullName = `${firstName} ${lastName}`;
          return (
            firstName.toLowerCase().includes(filter.toLowerCase()) ||
            lastName.toLowerCase().includes(filter.toLowerCase()) ||
            fullName.toLowerCase().includes(filter.toLowerCase())
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
    (customer: Customer) => {
      setCustomer(customer);
    },
    [setCustomer]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, customer: Customer) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick(customer);
      }
    },
    [handleClick]
  );

  const baseClasses = cn(
    "base flex cursor-pointer flex-row items-center justify-between gap-1",
    "px-2 py-1 text-xs w-full theme-text no-scroll text-left transition-colors"
  );

  return (
    <div className="container-snap overflow-y-scroll">
      <ul className="alternating list-none rounded">
        {filteredRows.map((customer) => {
          const customerName = `${customer.lastName || ""}, ${customer.firstName || ""}`;
          const warningIcon = Number(customer.balance) < 0 && (
            <WarningIcon sx={{ width: 16, height: 16 }} className="icon-danger" />
          );

          return (
            <li key={customer.customerID}>
              <button
                type="button"
                className={cn(
                  baseClasses,
                  selectedCustomer?.customerID === customer.customerID && "bg-accent"
                )}
                onClick={() => handleClick(customer)}
                onKeyDown={(ev: KeyboardEvent<HTMLButtonElement>) => handleKeyDown(ev, customer)}
                aria-labelledby={`customer-name-${customer.customerID}`}
              >
                <span
                  className={cn(
                    selectedCustomer?.customerID === customer.customerID && "font-bold"
                  )}
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

export default ListDisplay;
