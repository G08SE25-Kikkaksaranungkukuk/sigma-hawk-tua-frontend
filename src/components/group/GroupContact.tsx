import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { brand } from "@/components/ui/utils";
import { UI_TEXT } from "@/config/ui-text";
import { APP_CONFIG } from "@/config/app-config";

interface GroupContactProps {
  onContactHost: () => void;
  isLoading?: boolean;
}

export function GroupContact({ onContactHost, isLoading = false }: GroupContactProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Collapsible Safety Tips */}
      <div className="rounded-2xl shadow-xl" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
          style={{ color: brand.fg }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: brand.sub }}>
            <Info className="h-4 w-4" />
            {UI_TEXT.sections.safetyTips}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expanded && (
          <div className="px-6 pb-6 text-sm" style={{ color: brand.sub }}>
            <ul className="list-disc pl-5 space-y-2">
              {UI_TEXT.safetyTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="rounded-2xl shadow-xl p-6" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" style={{ color: brand.accent }} />
          <h3 className="text-sm font-semibold" style={{ color: brand.sub }}>
            {UI_TEXT.sections.contact}
          </h3>
        </div>
        <p className="mt-2 text-sm" style={{ color: brand.sub }}>
          {UI_TEXT.messages.contactDescription}
        </p>
        <button
          onClick={onContactHost}
          disabled={isLoading}
          className="mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] border disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: APP_CONFIG.ui.colors.primary,
            color: APP_CONFIG.ui.colors.text,
            borderColor: brand.border,
            transform: isLoading ? 'none' : undefined
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = APP_CONFIG.ui.colors.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = APP_CONFIG.ui.colors.primary;
            }
          }}
        >
          {isLoading ? "Connecting..." : UI_TEXT.buttons.hostContact}
        </button>
      </div>
    </div>
  );
}
