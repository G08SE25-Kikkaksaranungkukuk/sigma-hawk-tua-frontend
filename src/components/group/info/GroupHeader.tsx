import React from "react";
import { CalendarDays, MapPin, Clock3, Lock, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/group-badge";
import { Pill } from "@/components/ui/pill";
import { brand } from "@/components/ui/utils";
import type { GroupInfo } from "@/components/schemas";

interface GroupHeaderProps {
  group: GroupInfo;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="p-6 md:p-8 border-b" style={{ borderColor: brand.border }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="solid">TravelMatch</Badge>
            {group.privacy === "Private" ? (
              <Badge>
                <Lock className="mr-1 h-3 w-3" /> Private Group
              </Badge>
            ) : (
              <Badge>
                <Globe2 className="mr-1 h-3 w-3" /> Public Group
              </Badge>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold" style={{ color: brand.fg }}>
            {group.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm" style={{ color: brand.sub }}>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {group.destination}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {group.dates}
            </span>
            {group.timezone && (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" /> {group.timezone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-5 flex flex-wrap gap-2">
        {group.interests.map((interest) => (
          <Pill key={interest}>{interest}</Pill>
        ))}
      </div>
    </div>
  );
}
