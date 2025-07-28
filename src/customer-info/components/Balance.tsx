// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import { KeyboardEvent, ReactElement, useEffect, useState } from "react";

import { useCustomer, useCustomerNames, useDisplay } from "../../context/useContext";
import { cn } from "../../prompts/scripts";

/** Displays the current customer's balance in a styled container. */
function Balance(): ReactElement {
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

  return (
    <div
      className={cn(
        "flex h-full w-fit cursor-pointer flex-row items-center justify-between",
        "rounded-2xl bg-gray-400 ring-2 select-none hover:bg-gray-500 md:min-w-30"
      )}
      role="button"
      tabIndex={0}
      onClick={() => setDisplay("transaction")}
      onKeyDown={(ev: KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter" || ev.key === " ") {
          setDisplay("transaction");
        }
      }}
    >
      <div className="flex flex-row items-center justify-start pr-2 md:gap-2 md:pl-2">
        <AttachMoneyIcon sx={{ fontSize: "25px" }} />
        <p className="overflow text-sm font-bold text-black">{formattedBalance}</p>
      </div>
      {Number(formattedBalance) < 0 && <WarningIcon fontSize="small" className="mr-2" />}
    </div>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default Balance;
