// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import EmailIcon from "@mui/icons-material/Email";
import { ReactElement } from "react";

import { useCustomer } from "../../context/useContext";
import { cn } from "../../prompts/scripts";

/** Displays the customer's email in a formatted style with an email icon. */
function EmailInfo(): ReactElement {
  const { customer } = useCustomer();
  return (
    <div className="flex h-2/3 max-w-1/5 flex-row items-center justify-start select-none">
      <EmailIcon className="mr-1" sx={{ color: "white", fontSize: "max(2vw, 20px)" }} />
      <div
        className={cn("container-snap max-w-8 overflow-x-scroll text-sm",
          "font-semibold text-white md:max-w-35 lg:max-w-none")}
      >
        {customer?.email ?? "N/A"}
      </div>
    </div>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default EmailInfo;
