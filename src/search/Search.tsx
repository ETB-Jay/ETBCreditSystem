// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import InfoIcon from "@mui/icons-material/Info";
import { useState, ReactElement } from "react";

import { useDisplay } from "../context/useContext";
import AddCustomer from "./components/AddCustomer";
import ListDisplay from "./components/ListDisplay";
import { cn } from "../prompts/scripts";

// ─ Constants ────────────────────────────────────────────────────────────────────────────────────
const SEARCH_PLACEHOLDER = "search customer...";

/**
 * Renders the customer search grid with the search bar, add customer, report, and customer list.
 * @returns The Search component.
 */
function Search(): ReactElement {
  const [search, setSearch] = useState<string>("");
  const { setDisplay } = useDisplay();

  return (
    <div
      className={cn(
        "container-snap mx-1 my-2 flex flex-col overflow-y-scroll rounded-2xl",
        "border border-gray-700 bg-gray-800 p-2 text-white select-none"
      )}
    >
      <div className="mb-1.5 flex flex-row items-center">
        <input
          className={cn(
            "h-full w-full rounded-sm border border-gray-700 bg-gray-900 px-1 text-xs font-bold",
            "placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500 md:px-2"
          )}
          type="text"
          placeholder={SEARCH_PLACEHOLDER}
          onChange={(ev) => setSearch(ev.target.value)}
          aria-label={SEARCH_PLACEHOLDER}
          autoComplete="no"
        />
        <AddCustomer />
        <InfoIcon
          className="cursor-pointer hover:brightness-50"
          onClick={() => setDisplay("report")}
          fontSize="small"
        />
      </div>
      <ListDisplay filter={search} />
    </div>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default Search;
