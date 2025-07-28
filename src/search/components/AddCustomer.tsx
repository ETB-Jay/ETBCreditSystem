// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { ReactElement } from "react";

import { useDisplay } from "../../context/useContext";

/**
 * Renders a button that allows the user to add a new customer.
 * @returns The AddCustomer button component.
 */
function AddCustomer(): ReactElement {
  const { setDisplay } = useDisplay();
  return (
    <div
      className="ml-0.5 cursor-pointer stroke-white hover:brightness-50"
      onClick={() => setDisplay("user")}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          setDisplay("user");
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 18"
        strokeWidth={2.5}
        stroke="inherit"
        className="size-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v10m5-5h-10" />
      </svg>
    </div>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default AddCustomer;
