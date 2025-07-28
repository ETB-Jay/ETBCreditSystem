// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import PhoneIcon from "@mui/icons-material/Phone";
import { ReactElement } from "react";

import { useCustomer } from "../../context/useContext";
import { cn } from "../../prompts/scripts";

/**
 * Displays the customer's phone number in a formatted style with a phone icon.
 * @returns The PhoneInfo component.
 */
function PhoneInfo(): ReactElement {
  const { customer } = useCustomer();
  /**
   * Formats a phone number string to (XXX) XXX-XXXX or returns 'N/A' if invalid.
   * @param phone The phone number string.
   * @returns The formatted phone number or the original string if invalid.
   */
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) { return "N/A"; }
    const cleaned = `${phone}`.replace(/\D/g, "");
    const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);
    if (match) { return `(${match[1]}) ${match[2]}-${match[3]}`; }
    return phone;
  };
  return (
    <div className="flex h-2/3 flex-row items-center justify-start select-none">
      <PhoneIcon className="mr-1" sx={{ color: "white", fontSize: "max(2vw, 20px)" }} />
      <div
        className={cn("container-snap max-w-7 overflow-x-scroll text-sm font-semibold",
          "whitespace-nowrap text-white md:max-w-10 lg:max-w-20")}
      >
        {formatPhoneNumber(customer?.phone ?? "")}
      </div>
    </div>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default PhoneInfo;
