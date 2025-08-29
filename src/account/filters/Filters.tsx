import { type ReactElement, useMemo } from "react";

import { useLogFilters, useLogLocations } from "../../context/LogContext";
import { cn } from "../modals/scripts";

import LocationFilter from "./components/LocationFilter";

/** Displays the filters for the log table. */
const Filters = (): ReactElement => {
  const { logFilters, setLogFilters } = useLogFilters();
  const { locations, loading: locationsLoading } = useLogLocations();

  const containerClasses = useMemo(
    () =>
      cn(
        "container-snap flex flex-col overflow-y-auto rounded-2xl",
        "theme-panel theme-text theme-border gap-2 border p-2 select-none"
      ),
    []
  );

  const handleLocationChange = (location: string | null) => {
    setLogFilters((prev) => ({
      ...prev,
      location: { selectedLocation: location },
    }));
  };

  return (
    <div className={containerClasses}>
      <LocationFilter
        locations={locations}
        selectedLocation={logFilters.location.selectedLocation}
        onLocationChange={handleLocationChange}
        loading={locationsLoading}
      />
    </div>
  );
};

export default Filters;
