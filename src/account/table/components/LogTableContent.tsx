import LogCard from "./LogCard";
import LogTableRow from "./LogTableRow";
import LogTableEmptyState from "./LogTableEmptyState";

import type { Row, Column } from "../../types";
import type { ReactElement } from "react";

interface LogTableContentProps {
  currentMonthData: { monthName: string; entries: Row[] };
  onEditEntry: (entry: Row) => void;
  columns: Column[];
}

const LogTableContent = ({
  currentMonthData,
  onEditEntry,
  columns,
}: LogTableContentProps): ReactElement => {
  const hasEntries = currentMonthData.entries.length > 0;

  const mobileContent = hasEntries ? (
    currentMonthData.entries
      .sort((a, b) => b.datelog.getTime() - a.datelog.getTime())
      .map((entry, index) => (
        <LogCard
          key={`mobile-${entry.datelog.getTime()}-${index + 1}`}
          entry={entry}
          onEdit={onEditEntry}
        />
      ))
  ) : (
    <LogTableEmptyState monthName={currentMonthData.monthName} />
  );

  const tableContent = hasEntries ? (
    currentMonthData.entries
      .sort((a, b) => b.datelog.getTime() - a.datelog.getTime())
      .map((entry, index) => (
        <LogTableRow
          key={`table-${entry.datelog.getTime()}-${index + 1}`}
          entry={entry}
          index={index}
          onEditEntry={onEditEntry}
          columns={columns}
        />
      ))
  ) : (
    <td colSpan={9} className="p-4 text-center">
      <LogTableEmptyState monthName={currentMonthData.monthName} />
    </td>
  );

  return (
    <main className="flex-1 overflow-hidden">
      {/* Mobile Card View */}
      <div className="container-snap block h-full overflow-auto lg:hidden">{mobileContent}</div>

      {/* Desktop Table View */}
      <div className="container-snap hidden h-full overflow-auto lg:block">
        <table
          className="w-full border-collapse"
          role="table"
          aria-label="Account log entries table"
        >
          <thead className="theme-panel sticky top-0 shadow-md">
            <tr>
              {[
                "Date",
                "Cash",
                "Location",
                ...columns.map((col) => col.displayName ?? col.name),
                "Day Total",
                "Running Amount",
                "Monthly Average",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="theme-border header-text border-b-2 p-2 text-left text-xs font-semibold shadow-sm"
                  aria-label={header}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate" title={header}>
                      {header}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="theme-border card-bg divide-y">{tableContent}</tbody>
        </table>
      </div>
    </main>
  );
};

export default LogTableContent;
