import { Timestamp } from "firebase/firestore";
import { useState, useEffect, type ChangeEvent, useRef } from "react";

import {
  Modal,
  ModalInput,
  ModalButtonGroup,
  ModalField,
  CashIcon,
  AddIcon,
  ClearIcon,
  ArrowDropDownIcon,
  DeleteIcon,
} from "../../components";
import { canEditEntry } from "../../utils";

import type { Row, Column, Location } from "../../types";

// Utility function for conditional class names
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

// SideButton component (same as TransactionModal)
interface SideButtonProps {
  label: React.ReactElement;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}

const SideButton = ({ label, color, onClick, disabled = false, title = "" }: SideButtonProps) => {
  const buttonClass = cn(
    "flex items-center justify-center rounded-full p-0.5 ring-2 transition-all",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    color
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
    >
      {label}
    </button>
  );
};

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Row | null;
  mode: "add" | "edit";
  onSave: (entry: Row) => Promise<void>;
  columns: Column[];
  locations: Location[];
  onAddLocation?: (locationName: string) => Promise<void>;
  onDeleteLocation?: (locationId: string) => Promise<void>;
}

const LogEntryModal = ({
  isOpen,
  onClose,
  entry,
  mode,
  onSave,
  columns,
  locations,
  onAddLocation,
  onDeleteLocation,
}: LogEntryModalProps) => {
  const [formData, setFormData] = useState({
    datelog: "",
    cashamount: "",
    location: "",
    employeeName: "",
  });
  const [creditValues, setCreditValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Employee management state
  const [employees, setEmployees] = useState<string[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
  const [newEmployeeName, setNewEmployeeName] = useState<string>("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState<boolean>(false);

  // Location management state
  const [showAddLocation, setShowAddLocation] = useState<boolean>(false);
  const [newLocationName, setNewLocationName] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [isLocationSubmitting, setIsLocationSubmitting] = useState(false);

  // Refs for blur handling
  const employeeDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Check if the entry can be edited based on its date (only for edit mode)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const isEditingAllowed = (() => {
    if (mode === "add") return true;
    if (!entry) return false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      return canEditEntry(entry.datelog);
    } catch {
      return false;
    }
  })();

  // Load employees from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setEmployees(parsed);
      } catch {
        setEmployees([]);
      }
    } else {
      setEmployees([]);
    }
  }, []);

  // Handle blur events for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        employeeDropdownRef.current &&
        !employeeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEmployeeDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize credit values when columns change
  useEffect(() => {
    setCreditValues(Array(columns.length).fill(""));
  }, [columns.length]);

  useEffect(() => {
    if (entry && isOpen && mode === "edit") {
      // Convert entry data to form-friendly strings
      const entryDate =
        entry.datelog instanceof Date ? entry.datelog.toISOString().split("T")[0] : "";
      setFormData({
        datelog: entryDate,
        cashamount: entry.cashamount.toString(),
        location: entry.location ?? "",
        employeeName: entry.employeeName ?? "",
      });

      // Set credit values, ensuring we have enough slots for all columns
      const entryCredits = entry.credits ?? [];
      const newCreditValues = Array(columns.length)
        .fill("")
        .map((_, index) => entryCredits[index]?.toString() ?? "");
      setCreditValues(newCreditValues);
    } else if (isOpen && mode === "add") {
      // Set default values for new entry with current date
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        datelog: today,
        cashamount: "",
        location: "",
        employeeName: "",
      });
      setCreditValues(Array(columns.length).fill(""));
    }
  }, [entry, isOpen, mode, columns.length]);

  const handleInputChange = (field: string) => (ev: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ev.target.value,
    }));
  };

  // Removed handleSelectChange as it's no longer needed with dropdown implementation

  const handleCreditChange = (index: number) => (ev: ChangeEvent<HTMLInputElement>) => {
    setCreditValues((prev) => {
      const newValues = [...prev];
      newValues[index] = ev.target.value;
      return newValues;
    });
  };

  // Employee management functions
  const handleAddEmployee = () => {
    const trimmed = newEmployeeName.trim();
    if (trimmed && !employees.includes(trimmed)) {
      const updated = [...employees, trimmed];
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
      setFormData({
        ...formData,
        employeeName: trimmed,
      });
      setShowAddEmployee(false);
      setNewEmployeeName("");
    }
  };

  const handleDeleteEmployee = () => {
    if (formData.employeeName) {
      const updated = employees.filter((employee) => employee !== formData.employeeName);
      setEmployees(updated);
      localStorage.setItem("employees", JSON.stringify(updated));
      setFormData({
        ...formData,
        employeeName: "",
      });
    }
  };

  // Location management functions
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      setError("Location name cannot be empty");
      return;
    }

    setIsLocationSubmitting(true);
    setError(null);

    try {
      await onAddLocation?.(newLocationName.trim());
      setFormData({
        ...formData,
        location: newLocationName.trim(),
      });
      setNewLocationName("");
      setShowAddLocation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add location");
    } finally {
      setIsLocationSubmitting(false);
    }
  };

  const handleDeleteLocation = async (locationId: string, locationName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the location "${locationName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await onDeleteLocation?.(locationId);
      // Clear location if it was the selected one
      if (formData.location === locationName) {
        setFormData({
          ...formData,
          location: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete location");
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Check if editing is allowed for edit mode
    if (mode === "edit" && !isEditingAllowed) {
      setError("Editing is only allowed on the day of logging and the day after.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert form data to Row format
      const newEntry: Row = {
        datelog: mode === "add" ? Timestamp.now().toDate() : new Date(formData.datelog),
        cashamount: parseFloat(formData.cashamount) || 0,
        credits: creditValues.map((value) => parseFloat(value) ?? 0),
        location: formData.location || "Default",
        employeeName: formData.employeeName || "",
        daytotal: 0, // Will be calculated by the service
        runningamount: 0, // Will be calculated by the service
        monthlyaverage: 0, // Will be calculated by the service
      };

      // Call the parent's onSave function instead of calling service directly
      await onSave(newEntry);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle = mode === "add" ? "Add New Log Entry" : "Edit Log Entry";
  const submitButtonText = mode === "add" ? "Add Entry" : "Update Entry";

  return (
    <Modal
      title={modalTitle}
      handleClose={handleCancel}
      isLoading={isLoading}
      loadingText="Saving entry..."
    >
      <div className="space-y-3">
        {mode === "edit" && !isEditingAllowed && (
          <ModalField>
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Editing Restricted:</span> This entry can only be
                edited on the day of logging and the day after.
              </p>
            </div>
          </ModalField>
        )}

        <ModalField>
          <ModalInput
            type="number"
            icon={<CashIcon />}
            value={formData.cashamount}
            onChange={handleInputChange("cashamount")}
            placeholder="Enter cash amount"
            step={0.01}
            aria-label="Cash Amount"
            disabled={mode === "edit" && !isEditingAllowed}
          />
        </ModalField>

        {/* Employee Field */}
        <ModalField>
          <label
            style={{ color: "var(--color-muted)" }}
            className="mb-1 block text-sm font-semibold"
          >
            Employee Name
          </label>
          <div className="theme-text flex w-full flex-row items-center gap-2">
            {showAddEmployee ? (
              <div className="flex w-full flex-row items-center gap-2">
                <ModalInput
                  placeholder="New Name"
                  value={newEmployeeName}
                  onChange={(ev) => setNewEmployeeName(ev.target.value)}
                  disabled={isLoading}
                />
                <SideButton
                  color="btn-success"
                  label={<AddIcon sx={{ width: 20, height: 20 }} />}
                  onClick={handleAddEmployee}
                  disabled={
                    newEmployeeName.trim() === "" ||
                    employees.includes(newEmployeeName.trim()) ||
                    isLoading
                  }
                  title="Add employee"
                />
                <SideButton
                  color="gray-button gray-button-hover gray-ring"
                  label={<ClearIcon sx={{ width: 20, height: 20 }} />}
                  onClick={() => {
                    setShowAddEmployee(false);
                    setNewEmployeeName("");
                  }}
                  title="Cancel"
                />
              </div>
            ) : (
              <div
                className="relative flex flex-1 flex-row items-center justify-center gap-2"
                ref={employeeDropdownRef}
              >
                <div className="relative w-full">
                  <button
                    type="button"
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      borderColor: "var(--color-input-border)",
                      color: "var(--color-text)",
                    }}
                    className={cn(
                      "flex h-7 w-full items-center justify-between rounded-md border px-2 text-xs",
                      "placeholder-gray-500 transition-colors outline-none",
                      "hover:bg-hover focus:border-accent focus:ring-accent focus:ring-1",
                      (isLoading || (mode === "edit" && !isEditingAllowed)) &&
                        "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => {
                      if (!isLoading && !(mode === "edit" && !isEditingAllowed)) {
                        setShowEmployeeDropdown(!showEmployeeDropdown);
                      }
                    }}
                    onKeyDown={(ev) => {
                      if (
                        (ev.key === "Enter" || ev.key === " ") &&
                        !isLoading &&
                        !(mode === "edit" && !isEditingAllowed)
                      ) {
                        setShowEmployeeDropdown(!showEmployeeDropdown);
                      }
                    }}
                    disabled={isLoading || (mode === "edit" && !isEditingAllowed)}
                  >
                    {formData.employeeName || "Select employee"}
                    <span className="ml-2">
                      <ArrowDropDownIcon />
                    </span>
                  </button>
                  {showEmployeeDropdown && !isLoading && (
                    <div
                      style={{
                        backgroundColor: "var(--color-panel)",
                        borderColor: "var(--color-border)",
                      }}
                      className={cn(
                        "container-snap absolute z-50 mt-1 max-h-30 w-full",
                        "overflow-y-auto rounded border shadow-lg"
                      )}
                    >
                      {employees.length === 0 && (
                        <div style={{ color: "var(--color-muted)" }} className="px-3 py-2 text-xs">
                          No employees
                        </div>
                      )}
                      {employees.map((employee) => {
                        const isSelected = employee === formData.employeeName;
                        const employeeClass = cn(
                          "cursor-pointer px-3 py-2 text-xs transition-all",
                          isSelected && "font-bold"
                        );

                        return (
                          <div
                            key={employee}
                            style={{
                              backgroundColor: isSelected ? "var(--color-panel)" : "transparent",
                              color: "var(--color-text)",
                            }}
                            className={employeeClass}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = "var(--color-hover)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                employeeName: employee,
                              });
                              setShowEmployeeDropdown(false);
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === "Enter" || ev.key === " ") {
                                setFormData({
                                  ...formData,
                                  employeeName: employee,
                                });
                                setShowEmployeeDropdown(false);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            {employee}
                          </div>
                        );
                      })}
                      <div
                        style={{
                          color: "var(--color-accent)",
                        }}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-xs font-semibold transition-all"
                        )}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--color-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onClick={() => {
                          setShowAddEmployee(true);
                          setShowEmployeeDropdown(false);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            setShowAddEmployee(true);
                            setShowEmployeeDropdown(false);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        + Add New Employee
                      </div>
                    </div>
                  )}
                </div>
                {formData.employeeName && (
                  <SideButton
                    label={<DeleteIcon sx={{ width: 20, height: 20 }} />}
                    color="danger-button danger-button-hover danger-ring"
                    onClick={handleDeleteEmployee}
                    disabled={isLoading || (mode === "edit" && !isEditingAllowed)}
                    title={`Delete ${formData.employeeName}`}
                  />
                )}
              </div>
            )}
          </div>
        </ModalField>

        {/* Location Field */}
        <ModalField>
          <label
            style={{ color: "var(--color-muted)" }}
            className="mb-1 block text-sm font-semibold"
          >
            Location
          </label>
          <div className="theme-text flex w-full flex-row items-center gap-2">
            {showAddLocation ? (
              <div className="flex w-full flex-row items-center gap-2">
                <ModalInput
                  placeholder="New Location Name"
                  value={newLocationName}
                  onChange={(ev) => setNewLocationName(ev.target.value)}
                  disabled={isLocationSubmitting}
                />
                <SideButton
                  color="btn-success"
                  label={<AddIcon sx={{ width: 20, height: 20 }} />}
                  onClick={handleAddLocation}
                  disabled={newLocationName.trim() === "" || isLocationSubmitting}
                  title="Add location"
                />
                <SideButton
                  color="gray-button gray-button-hover gray-ring"
                  label={<ClearIcon sx={{ width: 20, height: 20 }} />}
                  onClick={() => {
                    setShowAddLocation(false);
                    setNewLocationName("");
                  }}
                  title="Cancel"
                />
              </div>
            ) : (
              <div
                className="relative flex flex-1 flex-row items-center justify-center gap-2"
                ref={locationDropdownRef}
              >
                <div className="relative w-full">
                  <button
                    type="button"
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      borderColor: "var(--color-input-border)",
                      color: "var(--color-text)",
                    }}
                    className={cn(
                      "flex h-7 w-full items-center justify-between rounded-md border px-2 text-xs",
                      "placeholder-gray-500 transition-colors outline-none",
                      "hover:bg-hover focus:border-accent focus:ring-accent focus:ring-1",
                      (isLoading || (mode === "edit" && !isEditingAllowed)) &&
                        "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => {
                      if (!isLoading && !(mode === "edit" && !isEditingAllowed)) {
                        setShowLocationDropdown(!showLocationDropdown);
                      }
                    }}
                    onKeyDown={(ev) => {
                      if (
                        (ev.key === "Enter" || ev.key === " ") &&
                        !isLoading &&
                        !(mode === "edit" && !isEditingAllowed)
                      ) {
                        setShowLocationDropdown(!showLocationDropdown);
                      }
                    }}
                    disabled={isLoading || (mode === "edit" && !isEditingAllowed)}
                  >
                    {formData.location || "Select a location"}
                    <span className="ml-2">
                      <ArrowDropDownIcon />
                    </span>
                  </button>
                  {showLocationDropdown && !isLoading && (
                    <div
                      style={{
                        backgroundColor: "var(--color-panel)",
                        borderColor: "var(--color-border)",
                      }}
                      className={cn(
                        "container-snap absolute z-50 mt-1 max-h-30 w-full",
                        "overflow-y-auto rounded border shadow-lg"
                      )}
                    >
                      {locations.length === 0 && (
                        <div style={{ color: "var(--color-muted)" }} className="px-3 py-2 text-xs">
                          No locations found
                        </div>
                      )}
                      {locations.map((location) => {
                        const isSelected = location.name === formData.location;
                        return (
                          <div
                            key={location.id}
                            style={{
                              backgroundColor: isSelected ? "var(--color-panel)" : "transparent",
                              color: "var(--color-text)",
                            }}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 text-xs transition-all",
                              isSelected && "font-bold"
                            )}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = "var(--color-hover)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  location: location.name,
                                });
                                setShowLocationDropdown(false);
                              }}
                              onKeyDown={(ev) => {
                                if (ev.key === "Enter" || ev.key === " ") {
                                  setFormData({
                                    ...formData,
                                    location: location.name,
                                  });
                                  setShowLocationDropdown(false);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              {location.displayName ?? location.name}
                            </div>
                            <SideButton
                              label={<DeleteIcon sx={{ width: 16, height: 16 }} />}
                              color="danger-button danger-button-hover danger-ring"
                              onClick={() =>
                                handleDeleteLocation(
                                  location.id,
                                  location.displayName ?? location.name
                                )
                              }
                              title="Delete location"
                            />
                          </div>
                        );
                      })}
                      <div
                        style={{
                          color: "var(--color-accent)",
                        }}
                        className={cn(
                          "cursor-pointer px-3 py-2 text-xs font-semibold transition-all"
                        )}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--color-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onClick={() => {
                          setShowAddLocation(true);
                          setShowLocationDropdown(false);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            setShowAddLocation(true);
                            setShowLocationDropdown(false);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        + Add New Location
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ModalField>

        {/* Credit Fields */}
        {columns.length > 0 && (
          <div className={`flex flex-row gap-4 ${columns.length <= 3 ? "flex-row" : "flex-col"}`}>
            {columns.map((column, index) => (
              <ModalField key={column.id}>
                <label
                  style={{ color: "var(--color-muted)" }}
                  className="mb-1 block text-sm font-semibold"
                >
                  {column.displayName ?? column.name}
                </label>
                <ModalInput
                  type="number"
                  value={creditValues[index] ?? ""}
                  onChange={handleCreditChange(index)}
                  placeholder="Enter credit amount"
                  step={0.01}
                  aria-label={column.displayName ?? column.name}
                  disabled={mode === "edit" && !isEditingAllowed}
                />
              </ModalField>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <ModalField error={error}>
            <div className="h-0" />
          </ModalField>
        )}

        {/* Action Buttons */}
        <ModalButtonGroup
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={submitButtonText}
          isSubmitting={isLoading}
          submitDisabled={mode === "edit" && !isEditingAllowed}
        />
      </div>
    </Modal>
  );
};

export default LogEntryModal;
