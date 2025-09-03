import React from "react";
import { Users, Share2 } from "lucide-react";
import { brand } from "@/components/ui/utils";
import { UI_TEXT } from "@/config/group/ui-text";
import { APP_CONFIG } from "@/config/group/app-config";
import type { GroupInfo } from "@/components/schemas";

interface GroupSidebarProps {
  group: GroupInfo;
  isRequested: boolean;
  isLoading: boolean;
  onRequestToJoin: () => void;
  onShare: () => void;
  onContactHost: () => void;
}

function StatRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-[13px]" style={{ color: brand.sub }}>
        {left}
      </span>
      <span className="font-medium" style={{ color: brand.fg }}>
        {right}
      </span>
    </div>
  );
}

export function GroupSidebar({ 
  group, 
  isRequested, 
  isLoading, 
  onRequestToJoin, 
  onShare, 
  onContactHost 
}: GroupSidebarProps) {
  const available = Math.max(group.maxSize - group.currentSize, 0);

  return (
    <div className="rounded-2xl shadow-xl" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" style={{ color: brand.accent }} />
          <h3 className="text-sm font-semibold" style={{ color: brand.sub }}>
            {UI_TEXT.sections.groupStatus}
          </h3>
        </div>

        <div className="mt-3 grid gap-2">
          <StatRow 
            left={<span>{UI_TEXT.labels.members}</span>} 
            right={<span>{group.currentSize} / {group.maxSize}</span>} 
          />
          <StatRow 
            left={<span>{UI_TEXT.labels.spotsLeft}</span>} 
            right={<span>{available}</span>} 
          />
          <StatRow 
            left={<span>{UI_TEXT.labels.pace}</span>} 
            right={<span>{group.pace}</span>} 
          />
          <StatRow 
            left={<span>{UI_TEXT.labels.languages}</span>} 
            right={<span>{group.languages.join(", ")}</span>} 
          />
        </div>

        <div className="mt-5 grid gap-3">
          <button
            onClick={onRequestToJoin}
            disabled={isLoading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: APP_CONFIG.ui.colors.primary,
              color: APP_CONFIG.ui.colors.text,
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
            {isLoading ? "Processing..." : isRequested ? UI_TEXT.buttons.requestSent : UI_TEXT.buttons.requestToJoin}
          </button>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              className="rounded-xl px-4 py-2 text-sm font-semibold transition border"
              style={{ 
                backgroundColor: APP_CONFIG.ui.colors.secondary,
                color: APP_CONFIG.ui.colors.textSecondary,
                borderColor: brand.border 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = APP_CONFIG.ui.colors.secondaryHover;
                e.currentTarget.style.color = APP_CONFIG.ui.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = APP_CONFIG.ui.colors.secondary;
                e.currentTarget.style.color = APP_CONFIG.ui.colors.textSecondary;
              }}
              onClick={onShare}
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <Share2 className="h-4 w-4" /> {UI_TEXT.buttons.share}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
