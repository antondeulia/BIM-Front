"use client";

import { LoadingSpinner } from "./ui/LoadingSpinner";

interface RedirectLoaderProps {
  message?: string;
}

export default function RedirectLoader({ message = "Loading..." }: RedirectLoaderProps) {
  return (
    <div className="redirect-loader">
      <div className="redirect-loader-content">
        <LoadingSpinner size="lg" />
        <p>{message}</p>
      </div>
    </div>
  );
}





