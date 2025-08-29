import { AddIcon, FilterListIcon, LocationIcon } from "../../../components";
import { cn, isCurrentDateLogged } from "../../../utils";

import type { Row } from "../../types";

interface ActionButtonsProps {
  onNewEntry: () => void;
  onManageColumns: () => void;
  onManageLocations?: () => void;
  logData: Row[];
}

const ActionButtons = ({ onNewEntry, onManageColumns, onManageLocations, logData }: ActionButtonsProps) => {
  const isTodayLogged = isCurrentDateLogged(logData);
  
  return (
    <div className="flex flex-row items-center gap-1 sm:gap-2">
      <button
        onClick={onNewEntry}
        disabled={isTodayLogged}
        className={cn(
          "flex items-center justify-center gap-1 rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-semibold transition-all duration-200",
          "theme-panel header-text theme-border border shadow-md",
          isTodayLogged
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-hover cursor-pointer hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:outline-none active:scale-95"
        )}
        type="button"
        title={isTodayLogged ? "Today's entry has already been logged" : "Add new log entry"}
      >
        <AddIcon sx={{ width: 14, height: 14 }} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:block">New Entry</span>
      </button>
      <button
        onClick={onManageColumns}
        className={cn(
          "flex items-center justify-center gap-1 rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-semibold transition-all duration-200",
          "theme-panel header-text hover:bg-hover theme-border cursor-pointer border",
          "hover:scale-105 focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:outline-none active:scale-95"
        )}
        type="button"
        title="Manage columns"
      >
        <FilterListIcon sx={{ width: 14, height: 14 }} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:block">Manage Columns</span>
      </button>
      {onManageLocations && (
        <button
          onClick={onManageLocations}
          className={cn(
            "flex items-center justify-center gap-1 rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-semibold transition-all duration-200",
            "theme-panel header-text hover:bg-hover theme-border cursor-pointer border",
            "hover:scale-105 focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:outline-none active:scale-95"
          )}
          type="button"
          title="Manage locations"
        >
          <LocationIcon sx={{ width: 14, height: 14 }} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:block">Locations</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
