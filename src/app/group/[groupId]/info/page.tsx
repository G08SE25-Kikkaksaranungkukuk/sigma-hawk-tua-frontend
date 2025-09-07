"use client";
import React, { useState } from "react";
import { use } from "react";
import { brand } from "@/components/ui/utils";
import TravelInviteModal from "@/components/TravelInviteModal";
import { GroupHeader } from "@/components/group/info/GroupHeader";
import { GroupDetails } from "@/components/group/info/GroupDetails";
import { GroupSidebar } from "@/components/group/info/GroupSidebar";
import { GroupContact } from "@/components/group/info/GroupContact";
import { GroupPageSkeleton, ErrorState } from "@/components/group/info/LoadingStates";
import { useGroupActions } from "@/lib/hooks/group/useGroupActions";
import axios from "axios";
import { baseAPIUrl } from "@/lib/config";
import { GroupData } from "@/lib/types/home/group";
import type { UserInfo } from "@/components/schemas";
import { set } from "zod";
import { tr } from "zod/v4/locales";
import { apiClient } from "@/lib/api";

interface TravelGroupPageProps {
  params: Promise<{ groupId?: string }>;
}

/**
 * Main Travel Group Page Component
 * 
 * This component demonstrates the refactored, maintainable approach:
 * - Separated concerns (data fetching, UI, business logic)
 * - Reusable components
 * - Centralized configuration
 * - Proper error handling and loading states
 * - Easy to test and modify
 */
export default function TravelGroupPage({ params }: TravelGroupPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageUrl,setPageUrl] = React.useState<string>("");
  const [userInfo,setUserInfo] = React.useState<UserInfo>()
  const [groupInfo , setGroupInfo] = React.useState<GroupData>();
  
  const {groupId} = React.use(params);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { isRequested, isJoiningLoading, isContactLoading, requestToJoin, contactHost } = useGroupActions(groupId ?? "Nan");

  const refetch = React.useCallback(() => {
    if (!groupId) return;
    setLoading(true);
    setError(null);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    Promise.all([
      apiClient.get("/auth/whoami", { withCredentials: true }),
      apiClient.get("/group/" + groupId),
    ])
      .then(([whoamiRes, groupRes]) => {
        setUserInfo(whoamiRes.data.data);
        setGroupInfo(groupRes.data.data);
        console.log("groupInfo (refetch):", groupRes.data.data);

        timeoutId = setTimeout(() => setLoading(false), 800);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [groupId]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
      const cleanup = refetch();
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    }
  }, [refetch]);

  if (loading) {
    return <GroupPageSkeleton />;
  }

  if (error) {
    return <ErrorState title="Failed to load group" onRetry={refetch} />;
  }
  console.log(userInfo)
  if (!groupInfo) {
    return (
      <ErrorState
        title="Group not found"
        message="The group you're looking for doesn't exist or has been removed."
        onRetry={refetch}
      />
    );
  }


  
  // Check if the current user is a member or leader
  const isMember = userInfo && groupInfo?.members?.some(
    member => member.user_id === userInfo.user_id
  );

  const isLeader = userInfo && groupInfo?.group_leader_id === userInfo.user_id;

  const group = groupInfo && groupId ? {
    id: groupId,
    title: groupInfo.group_name || '',
    destination: 'บ้านไอ่โจ้',  // Add destination to your API
    dates: new Date().toLocaleDateString(),  // Add dates to your API
    timezone: 'GMT+7',  // Add timezone to your API
    description: '',  // Add description to your API
    privacy: 'Public' as const,  // Add privacy to your API
    maxSize: 8,  // Add maxSize to your API
    currentSize: groupInfo.members?.length || 0,
    pace: 'Balanced' as const,  // Add pace to your API
    languages: ['English'],  // Add languages to your API
    interests: groupInfo.interest_fields || [],
    requirements: [],  // Add requirements to your API
    rules: [],  // Add rules to your API
    itinerary: [{  // Add itinerary to your API
      day: 'Day 1',
      plan: 'Welcome dinner'
    }],
    hostNote: '',  // Add hostNote to your API if needed
    members: (groupInfo.members || []).map(member => ({
      id: member.user_id.toString(),
      name: `${member.first_name} ${member.last_name}`,
      role: member.user_id === groupInfo.group_leader_id ? ('Host' as const) : ('Member' as const),
      avatar: member.profile_url || ''
    }))
  } : null;
  

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    if (!userInfo?.user_id) {
      setError("User not loaded");
      return;
    }

    try {
      await apiClient.delete(
        `/group/${groupId}/leave`,
        {
          data: { "user_id": userInfo.user_id }, 
          withCredentials: true,
        }
      );
      setGroupInfo(prev => prev ? {
        ...prev,
        members: (prev.members ?? []).filter(m => m.user_id !== userInfo.user_id)
      } : prev);

    } catch (error) {
      console.error("Failed to leave group:", error);
      setError("Failed to leave group");
      setLoading(false);
    }
  };


  const handleContactHost = async () => {
    try {
      await contactHost("I'd like to know more about this trip!");
      // In a real app, show success toast here
    } catch (error) {
      // In a real app, show error toast here
      console.error('Failed to contact host:', error);
    }
  };

  const handleMemberClick = (memberId: string) => {
    console.log("Clicked member:", memberId);
    // In a real app, navigate to member profile or show member details
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-6 md:p-10" style={{ background: brand.bg }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-xl overflow-hidden" style={{ background: brand.card, border: `1px solid ${brand.border}` }}>
            {group && (
              <>
                <GroupHeader group={group} />
                <GroupDetails group={group} onMemberClick={handleMemberClick} />
              </>
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {group && <GroupSidebar
            group={group}
            userInfo={userInfo!}
            isRequested={isRequested}
            isLoading={isJoiningLoading}
            onRequestToJoin={requestToJoin}
            onShare={handleShare}
            onContactHost={handleContactHost}
            onLeaveGroup={handleLeaveGroup}
            isMember={!!isMember}
            isLeader={!!isLeader}
          />}
          
          <GroupContact
            onContactHost={handleContactHost}
            isLoading={isContactLoading}
          />
        </aside>
      </div>
      
      {/* Travel Invite Modal */}
      <TravelInviteModal
        inviteLink={pageUrl}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
