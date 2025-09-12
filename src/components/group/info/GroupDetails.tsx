import React from "react";
import { Info, CalendarDays, ShieldCheck, Sparkles } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { MemberPill } from "@/components/ui/member-pill";
import { brand } from "@/components/ui/utils";
import { UI_TEXT } from "@/config/group/ui-text";
import type { GroupInfo } from "@/components/schemas";

interface GroupDetailsProps {
  group: GroupInfo;
  onMemberClick?: (memberId: string) => void;
}

function Section({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide" style={{ color: brand.sub }}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

export function GroupDetails({ group, onMemberClick }: GroupDetailsProps) {
  return (
    <div className="p-6 md:p-8 grid gap-8">
      {/* About Section */}
      <div className="grid gap-3">
        <Section title={UI_TEXT.sections.about} icon={<Info className="h-4 w-4" />} />
        <p className="leading-relaxed text-sm md:text-[15px]" style={{ color: brand.fg }}>
          {group.description}
        </p>
        {group.hostNote && (
          <div className="mt-2 inline-flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" style={{ color: brand.accent }} />
            <span style={{ color: brand.sub }}>{group.hostNote}</span>
          </div>
        )}
      </div>

      {/* Itinerary Section */}
      <div className="grid gap-3">
        <Section title={UI_TEXT.sections.itinerary} icon={<CalendarDays className="h-4 w-4" />} />
        <div className="grid gap-2">
          {group.itinerary.map((item) => (
            <Pill key={item.day}>
              <div className="flex w-full items-center justify-between">
                <span className="font-medium" style={{ color: brand.fg }}>
                  {item.day}
                </span>
                <span className="text-xs" style={{ color: brand.sub }}>
                  {item.plan}
                </span>
              </div>
            </Pill>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="grid gap-3">
        <Section title={UI_TEXT.sections.requirements} icon={<ShieldCheck className="h-4 w-4" />} />
        <ul className="grid gap-2">
          {group.requirements.map((requirement, index) => (
            <li key={index} className="text-sm" style={{ color: brand.sub }}>
              • {requirement}
            </li>
          ))}
        </ul>
      </div>

      {/* Rules Section */}
      <div className="grid gap-3">
        <Section title={UI_TEXT.sections.rules} icon={<ShieldCheck className="h-4 w-4" />} />
        <ul className="grid gap-2">
          {group.rules.map((rule, index) => (
            <li key={index} className="text-sm" style={{ color: brand.sub }}>
              • {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Members Section */}
      <div className="flex flex-wrap gap-2">
        {group.members && group.members.length > 0 ? (
          group.members.map((member, index) => {
            // Check if this is the new Member interface (has user_id)
            if ('user_id' in member) {
              // New Member interface from GroupData
              const newMember = member as { user_id: number; first_name: string; last_name: string; email: string };
              const isLeader = group.group_leader_id === newMember.user_id;
              return (
                <MemberPill
                  key={newMember.user_id.toString()}
                  id={newMember.user_id.toString()}
                  name={`${newMember.first_name} ${newMember.last_name}`}
                  role={isLeader ? 'Host' : 'Member'}
                  onClick={onMemberClick || ((id) => console.log("Clicked member:", id))}
                />
              );
            } else {
              // Legacy member format (has id, name, role)
              const legacyMember = member as { id: string; name: string; role: string; avatar?: string };
              return (
                <MemberPill
                  key={legacyMember.id}
                  id={legacyMember.id}
                  name={legacyMember.name}
                  role={legacyMember.role}
                  onClick={onMemberClick || ((id) => console.log("Clicked member:", id))}
                />
              );
            }
          })
        ) : (
          <p className="text-sm text-gray-400">No members found</p>
        )}
      </div>
    </div>
  );
}
