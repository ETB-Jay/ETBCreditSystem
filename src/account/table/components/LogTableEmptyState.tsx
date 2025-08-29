import type { ReactElement } from "react";

const LogTableEmptyState = (): ReactElement => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-6xl">📊</div>
      <h3 className="mb-2 text-lg font-semibold">No Data Available</h3>
    </div>
  );
};

export default LogTableEmptyState;
