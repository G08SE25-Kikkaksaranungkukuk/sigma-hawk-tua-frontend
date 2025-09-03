import React from "react";
import { brand } from "@/components/ui/utils";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]}`}
        style={{ borderColor: `${brand.accent} transparent ${brand.accent} ${brand.accent}` }}
      />
    </div>
  );
}

export function GroupPageSkeleton() {
  return (
    <div className="min-h-screen w-full flex justify-center p-6 md:p-10" style={{ background: brand.bg }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary card skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-xl overflow-hidden animate-pulse" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            {/* Header skeleton */}
            <div className="p-6 md:p-8 border-b" style={{ borderColor: brand.border }}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-24 rounded" style={{ backgroundColor: brand.border }} />
                  <div className="h-6 w-32 rounded" style={{ backgroundColor: brand.border }} />
                </div>
                <div className="h-8 w-3/4 rounded" style={{ backgroundColor: brand.border }} />
                <div className="flex gap-3">
                  <div className="h-4 w-32 rounded" style={{ backgroundColor: brand.border }} />
                  <div className="h-4 w-40 rounded" style={{ backgroundColor: brand.border }} />
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="p-6 md:p-8 space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-40 rounded" style={{ backgroundColor: brand.border }} />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded" style={{ backgroundColor: brand.border }} />
                    <div className="h-4 w-5/6 rounded" style={{ backgroundColor: brand.border }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar skeleton */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl shadow-xl animate-pulse" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            <div className="p-6 space-y-4">
              <div className="h-5 w-32 rounded" style={{ backgroundColor: brand.border }} />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 rounded" style={{ backgroundColor: brand.border }} />
                    <div className="h-4 w-16 rounded" style={{ backgroundColor: brand.border }} />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-12 w-full rounded-xl" style={{ backgroundColor: brand.border }} />
                <div className="h-10 w-full rounded-xl" style={{ backgroundColor: brand.border }} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "We couldn't load the group information. Please try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6" style={{ background: brand.bg }}>
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">😵</div>
        <h2 className="text-xl font-semibold" style={{ color: brand.fg }}>
          {title}
        </h2>
        <p className="text-sm" style={{ color: brand.sub }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 rounded-lg text-sm font-semibold transition hover:opacity-90"
            style={{ 
              backgroundColor: brand.accent, 
              color: brand.card 
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
