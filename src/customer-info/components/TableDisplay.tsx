import { useEffect, useState, useMemo, ReactElement, KeyboardEvent } from "react";

import { ArrowDropDownIcon, ArrowDropUpIcon, FilterListIcon, LockIcon } from "../../components";
import Amount from "./filters/Amount";
import DateFilter from "./filters/DateFilter";
import EmployeeName from "./filters/EmployeeName";
import { useCustomer, useCustomerNames, useDisplay, useFilters } from "../../context/Context";
import { cn } from "../../modals/scripts";
import { Customer, Transaction } from "../../types";

/** Displays a table containing the transactions made by the individual customer. */
const TableDisplay = (): ReactElement => {
  const { customer } = useCustomer();
  const { customers } = useCustomerNames();
  const { display, setDisplay } = useDisplay();
  const { filters } = useFilters();
  const [filteredRows, setFilteredRows] = useState<Transaction[]>([]);

  useEffect(() => {
    if (display !== "default") {
      setDisplay("default");
    }
  }, [customer?.customerID, customer?.transactions.length]);

  const applyFilters = useMemo(
    () => (rows: Transaction[]) => {
      return rows.filter((row: Transaction) => {
        if (filters.date.startDate || filters.date.endDate) {
          const rowDate = new Date((row.date as { seconds: number }).seconds * 1000);
          if (filters.date.startDate) {
            const startDate = new Date(filters.date.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (rowDate < startDate) {
              return false;
            }
          }
          if (filters.date.endDate) {
            const endDate = new Date(filters.date.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (rowDate > endDate) {
              return false;
            }
          }
        }
        if (filters.amount.minAmount || filters.amount.maxAmount) {
          const amount = row.changeBalance;
          if (filters.amount.minAmount && amount < parseFloat(filters.amount.minAmount)) {
            return false;
          }
          if (filters.amount.maxAmount && amount > parseFloat(filters.amount.maxAmount)) {
            return false;
          }
        }
        if (filters.employee.searchTerm) {
          const searchTerm = filters.employee.searchTerm.toLowerCase();
          if (!row.employeeName.toLowerCase().includes(searchTerm)) {
            return false;
          }
        }
        return true;
      });
    },
    [filters]
  );

  useEffect(() => {
    const currentCustomer = customers.find(
      (cus: Customer) => cus.customerID === customer?.customerID
    );
    const transactions: Transaction[] = currentCustomer?.transactions || [];
    const filtered = applyFilters(transactions);
    filtered.sort(
      (tA: Transaction, tB: Transaction) =>
        (tB.date as { seconds: number }).seconds - (tA.date as { seconds: number }).seconds
    );
    setFilteredRows(filtered);
  }, [customers, filters, customer?.customerID, applyFilters]);

  const hasActiveFilters = () => {
    return (
      filters.date.startDate ||
      filters.date.endDate ||
      filters.amount.minAmount ||
      filters.amount.maxAmount ||
      filters.employee.searchTerm
    );
  };

  const noTransaction = "NO TRANSACTIONS YET";
  const notes = "Notes";

  interface HeaderFieldProps {
    label: "Date" | "Amount" | "Employee";
  }
  const HeaderField = ({ label }: HeaderFieldProps) => {
    const filterIconClass = display === `${label}Filter` ? "filter-active" : "filter-inactive";

    return (
      <th
        className={cn(
          "group theme-panel relative cursor-pointer px-3 py-1 text-sm font-semibold",
          "theme-text hover:bg-hover whitespace-nowrap transition-all duration-200"
        )}
      >
        <div
          className="flex items-center gap-1"
          onClick={() => setDisplay(display === `${label}Filter` ? "default" : `${label}Filter`)}
          onKeyDown={(ev: KeyboardEvent<HTMLDivElement>) => {
            if (ev.key === "Enter") {
              setDisplay(display === `${label}Filter` ? "default" : `${label}Filter`);
            }
          }}
        >
          {label}
          <FilterListIcon className={filterIconClass} />
        </div>
      </th>
    );
  };

  if (filteredRows.length === 0 && !hasActiveFilters()) {
    return (
      <div className="theme-text flex items-center justify-center">
        <img
          className="mx-auto max-h-2/5 w-auto object-contain brightness-30 select-none"
          src="./ETBBanner.png"
          alt=""
        />
        <p className="overlay absolute rounded-xl p-5 text-2xl font-bold select-none">
          {noTransaction}
        </p>
      </div>
    );
  }

  const parsedDate = (row: { date: Date | { seconds: number } }) => {
    let seconds: number | null = null;

    if (row.date instanceof Date) {
      seconds = Math.floor(row.date.getTime() / 1000);
    } else if ("seconds" in row.date) {
      seconds = row.date.seconds;
    }

    if (seconds === null) {
      return "Invalid date";
    }

    return new Date(seconds * 1000).toLocaleString().replace("T", " ").slice(0, 19);
  };

  const BalanceIcon = (row: Transaction) =>
    row.changeBalance < 0 ? (
      <ArrowDropDownIcon className="icon-danger" sx={{ width: 14, height: 14 }} />
    ) : (
      <ArrowDropUpIcon className="icon-success" sx={{ width: 14, height: 14 }} />
    );

  return (
    <div
      className={cn(
        "container-snap overflow-y-scroll rounded-xl border",
        "theme-border theme-bg shadow-lg"
      )}
    >
      <div className="absolute">
        {display === "DateFilter" && (
          <div className="z-50 select-none">
            <DateFilter />
          </div>
        )}
        {display === "AmountFilter" && (
          <div className="z-50 select-none">
            <Amount />
          </div>
        )}
        {display === "EmployeeFilter" && (
          <div className="z-50 select-none">
            <EmployeeName />
          </div>
        )}
      </div>
      <table className="lg:text-md theme-text w-full text-xs select-none md:text-sm">
        <thead className="sticky top-0">
          <tr className="text-left">
            <HeaderField label="Date" />
            <HeaderField label="Amount" />
            <HeaderField label="Employee" />
            <th
              className={cn(
                "theme-panel w-full max-w-[400px] px-3 py-1 text-sm",
                "hover:bg-hover font-semibold transition-all duration-200"
              )}
            >
              <div className="flex items-center gap-1">
                {notes}
                <LockIcon className="icon-muted" sx={{ width: 14, height: 14 }} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {filteredRows.map((row) => (
            <tr
              key={row.date.toString()}
              className="hover:bg-hover/50 transition-colors duration-150 ease-in-out"
            >
              <td
                className={cn(
                  "no-scroll container-snap max-w-[200px] overflow-x-scroll",
                  "theme-text px-3 py-0.5 text-sm whitespace-nowrap"
                )}
              >
                {parsedDate(row)}
              </td>
              <td
                className={cn(
                  "no-scroll container-snap inline-flex max-w-[120px] flex-row items-center gap-2 overflow-x-scroll",
                  "theme-text px-3 py-0.5 text-sm whitespace-nowrap"
                )}
                title={String(row.changeBalance)}
              >
                {BalanceIcon(row)}
                {Number(Math.abs(row.changeBalance)).toFixed(2)}
              </td>
              <td
                className={cn(
                  "no-scroll container-snap max-w-[120px] overflow-x-scroll",
                  "theme-text px-3 py-0.5 text-sm whitespace-nowrap"
                )}
                title={row.employeeName}
              >
                {row.employeeName}
              </td>
              <td className="px-3 py-1">
                <div className="theme-muted w-full text-sm" title={row.notes}>
                  {row.notes}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDisplay;
