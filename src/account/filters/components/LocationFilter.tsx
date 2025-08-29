import React from "react";
import { LocationIcon } from "../../../components";

import type { Location } from "../../../types";

interface LocationFilterProps {
  locations: Location[];
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
  loading?: boolean;
}

const LocationFilter = ({
  locations,
  selectedLocation,
  onLocationChange,
  loading = false,
}: LocationFilterProps) => {
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onLocationChange(value === "all" ? null : value);
  };

  return (
    <select
      id="location-filter"
      value={selectedLocation ?? "all"}
      onChange={handleLocationChange}
      disabled={loading}
      className="theme-bg theme-border theme-text min-w-0 flex-1 rounded border px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 sm:flex-none sm:text-sm"
    >
      <option value="all">All Locations</option>
      {locations.map((location) => (
        <option key={location.id} value={location.name}>
          {location.displayName ?? location.name}
        </option>
      ))}
    </select>
  );
};

export default LocationFilter;
