interface LogTableLoadingStateProps {
  message?: string;
}

const LogTableLoadingState = ({ message = "Fetching data..." }: LogTableLoadingStateProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-2xl">Loading...</div>
        <div className="theme-muted text-sm">{message}</div>
      </div>
    </div>
  );
};

export default LogTableLoadingState;
