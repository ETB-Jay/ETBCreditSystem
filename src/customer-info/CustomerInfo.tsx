import { ReactElement } from "react";

import { MainContainer } from "../components";
import { useCustomer } from "../context/useContext";
import Actions from "./components/Actions";
import Balance from "./components/Balance";
import EmailInfo from "./components/EmailInfo";
import Notes from "./components/Notes";
import PhoneInfo from "./components/PhoneInfo";
import TableDisplay from "./components/TableDisplay";
import cn from "../components/utils";

/**
 * Displays the customer information and transaction history.
 * @returns The CustomerInfo component.
 */
function CustomerInfo(): ReactElement {
  const { customer } = useCustomer();
  if (!customer) {
    return (
      <MainContainer>
        <div className="flex h-full flex-row items-center justify-center">
          <img src="./ETBBanner.png" alt="" className="h-auto w-2/3 opacity-50" />
        </div>
      </MainContainer>
    );
  }
  return (
    <MainContainer>
      <div
        className={cn("z-10 flex flex-row justify-between gap-5 bg-gray-800 pb-2",
          "sm:mb-[2vh] md:mb-[1vw] md:h-1/12 xl:mb-[0.5vw]")}
      >
        <div className="mt-1 ml-2 flex w-full flex-row items-center gap-x-3 py-0.5 lg:gap-x-4">
          <EmailInfo />
          <PhoneInfo />
          <Balance />
          <Notes />
        </div>
        <Actions />
      </div>
      <TableDisplay />
    </MainContainer>
  );
}

export default CustomerInfo;
