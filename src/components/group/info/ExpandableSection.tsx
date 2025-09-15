import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableSection({ title, children, defaultExpanded = false }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-[rgba(255,102,0,0.25)] last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-[rgba(255,102,0,0.05)] transition-colors"
      >
        <h3 className="text-white">{title}</h3>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-[#ff6600]" />
        ) : (
          <ChevronRight className="w-5 h-5 text-[#ff6600]" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-4 text-gray-300 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}