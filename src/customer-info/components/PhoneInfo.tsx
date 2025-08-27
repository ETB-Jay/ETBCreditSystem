import { ReactElement, KeyboardEvent, useCallback, memo } from "react";

import { PhoneIcon } from "../../components/index";
import { useCustomer, useDisplay } from "../../context/Context";
import { cn } from "../../modals/scripts";

/**
 * Displays the customer's phone number in a formatted style with a phone icon.
 * @returns The PhoneInfo component.
 */
const PhoneInfo = memo((): ReactElement => {
  const { customer } = useCustomer();
  const { setDisplay } = useDisplay();
  /**
   * Formats a phone number string to (XXX) XXX-XXXX or returns 'N/A' if invalid.
   * @param phone The phone number string.
   * @returns The formatted phone number or the original string if invalid.
   */
  const formatPhoneNumber = useCallback((phone: string): string => {
    if (!phone) {
      return "N/A";
    }
    const cleaned = `${phone}`.replace(/\D/g, "");
    const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }, []);

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 select-none",
        "rounded border px-2 py-1 transition-all duration-200",
        "font-mono text-xs hover:brightness-80",
        "gray-border gray-bg-medium gray-text-light"
      )}
      role="button"
      tabIndex={0}
      onClick={useCallback(() => setDisplay("edit"), [setDisplay])}
      onKeyDown={useCallback(
        (ev: KeyboardEvent<HTMLDivElement>) => {
          if (ev.key === "Enter" || ev.key === " ") {
            setDisplay("edit");
          }
        },
        [setDisplay]
      )}
    >
      <PhoneIcon sx={{ width: 16, height: 16 }} />
      <span
        className="max-w-28 truncate leading-none font-bold sm:max-w-32 md:max-w-36"
        title={formatPhoneNumber(customer?.phone ?? "")}
      >
        {formatPhoneNumber(customer?.phone ?? "")}
      </span>
    </div>
  );
});
PhoneInfo.displayName = "PhoneInfo";

export default PhoneInfo;
