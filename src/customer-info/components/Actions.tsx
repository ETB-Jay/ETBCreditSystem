import { ElementType, ReactElement, useCallback, memo } from "react";

import { AddCardIcon, EditIcon, DeleteIcon } from "../../components";
import { useDisplay } from "../../context/Context";
import { cn } from "../../modals/scripts";
import { Display } from "../../types";

/** Displays action buttons for customer-related actions (transaction, edit, delete). */
const Actions = memo((): ReactElement => {
  const { setDisplay } = useDisplay();

  const UserButton = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ icon, display }: { icon: ElementType; display: Display }) => {
      const IconComponent = icon;

      return (
        <div
          className="cursor-pointer rounded-lg px-2 py-1 leading-none transition-all duration-200 hover:bg-gray-100/10 hover:brightness-50"
          onClick={() => setDisplay(display)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setDisplay(display);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={display}
        >
          <IconComponent className="theme-text" sx={{ fontSize: "18px" }} />
        </div>
      );
    },
    [setDisplay]
  );

  return (
    <div
      className={cn(
        "flex h-fit flex-row items-center justify-center gap-2 rounded-2xl px-2",
        "theme-panel hover:bg-hover hover:ring-accent/20 shadow-md ring-1 shadow-black/20"
      )}
    >
      <UserButton icon={AddCardIcon} display="transaction" />
      <UserButton icon={EditIcon} display="edit" />
      <UserButton icon={DeleteIcon} display="delete" />
    </div>
  );
});
Actions.displayName = "Actions";

export default Actions;
