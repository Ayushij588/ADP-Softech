type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
} as const;

export function LoadingSpinner({
  label = "Loading",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <span
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-blue-700 border-r-transparent ${sizeClasses[size]}`}
      role="status"
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
