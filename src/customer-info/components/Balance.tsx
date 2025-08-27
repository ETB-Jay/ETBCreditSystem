import { ReactElement, useState, useEffect, KeyboardEvent, useCallback, memo } from "react";

import { CashIcon, WarningIcon } from "../../components";
import { useCustomer, useCustomerNames, useDisplay } from "../../context/Context";
import { cn } from "../../modals/scripts";

/** Displays the current customer's balance in a styled container. */
const Balance = memo((): ReactElement => {
  const { customer } = useCustomer();
  const { customers } = useCustomerNames();
  const { setDisplay } = useDisplay();
  const [formattedBalance, setFormattedBalance] = useState("0.00");

  useEffect(() => {
    const updateBalance = () => {
      const currentCustomer = customers.find((cus) => cus.customerID === customer?.customerID);
      if (currentCustomer && typeof currentCustomer.balance !== "undefined") {
        setFormattedBalance(Number(currentCustomer.balance).toFixed(2));
      }
    };
    updateBalance();
  }, [customers, customer?.customerID]);

  const isNegative = Number(formattedBalance) < 0;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 select-none",
        "rounded border px-2 py-1 transition-all duration-200",
        "font-mono text-xs",
        isNegative ? "danger-bg-dark danger-ring icon-danger" : "gray-border gray-bg-medium"
      )}
      role="button"
      tabIndex={0}
      onClick={useCallback(() => setDisplay("transaction"), [setDisplay])}
      onKeyDown={useCallback(
        (ev: KeyboardEvent<HTMLDivElement>) => {
          if (ev.key === "Enter" || ev.key === " ") {
            setDisplay("transaction");
          }
        },
        [setDisplay]
      )}
    >
      <CashIcon sx={{ width: 16, height: 16 }} />
      <span className="leading-none font-bold">{formattedBalance}</span>
      {isNegative && <WarningIcon sx={{ width: 16, height: 16 }} />}
    </div>
  );
});
Balance.displayName = "Balance";

export default Balance;
