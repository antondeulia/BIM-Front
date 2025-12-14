"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`}>
      <div className="spinner-ring"></div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <LoadingSpinner size="lg" />
      <p>Loading...</p>
    </div>
  );
}

