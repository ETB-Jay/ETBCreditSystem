import { ReactElement, memo, useState, useCallback } from "react";

import { InfoIcon, ModalInput } from "../components";
import { useDisplay } from "../context/Context";
import { cn } from "../modals/scripts";
import AddCustomer from "./components/AddCustomer";
import ListDisplay from "./components/ListDisplay";

const SEARCH_PLACEHOLDER = "search customer...";

/** Renders the customer search grid with the search bar, add customer, report, and customer list */
const Search = memo((): ReactElement => {
  const [search, setSearch] = useState<string>("");
  const { setDisplay } = useDisplay();

  return (
    <div
      className={cn(
        "container-snap flex flex-col overflow-y-scroll rounded-2xl",
        "theme-panel theme-text theme-border gap-2 border p-2 select-none"
      )}
    >
      <div className="flex flex-row items-center gap-1">
        <ModalInput
          value={search}
          onChange={useCallback((ev) => setSearch(ev.target.value), [])}
          placeholder={SEARCH_PLACEHOLDER}
          autoComplete="no"
        />
        <AddCustomer />
        <InfoIcon
          className="theme-muted cursor-pointer hover:brightness-50"
          sx={{ width: 20, height: 20 }}
          onClick={useCallback(() => setDisplay("report"), [setDisplay])}
        />
      </div>
      <ListDisplay filter={search} />
    </div>
  );
});
Search.displayName = "Search";

export default Search;
