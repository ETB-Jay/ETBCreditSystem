import { useState, useEffect } from "react";

import { Modal, ModalField, ModalButtonGroup, AddIcon } from "../../components";

import type { Column } from "../../types";

interface ManageCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (columnName: string) => Promise<void>;
  columns: Column[];
}

const ManageCreditModal = ({ isOpen, onClose, onAddColumn, columns }: ManageCreditModalProps) => {
  const noColumnsText = "No credit columns found";
  const addFirstColumnText =
    "Credit columns are automatically created when you add log entries with credit amounts";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingColumns, setPendingColumns] = useState<Column[]>(columns);

  // Reset pending columns when modal opens or columns change
  useEffect(() => {
    setPendingColumns(columns);
  }, [columns, isOpen]);

  const handleAddColumn = () => {
    const nextColumnNumber = pendingColumns.length + 1;
    const newColumn: Column = {
      id: `col_${nextColumnNumber - 1}`,
      name: `c${nextColumnNumber}`,
      displayName: `Credit ${nextColumnNumber}`,
    };

    setPendingColumns([...pendingColumns, newColumn]);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Calculate the difference in columns
      const addedColumns = pendingColumns.filter(
        (col) => !columns.some((existingCol) => existingCol.id === col.id)
      );

      if (addedColumns.length > 0) {
        // Add only the first new column to Firebase (one at a time)
        await onAddColumn(addedColumns[0].name);
      }

      // Reset pending state and close modal on success
      setPendingColumns(columns);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add column");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setPendingColumns(columns); // Reset to original state
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal title="Manage Credit Columns" handleClose={handleCancel} isLoading={isLoading}>
      <div className="theme-text flex w-full flex-col gap-4">
        <div className="space-y-2">
          {(() => {
            const hasColumns = pendingColumns.length > 0;
            if (!hasColumns) {
              return (
                <div className="py-8 text-center text-gray-500">
                  <p>{noColumnsText}</p>
                  <p className="text-sm">{addFirstColumnText}</p>
                </div>
              );
            }
            return (
              <div className="container-snap max-h-30 overflow-y-auto rounded-l-md border-2 border-rose-900 text-xs">
                {pendingColumns.map((column) => {
                  const isNewColumn = !columns.some((existingCol) => existingCol.id === column.id);
                  return (
                    <div
                      key={column.id}
                      className={`flex items-center justify-between border-b border-rose-900 px-3 py-0.5 last:border-b-0 ${
                        isNewColumn ? "bg-green-400/20" : "bg-rose-400/20"
                      }`}
                    >
                      <span className="inline-flex w-full items-center justify-between font-semibold">
                        {column.name}
                        {isNewColumn && <span className="text-xs text-green-600">new</span>}
                      </span>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleAddColumn}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      void handleAddColumn();
                    }
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 border-b border-rose-900 bg-rose-400/20 px-3 py-1 font-semibold transition-colors last:border-b-0 hover:bg-rose-200"
                >
                  <AddIcon sx={{ width: 12, height: 12 }} />
                  Add Credit Column
                </button>
              </div>
            );
          })()}
        </div>

        {error && (
          <ModalField error={error}>
            <div className="h-0" />
          </ModalField>
        )}

        <ModalButtonGroup
          onSubmit={handleConfirm}
          onCancel={handleCancel}
          submitDisabled={isLoading}
          isSubmitting={isLoading}
        />
      </div>
    </Modal>
  );
};

export default ManageCreditModal;
