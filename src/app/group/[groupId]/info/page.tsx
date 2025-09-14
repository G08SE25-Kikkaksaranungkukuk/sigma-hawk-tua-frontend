'use client';

import { GroupHero } from "@/components/group/info/GroupHero";
import { GroupInfoCard } from "@/components/group/info/GroupInfoCard";
import { GroupStatsCard } from "@/components/group/info/GroupStatsCard";
import { GroupMembersCard } from "@/components/group/info/GroupMemberCard";
import { GroupPageSkeleton, ErrorState } from "@/components/group/info/LoadingStates";
import { Interest, GroupData, Member } from "@/lib/types/home/group";
import { UserData } from "@/lib/types/user";

import React, { useState } from "react";
import { groupService } from '@/lib/services/group/group-service';

export default function GroupInfoPage({ params }: { params: Promise<{ groupId?: string }> }) {
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { groupId } = React.use(params);
    const [userInfo,setUserInfo] = React.useState<UserData>();
    const [groupInfo , setGroupInfo] = React.useState<GroupData>();

  // Mock data for the group
  const refetch = React.useCallback(() => {
    if (!groupId) {
      setError("Invalid group ID");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    Promise.all([
      groupService.getGroupProfile(groupId),
      groupService.getCurrentUser(),
      groupService.getGroupDetails(groupId),
    ])
      .then(([profileRes, userRes, groupRes]) => {
        setUserInfo(userRes);
        setGroupInfo(groupRes);
        console.log("groupInfo (refetch):", groupRes);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch group information");
        console.error(err);
        setLoading(false);
      });
  }, [groupId]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return <GroupPageSkeleton />;
  }
  
  if (error) {
    return <ErrorState title="Failed to load group" onRetry={refetch} />;
  }
  
  if (!groupInfo || !userInfo) {
    return <ErrorState title="Group not found" onRetry={refetch} />;
  }


  const groupData = {
    title: groupInfo.group_name,
    destination: "Bangkok & Chiang Mai, Thailand",
    dateRange: "Nov 15-20, 2024",
    timezone: "GMT+7 (ICT)",
    location: "Thailand",
    interests: groupInfo.interests as Interest[],
    groupType: "Public Group",
    isPublic: true
  };

  const sidebarData = {
    userRole: (userInfo && groupInfo) ? (userInfo.user_id === groupInfo.group_leader_id ? 'host' as const : groupInfo.members.some((member) => member.user_id === userInfo.user_id) ? 'member' as const : 'visitor' as const) : 'visitor' as const,
    members: {
      current: groupInfo.members.length,
      max: groupInfo.max_members
    },
    spotsLeft: groupInfo.max_members - groupInfo.members.length,
    pace: "Balanced",
    languages: ["English", "Thai", "Mandarin"]
  };

  // Map actual group members data
  const membersData = {
    members: groupInfo.members.map((member, index) => ({
      id: member.user_id.toString(),
      name: `${member.first_name} ${member.last_name}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(`${member.first_name} ${member.last_name}`)}&background=ff6600&color=ffffff&size=128`,
      joinDate: new Date(groupInfo.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      location: "Unknown", // Since location is not available in Member type
      isHost: member.user_id === groupInfo.group_leader_id,
    })),
    totalMembers: sidebarData.members.current,
    maxMembers: sidebarData.members.max
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <GroupHero 
          {...groupData}
          memberCount={sidebarData.members.current}
          maxMembers={sidebarData.members.max}
          groupImage="https://images.unsplash.com/photo-1674980630249-543635167c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMGxhbnRlcm4lMjBmZXN0aXZhbCUyMEJhbmdrb2slMjB0ZW1wbGUlMjBuaWdodHxlbnwxfHx8fDE3NTc3NjQ0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          groupId={groupId}
          hasProfile={groupInfo.profile_url}
        />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-8 space-y-8">
            <GroupInfoCard groupInfo={groupInfo} />
          </div>
          
          {/* Right Column - Host & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <GroupStatsCard groupId={groupId} {...sidebarData} onDataChange={refetch} />
            <GroupMembersCard {...membersData} />
          </div>
        </div>
      </div>
    </div>
  );
}