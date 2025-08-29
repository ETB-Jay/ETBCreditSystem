import { type ReactElement, useMemo } from "react";

import { useCustomer } from "../../context/Context";
import { cn } from "../modals/scripts";

import Actions from "./components/Actions";
import Balance from "./components/Balance";
import EmailInfo from "./components/EmailInfo";
import Notes from "./components/Notes";
import PhoneInfo from "./components/PhoneInfo";
import TableDisplay from "./components/TableDisplay";

/** Displays the customer information and transaction history. */
const CustomerInfo = (): ReactElement => {
  const { customer } = useCustomer();

  const containerClasses = useMemo(
    () =>
      cn(
        "container-snap flex flex-col overflow-y-auto",
        "theme-panel theme-text theme-border border rounded-2xl p-2"
      ),
    []
  );

  if (!customer) {
    return (
      <div className={containerClasses}>
        <img src="./ETBBanner.png" alt="" className="m-auto w-2/3 opacity-50" />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          "theme-panel relative flex min-h-fit flex-col gap-2 pb-2",
          "sm:mb-[2vh] md:mb-[1vw] md:h-1/12 xl:mb-[0.5vw]"
        )}
      >
        <div className="flex w-full flex-col items-center gap-2 p-1 sm:gap-x-3 md:flex-row md:justify-between lg:gap-x-4">
          <div className="flex flex-row items-center gap-x-3 lg:gap-x-4">
            <EmailInfo />
            <PhoneInfo />
            <Balance />
          </div>
          <Actions />
        </div>
        <Notes />
      </div>
      <TableDisplay />
    </div>
  );
};

export default CustomerInfo;
