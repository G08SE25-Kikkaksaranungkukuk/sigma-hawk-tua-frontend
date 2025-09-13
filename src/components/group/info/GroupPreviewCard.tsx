import React, { useState, useEffect } from "react";
import { CreateGroupRequest, Interest } from "@/lib/types";
import { Calendar, Users, MapPin } from "lucide-react";
import { groupService } from "@/lib/services/group/group-service";
import { InterestsPill } from "@/components/ui/interests-pill";

interface GroupPreviewCardProps {
  groupData: CreateGroupRequest;
}

export function GroupPreviewCard({
  groupData,
}: GroupPreviewCardProps) {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await groupService.getInterests();
        
        // Normalize the response - handle both array and object formats
        let interests: Interest[] = [];
        if (Array.isArray(response)) {
          interests = response;
        } else if (response && typeof response === 'object' && Array.isArray((response as any).interests)) {
          interests = (response as any).interests;
        }
        
        setAvailableInterests(interests);
      } catch (error) {
        console.error('Failed to fetch interests:', error);
        setAvailableInterests([]);
      }
    };

    fetchInterests();
  }, []);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayTitle =
    groupData.group_name || "Your group name here";
  const displayDestination =
    groupData.destination || "Destination";
  const startFormatted = formatDate(groupData.start_date);
  const endFormatted = formatDate(groupData.end_date);
  const dateRange =
    startFormatted && endFormatted
      ? `${startFormatted} → ${endFormatted}`
      : "Select dates";

  // Get selected Interest objects for proper display
  const selectedInterests = Array.isArray(availableInterests) && groupData.interest_fields
    ? availableInterests.filter(interest => groupData.interest_fields!.includes(interest.key))
    : [];

  return (
    <div className="bg-[#12131a] rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={groupData.image_url || 'https://images.unsplash.com/photo-1710608646861-cb7f10c8bc4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHRyb3BpY2FsJTIwYmVhY2h8ZW58MXx8fHwxNzU3NzM5NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'}
          alt="Group cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#ff6600] text-white px-3 py-1 rounded-full text-sm">
            TravelMatch
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h2 className="text-2xl text-[#e8eaee] truncate">
          {displayTitle}
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 text-[#9aa3b2]">
          <MapPin className="w-4 h-4" />
          <span>{displayDestination}</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-[#9aa3b2]">
          <Calendar className="w-4 h-4" />
          <span>{dateRange}</span>
        </div>

        {/* Interests */}
        {selectedInterests.length > 0 && (
          <div className="space-y-2">
            <InterestsPill interests={selectedInterests} />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#ff6600]/30 to-transparent"></div>

        {/* Max Members */}
        <div className="flex items-center gap-2 text-[#9aa3b2]">
          <Users className="w-4 h-4" />
          <span>Up to {groupData.max_members} members</span>
        </div>
      </div>
    </div>
  );
}