import CustomerInfo from "./customer-info/CustomerInfo";
import { cn } from "./modals/scripts";
import Search from "./search/Search";

import type { ReactElement } from "react";

const Credit = (): ReactElement => (
  <div className={cn("grid flex-1 grid-cols-[min(30%,200px)_1fr] gap-3 overflow-hidden")}>
    <Search />
    <CustomerInfo />
  </div>
);

export default Credit;
