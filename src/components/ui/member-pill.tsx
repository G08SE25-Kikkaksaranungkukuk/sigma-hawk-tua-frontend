import * as React from "react";
import { brand } from "./utils";

export function MemberPill({
  id,
  name,
  role,
  onClick,
}: {
  id: string;
  name: string;
  role: string;
  onClick?: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onClick?.(id)}
      className="flex items-center gap-2 rounded-full px-3 py-2 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: "#151623",
        border: `1px solid ${brand.border}`,
      }}
    >
      <div
        className="grid h-7 w-7 place-items-center rounded-full font-semibold"
        style={{ background: brand.accent, color: brand.bg }}
      >
        {name.slice(0, 1)}
      </div>
      <div className="text-left">
        <div className="text-sm font-medium" style={{ color: brand.fg }}>
          {name}
        </div>
        <div className="text-[11px]" style={{ color: brand.sub }}>
          {role}
        </div>
      </div>
    </button>
  );
}
