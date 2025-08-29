interface MonthSelectorProps {
  selectedMonth: string;
  sortedMonths: [string, { monthName: string; entries: any[] }][];
  onMonthChange: (month: string) => void;
}

const MonthSelector = ({ selectedMonth, sortedMonths, onMonthChange }: MonthSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <select
        id="month-selector"
        value={selectedMonth}
        onChange={(ev) => onMonthChange(ev.target.value)}
        className="theme-input-bg theme-input-border header-text rounded-md border px-2 py-1 text-sm font-medium transition-all duration-200 hover:border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-400 focus:outline-none"
        aria-label="Select Month"
      >
        <option value="">Select Month</option>
        {sortedMonths.map(([monthKey, monthData]) => (
          <option key={monthKey} value={monthKey}>
            {monthData.monthName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
