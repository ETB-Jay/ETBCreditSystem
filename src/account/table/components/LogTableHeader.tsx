import ActionButtons from "../../actions/components/ActionButtons";
import MonthSelector from "../../filters/components/MonthSelector";
import LocationFilter from "../../filters/components/LocationFilter";

import type { ReactElement } from "react";
import type { Location, Row } from "../../types";

interface LogTableHeaderProps {
  selectedMonth: string;
  sortedMonths: [string, { monthName: string; entries: any[] }][];
  onMonthChange: (month: string) => void;
  onNewEntry: () => void;
  onManageColumns: () => void;
  onManageLocations?: () => void;
  locations: Location[];
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
  locationsLoading?: boolean;
  logData: Row[];
}

const LogTableHeader = ({
  selectedMonth,
  sortedMonths,
  onMonthChange,
  onNewEntry,
  onManageColumns,
  onManageLocations,
  locations,
  selectedLocation,
  onLocationChange,
  locationsLoading = false,
  logData,
}: LogTableHeaderProps): ReactElement => (
  <header className="theme-panel flex-shrink-0 p-3 shadow-md">
    {/* Mobile Layout - Stacked */}
    <div className="flex flex-col gap-3 lg:hidden">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <h1 className="header-text text-lg font-bold drop-shadow-sm">Account Log</h1>
        <ActionButtons
          onNewEntry={onNewEntry}
          onManageColumns={onManageColumns}
          onManageLocations={onManageLocations}
          logData={logData}
        />
      </div>
      
      {/* Filters Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MonthSelector
            selectedMonth={selectedMonth}
            sortedMonths={sortedMonths}
            onMonthChange={onMonthChange}
          />
          <LocationFilter
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={onLocationChange}
            loading={locationsLoading}
          />
        </div>
      </div>
    </div>

    {/* Desktop Layout - Horizontal */}
    <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
      {/* Title and Month Selector */}
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="header-text text-lg font-bold drop-shadow-sm">Account Log</h1>
        <MonthSelector
          selectedMonth={selectedMonth}
          sortedMonths={sortedMonths}
          onMonthChange={onMonthChange}
        />
      </div>
      <div className="flex items-center gap-4">
        <LocationFilter
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
          loading={locationsLoading}
        />
        <ActionButtons
          onNewEntry={onNewEntry}
          onManageColumns={onManageColumns}
          onManageLocations={onManageLocations}
          logData={logData}
        />
      </div>
    </div>
  </header>
);

export default LogTableHeader;
