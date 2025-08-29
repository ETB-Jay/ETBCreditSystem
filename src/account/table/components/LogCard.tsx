import React, { useCallback } from "react";

import { EditIcon } from "../../../components";
import { formatCellValue, canEditEntry } from "../../../utils";

import type { Row } from "../../../types";

const LogCard = ({ entry, onEdit }: { entry: Row; onEdit?: (entry: Row) => void }) => {
  const editingAllowed = canEditEntry(entry.datelog);
  const handleEdit = useCallback(() => onEdit?.(entry), [onEdit, entry]);
  const SimpleMetricCard = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value: string;
    className?: string;
  }) => (
    <div
      className={`card-border card-bg w-full rounded-md p-1 text-center text-sm shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      <span className="theme-muted block font-semibold">{label}</span>
      <span className="theme-text font-medium">{value}</span>
    </div>
  );

  return (
    <div className="card-border card-bg space-y-1 p-3 shadow-md transition-all duration-200 hover:shadow-lg">
      {/* Compact Header with Date and Actions */}
      <div className="mb-2 flex w-full flex-row items-center justify-between">
        <span className="theme-text text-base leading-none font-bold">
          {formatCellValue("datelog", entry.datelog)}
        </span>
        <div className="flex items-center gap-2">
          {entry.employeeName && (
            <span
              className="text-xs font-medium text-gray-600"
              title={`Employee: ${entry.employeeName}`}
            >
              {entry.employeeName}
            </span>
          )}
          <button
            onClick={handleEdit}
            disabled={!editingAllowed}
            className={`cursor-pointer rounded-md p-1 leading-none transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none ${
              editingAllowed
                ? "theme-accent hover:bg-hover"
                : "cursor-not-allowed text-gray-400 opacity-50"
            }`}
            title={
              editingAllowed ? "Edit Entry" : "Editing only allowed on day of logging and day after"
            }
            type="button"
            aria-label="Edit Entry"
          >
            <EditIcon sx={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <SimpleMetricCard
          className="col-span-2"
          label="Cash Amount"
          value={formatCellValue("cashamount", entry.cashamount)}
        />
        <div className="flex flex-row gap-1">
          {entry.credits.map((credit, index) => (
            <SimpleMetricCard
              key={`credit-${index + 1}-${credit}`}
              label={`Credit ${index + 1}`}
              value={formatCellValue("cashamount", credit)}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          <SimpleMetricCard
            label="Day Total"
            value={formatCellValue("cashamount", entry.daytotal)}
          />
          <SimpleMetricCard
            label="Running Amount"
            value={formatCellValue("cashamount", entry.runningamount)}
          />
          <SimpleMetricCard
            label="Monthly Average"
            value={formatCellValue("cashamount", entry.monthlyaverage)}
          />
        </div>
      </div>
    </div>
  );
};

export default LogCard;
