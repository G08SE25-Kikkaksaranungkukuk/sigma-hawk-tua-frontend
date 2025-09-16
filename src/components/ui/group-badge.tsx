import * as React from "react";
import { brand } from "./utils";


export function Badge({ children, variant = "outline" }: { children: React.ReactNode; variant?: "solid" | "outline" }) {
  return (
    <span
      className={
        variant === "solid"
          ? `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium`
          : `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border`
      }
      style={{
        color: variant === "solid" ? brand.bg : brand.accent,
        background: variant === "solid" ? brand.accent : brand.card,
        borderColor: variant === "outline" ? brand.border : "transparent",
      }}
    >
      {children}
    </span>
  );
}