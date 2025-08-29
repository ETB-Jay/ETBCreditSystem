import { type ReactElement, type KeyboardEvent, useCallback, memo } from "react";

import { EmailIcon } from "../../../components/index";
import { useCustomer, useDisplay } from "../../../context/Context";
import { cn } from "../../modals/scripts";

/** Displays the customer's email in a formatted style with an email icon. */
const EmailInfo = memo((): ReactElement => {
  const { customer } = useCustomer();
  const { setDisplay } = useDisplay();
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
      <EmailIcon sx={{ width: 16, height: 16 }} />
      <span className="max-w-32 truncate leading-none font-bold sm:max-w-40 md:max-w-48 lg:max-w-56">
        {customer?.email ?? "N/A"}
      </span>
    </div>
  );
});
EmailInfo.displayName = "EmailInfo";

export default EmailInfo;
