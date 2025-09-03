"use client";
import React, { useState } from "react";
import { brand } from "@/components/ui/utils";
import TravelInviteModal from "@/components/TravelInviteModal";
import { GroupHeader } from "@/components/group/info/GroupHeader";
import { GroupDetails } from "@/components/group/info/GroupDetails";
import { GroupSidebar } from "@/components/group/info/GroupSidebar";
import { GroupContact } from "@/components/group/info/GroupContact";
import { GroupPageSkeleton, ErrorState } from "@/components/group/info/LoadingStates";
import { useGroupData } from "@/lib/hooks/group/useGroupData";
import { useGroupActions } from "@/lib/hooks/group/useGroupActions";
import { SAMPLE_GROUP_DATA } from "@/lib/services/group/group-service";

interface TravelGroupPageProps {
  params?: { groupId?: string };
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
  
  // For demo purposes, we'll use sample data. In production, use:
  // const groupId = params?.groupId || 'default';
  // const { group, loading, error, refetch } = useGroupData(groupId);
  
  // Demo implementation using sample data:
  const group = SAMPLE_GROUP_DATA;
  const loading = false;
  const error = null;
  const refetch = () => {};
  
  const { isRequested, isJoiningLoading, isContactLoading, requestToJoin, contactHost } = useGroupActions('demo-group-id');

  // Handle loading state
  if (loading) {
    return <GroupPageSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load group"
        message={error}
        onRetry={refetch}
      />
    );
  }

  // Handle missing group data
  if (!group) {
    return (
      <ErrorState
        title="Group not found"
        message="The group you're looking for doesn't exist or has been removed."
      />
    );
  }

  const handleShare = () => {
    setIsModalOpen(true);
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
            <GroupHeader group={group} />
            <GroupDetails group={group} onMemberClick={handleMemberClick} />
          </div>
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <GroupSidebar
            group={group}
            isRequested={isRequested}
            isLoading={isJoiningLoading}
            onRequestToJoin={requestToJoin}
            onShare={handleShare}
            onContactHost={handleContactHost}
          />
          
          <GroupContact
            onContactHost={handleContactHost}
            isLoading={isContactLoading}
          />
        </aside>
      </div>
      
      {/* Travel Invite Modal */}
      <TravelInviteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
