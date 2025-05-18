import { Spinner } from "./ui/spinner";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "Loading...",
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-row items-center align-middle justify-between gap-4">
        <Spinner size="small" />
        <h1>{message}</h1>
      </div>
    </div>
  );
};
