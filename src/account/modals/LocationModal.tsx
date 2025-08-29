import React, { useState } from "react";
import { Modal, ModalInput, ModalButtonGroup, LocationIcon, DeleteIcon } from "../../components";

import type { Location } from "../../types";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onAddLocation: (locationName: string) => Promise<void>;
  onDeleteLocation: (locationId: string) => Promise<void>;
  loading?: boolean;
}

const LocationModal = ({
  isOpen,
  onClose,
  locations,
  onAddLocation,
  onDeleteLocation,
  loading = false,
}: LocationModalProps) => {
  const [newLocationName, setNewLocationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      setError("Location name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAddLocation(newLocationName.trim());
      setNewLocationName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocation = async (locationId: string, locationName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the location "${locationName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await onDeleteLocation(locationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete location");
    }
  };

  const handleCancel = () => {
    setNewLocationName("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Manage Locations"
      handleClose={handleCancel}
      isLoading={loading}
      loadingText="Loading locations..."
    >
      <div className="space-y-4">
        {/* Add New Location */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Add New Location</h3>
          <div className="flex gap-2">
            <ModalInput
              type="text"
              icon={<LocationIcon />}
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              placeholder="Enter location name (e.g., ETB Oakville)"
              aria-label="Location Name"
              disabled={isSubmitting}
            />
            <button
              onClick={handleAddLocation}
              disabled={isSubmitting || !newLocationName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Existing Locations */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Existing Locations</h3>
          {locations.length === 0 ? (
            <p className="text-sm text-gray-500">No locations found. Add your first location above.</p>
          ) : (
            <div className="container-snap space-y-2 max-h-60 overflow-y-auto">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <div className="flex items-center gap-2">
                    <LocationIcon sx={{ width: 16, height: 16 }} />
                    <span className="text-sm font-medium">
                      {location.displayName || location.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(location.id, location.displayName || location.name)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Delete location"
                  >
                    <DeleteIcon sx={{ width: 16, height: 16 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <ModalButtonGroup
          onCancel={handleCancel}
          onSubmit={() => {}} // No submit action needed
          submitLabel=""
          isSubmitting={false}
          submitDisabled={true}
          hideSubmit={true}
        />
      </div>
    </Modal>
  );
};

export default LocationModal;
