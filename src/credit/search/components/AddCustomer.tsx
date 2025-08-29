import { type ReactElement, useCallback, type KeyboardEvent } from "react";

import { AddIcon } from "../../../components";
import { useDisplay } from "../../../context/Context";

/** Renders a button that allows the user to add a new customer */
const AddCustomer = (): ReactElement => {
  const { setDisplay } = useDisplay();
  return (
    <div
      className="theme-text ml-0.5 cursor-pointer leading-none hover:brightness-50"
      onClick={useCallback(() => setDisplay("user"), [setDisplay])}
      onKeyDown={useCallback(
        (ev: KeyboardEvent<HTMLDivElement>) => {
          if (ev.key === "Enter" || ev.key === " ") {
            setDisplay("user");
          }
        },
        [setDisplay]
      )}
    >
      <AddIcon className="theme-muted transition-colors" sx={{ width: 20, height: 20 }} />
    </div>
  );
};

export default AddCustomer;
