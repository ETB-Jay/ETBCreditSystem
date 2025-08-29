interface LogTableErrorStateProps {
  error: string;
  onRetry: () => void;
}

const LogTableErrorState = ({ error, onRetry }: LogTableErrorStateProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-2xl text-red-500">Error loading data</div>
        <div className="theme-muted text-sm">{error}</div>
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default LogTableErrorState;
