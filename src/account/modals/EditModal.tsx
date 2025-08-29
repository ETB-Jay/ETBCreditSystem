import { useState, useEffect } from "react";

import {
  Modal,
  ModalField,
  ModalInput,
  ModalButtonGroup,
  EditIcon,
  CashIcon,
  AddCardIcon,
} from "../../components";
import { canEditEntry } from "../../utils";

import type { Row } from "../../types";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: Partial<Row>) => Promise<void>;
  entry: Row | null;
}

const EditModal = ({ isOpen, onClose, onSave, entry }: EditModalProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the entry can be edited based on its date
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const isEditingAllowed = (() => {
    if (!entry) return false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      return canEditEntry(entry.datelog);
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (entry && isOpen) {
      // Convert entry data to form-friendly strings
      const initialData: Record<string, string> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (key === "datelog") {
          initialData[key] = value instanceof Date ? value.toISOString().split("T")[0] : "";
        } else {
          initialData[key] = value?.toString() ?? "";
        }
      });
      setFormData(initialData);
    }
  }, [entry, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!entry || isLoading) return;

    // Check if editing is allowed
    if (!isEditingAllowed) {
      setError("Editing is only allowed on the day of logging and the day after.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert form data back to proper types
      const updatedEntry: Partial<Row> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "datelog") {
          updatedEntry[key] = new Date(value);
        } else if (key !== "datelog") {
          updatedEntry[key] = parseFloat(value) || 0;
        }
      });

      await onSave(updatedEntry);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !entry) return null;

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "datelog":
        return <EditIcon />;
      case "cashamount":
        return <CashIcon />;
      case "credits":
        return <AddCardIcon />;
      default:
        return <EditIcon />;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case "datelog":
        return "Date";
      case "cashamount":
        return "Cash Amount";
      case "daytotal":
        return "Day Total";
      case "runningamount":
        return "Running Amount";
      case "monthlyaverage":
        return "Monthly Average";
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  };

  const getFieldType = (field: string) => {
    return field === "datelog" ? "date" : "number";
  };

  const getFieldStep = (field: string) => {
    return field === "datelog" ? undefined : 0.01;
  };

  // Handle credits separately
  const fields = Object.keys(entry).filter((field) => field !== "credits");

  const submitLabel = isLoading ? "Saving..." : "Save Changes";

  return (
    <Modal title="Edit Entry" handleClose={handleCancel} isLoading={isLoading}>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        {!isEditingAllowed && (
          <ModalField>
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Editing Restricted:</span> This entry can only be
                edited on the day of logging and the day after.
              </p>
            </div>
          </ModalField>
        )}

        {fields.map((field) => (
          <ModalField key={field}>
            <ModalInput
              icon={getFieldIcon(field)}
              type={getFieldType(field)}
              value={formData[field] || ""}
              onChange={(ev) => handleInputChange(field, ev.target.value)}
              placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
              step={getFieldStep(field)}
              disabled={isLoading || !isEditingAllowed}
            />
          </ModalField>
        ))}

        {error && (
          <ModalField error={error}>
            <div className="h-0" />
          </ModalField>
        )}

        <ModalButtonGroup
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={submitLabel}
          submitDisabled={isLoading || !isEditingAllowed}
          isSubmitting={isLoading}
        />
      </form>
    </Modal>
  );
};

export default EditModal;
