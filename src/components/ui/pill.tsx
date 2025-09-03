import * as React from "react";


export function Pill({
  children,
  onClick,
  isSelected,
  color,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${
        isSelected
          ? `${color} shadow-md scale-105 orange-glow`
          : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500"
      }`}
    >
      {children}
    </button>
  );
}
