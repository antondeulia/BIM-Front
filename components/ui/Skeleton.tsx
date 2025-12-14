"use client";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className = "",
  width,
  height,
  variant = "rectangular",
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const baseClass = "skeleton";
  const variantClass = `skeleton-${variant}`;

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton variant="rectangular" height={180} className="skeleton-image" />
      <div className="skeleton-content">
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="skeleton-list-content">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
          </div>
        </div>
      ))}
    </>
  );
}

