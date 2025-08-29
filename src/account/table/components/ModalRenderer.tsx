import EditModal from "../../modals/EditModal";
import LocationModal from "../../modals/LocationModal";
import LogEntryModal from "../../modals/LogEntryModal";
import ManageCreditModal from "../../modals/ManageCreditModal";
import TransactionModal from "../../modals/TransactionModal";

import type { Column, Row, Location } from "../../types";

interface ModalRendererProps {
  logDisplay: string;
  selectedLog: Row | null;
  onClose: () => void;
  onSaveEntry?: (updatedEntry: Partial<Row>) => Promise<void>;
  onSaveLogEntry?: (entry: Row) => Promise<void>;
  onAddColumn?: (columnName: string) => Promise<void>;
  onAddLocation?: (locationName: string) => Promise<void>;
  onDeleteLocation?: (locationId: string) => Promise<void>;
  columns?: Column[];
  locations?: Location[];
}

const ModalRenderer = ({
  logDisplay,
  selectedLog,
  onClose,
  onSaveEntry,
  onSaveLogEntry,
  onAddColumn,
  onAddLocation,
  onDeleteLocation,
  columns = [],
  locations = [],
}: ModalRendererProps) => {
  // Log Entry Modal (handles both add and edit)
  if (logDisplay === "add" || logDisplay === "edit") {
    return (
      <LogEntryModal
        isOpen={true}
        onClose={onClose}
        entry={selectedLog}
        mode={logDisplay === "add" ? "add" : "edit"}
        onSave={onSaveLogEntry ?? (() => Promise.resolve())}
        columns={columns}
        locations={locations}
        onAddLocation={onAddLocation}
        onDeleteLocation={onDeleteLocation}
      />
    );
  }

  // Edit Modal (single purpose - edit only)
  if (logDisplay === "edit-alt") {
    return (
      <EditModal
        isOpen={true}
        onClose={onClose}
        onSave={onSaveEntry ?? (() => Promise.resolve())}
        entry={selectedLog}
      />
    );
  }

  // Transaction Modal (single purpose - add only)
  if (logDisplay === "transaction") {
    return <TransactionModal isOpen={true} onClose={onClose} columns={columns} />;
  }

  // Manage Credit Modal (single purpose - manage columns)
  if (logDisplay === "manage") {
    return (
      <ManageCreditModal
        isOpen={true}
        onClose={onClose}
        onAddColumn={onAddColumn ?? (() => Promise.resolve())}
        columns={columns}
      />
    );
  }

  // Manage Locations Modal (single purpose - manage locations)
  // Note: Location management is now integrated into LogEntryModal
  if (logDisplay === "locations") {
    return null; // No longer needed as location management is in LogEntryModal
  }

  // No modal to render
  return null;
};

export default ModalRenderer;
