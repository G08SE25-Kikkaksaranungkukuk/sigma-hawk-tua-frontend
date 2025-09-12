"use client";
import React, { useState } from "react";
import { brand } from "@/components/ui/utils";
import TravelInviteModal from "@/components/TravelInviteModal";
import { GroupHeader } from "@/components/group/info/GroupHeader";
import { GroupDetails } from "@/components/group/info/GroupDetails";
import { GroupSidebar } from "@/components/group/info/GroupSidebar";
import { GroupContact } from "@/components/group/info/GroupContact";
import { GroupPageSkeleton, ErrorState } from "@/components/group/info/LoadingStates";
import { useGroupActions } from "@/lib/hooks/group/useGroupActions";
import { GroupData, UserData } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { groupService } from "@/lib/services/group/group-service";

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
  const [userInfo,setUserInfo] = React.useState<UserData>();
  const [groupInfo , setGroupInfo] = React.useState<GroupData>();

  const {groupId} = React.use(params);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { isRequested, isJoiningLoading, isContactLoading, requestToJoin: baseRequestToJoin, contactHost, resetRequest } = useGroupActions(groupId ?? "Nan");

  const refetch = React.useCallback(() => {
    if (!groupId) return;
    setLoading(true);
    setError(null);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    Promise.all([
      groupService.getCurrentUser(),
      groupService.getGroupDetails(groupId),
    ])
      .then(([userRes, groupRes]) => {
        setUserInfo(userRes);
        setGroupInfo(groupRes);
        console.log("groupInfo (refetch):", groupRes);

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
    group_id: groupInfo.group_id,
    group_name: groupInfo.group_name,
    group_leader_id: groupInfo.group_leader_id,
    interests: groupInfo.interests || [],
    description: groupInfo.description || '',
    members: groupInfo.members || [],
    max_members: groupInfo.max_members,
    created_at: groupInfo.created_at,
    updated_at: groupInfo.updated_at,
    // Legacy fields for backward compatibility with existing components
    title: groupInfo.group_name || '',
    destination: 'Thailand',  // You can add this field to API later
    dates: new Date(groupInfo.created_at).toLocaleDateString(),
    timezone: 'GMT+7',
    privacy: 'Public' as const,
    maxSize: groupInfo.max_members,
    currentSize: groupInfo.members?.length || 0,
    pace: 'Balanced' as const,
    languages: ['English'],
    requirements: [],
    rules: [],
    itinerary: [{
      day: 'Day 1',
      plan: 'Welcome to the group!'
    }],
    hostNote: 'Welcome to our travel group!',
    // Transform members to legacy format for compatibility
    legacyMembers: (groupInfo.members || []).map(member => ({
      id: member.user_id.toString(),
      name: `${member.first_name} ${member.last_name}`,
      role: member.user_id === groupInfo.group_leader_id ? ('Host' as const) : ('Member' as const),
      avatar: '' // Add profile_url to Member interface if needed
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
      refetch();
      // Reset the request state so the button shows "Join now!"
      resetRequest();

    } catch (error) {
      console.error("Failed to leave group:", error);
      setError("Failed to leave group");
      setLoading(false);
    }
  };

  const requestToJoin = async () => {
    try {
      await baseRequestToJoin();
      // After successful join, refetch to update the group data
      refetch();

    } catch (error) {
      console.error('Failed to join group:', error);
      // You might want to show an error message here
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
