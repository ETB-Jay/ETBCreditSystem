import { EditIcon } from "../../../components";
import { formatCellValue, canEditEntry } from "../../../utils";

import type { Row, Column } from "../../types";

interface LogTableRowProps {
  entry: Row;
  index: number;
  onEditEntry: (entry: Row) => void;
  columns: Column[];
}

const LogTableRow = ({ entry, index, onEditEntry, columns }: LogTableRowProps) => {
  const editingAllowed = canEditEntry(entry.datelog);

  return (
    <tr
      className={`group table-hover theme-muted transition-all duration-200 ${
        index % 2 === 0 ? "card-bg" : "table-row-alt"
      }`}
    >
      {/* Date */}
      <td className="theme-border border-r p-2 text-sm font-medium">
        <div className="truncate" title={formatCellValue("datelog", entry.datelog)}>
          {formatCellValue("datelog", entry.datelog)}
        </div>
      </td>

      {/* Cash Amount */}
      <td className="theme-border border-r p-2 text-right font-mono text-sm">
        <div className="truncate" title={formatCellValue("cashamount", entry.cashamount)}>
          {formatCellValue("cashamount", entry.cashamount)}
        </div>
      </td>

      {/* Location */}
      <td className="theme-border border-r p-2 text-sm">
        <div className="truncate" title={entry.location ?? "Default"}>
          {entry.location ?? "Default"}
        </div>
      </td>

      {/* Credit Amounts */}
      {columns.map((column, columnIndex) => (
        <td key={column.id} className="theme-border border-r p-2 text-right font-mono text-sm">
          <div
            className="truncate"
            title={formatCellValue("cashamount", entry.credits[columnIndex] || 0)}
          >
            {formatCellValue("cashamount", entry.credits[columnIndex] || 0)}
          </div>
        </td>
      ))}

      {/* Day Total */}
      <td className="theme-border border-r p-2 text-right font-mono text-sm">
        <div className="truncate" title={formatCellValue("cashamount", entry.daytotal)}>
          {formatCellValue("cashamount", entry.daytotal)}
        </div>
      </td>

      {/* Running Amount */}
      <td className="theme-border border-r p-2 text-right font-mono text-sm">
        <div className="truncate" title={formatCellValue("cashamount", entry.runningamount)}>
          {formatCellValue("cashamount", entry.runningamount)}
        </div>
      </td>

      {/* Monthly Average */}
      <td className="theme-border border-r p-2 text-right font-mono text-sm">
        <div className="truncate" title={formatCellValue("cashamount", entry.monthlyaverage)}>
          {formatCellValue("cashamount", entry.monthlyaverage)}
        </div>
      </td>

      {/* Actions */}
      <td className="p-2 text-center">
        <div className="flex items-center justify-center gap-2">
          {entry.employeeName && (
            <span className="text-xs text-gray-600 font-medium" title={`Employee: ${entry.employeeName}`}>
              {entry.employeeName}
            </span>
          )}
          <button
            type="button"
            onClick={() => onEditEntry(entry)}
            disabled={!editingAllowed}
            className={`rounded-md p-1 font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none ${
              editingAllowed
                ? "theme-accent hover:bg-hover hover:scale-110 focus:ring-rose-400"
                : "cursor-not-allowed text-gray-400 opacity-50"
            }`}
            title={
              editingAllowed ? "Edit Entry" : "Editing only allowed on day of logging and day after"
            }
            aria-label="Edit Entry"
          >
            <EditIcon sx={{ width: 16, height: 16 }} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LogTableRow;
