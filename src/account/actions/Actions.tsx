import { type ReactElement, useMemo } from "react";

import { useLogDisplay, useLogData } from "../../context/LogContext";
import { cn } from "../modals/scripts";

import ActionButtons from "./components/ActionButtons";

/** Displays the action buttons for the log table. */
const Actions = (): ReactElement => {
  const { logDisplay, setLogDisplay } = useLogDisplay();
  const { logData } = useLogData();

  const containerClasses = useMemo(
    () =>
      cn(
        "container-snap flex flex-col overflow-y-auto rounded-2xl",
        "theme-panel theme-text theme-border gap-2 border p-2 select-none"
      ),
    []
  );

  const handleNewEntry = () => {
    setLogDisplay("add");
  };

  const handleManageColumns = () => {
    setLogDisplay("manage");
  };

  return (
    <div className={containerClasses}>
      <ActionButtons
        onNewEntry={handleNewEntry}
        onManageColumns={handleManageColumns}
        logData={logData}
      />
    </div>
  );
};

export default Actions;
