'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGroupRequest, Interest } from '@/lib/types';
import { GroupPreviewCard } from '@/components/group/info/GroupPreviewCard';
import { CreateGroupForm } from '@/components/group/info/CreateGroupForm';
import { groupService } from '@/lib/services/group/group-service';
import { SuccessModal } from '@/components/shared/SuccessModal';

// Success Modal Component
interface GroupCreateSuccessProps {
  isOpen: boolean;
}

function GroupCreateSuccess({ isOpen }: GroupCreateSuccessProps) {
  return (
    <SuccessModal
      isOpen={isOpen}
      actionType="group-create"
      autoCloseDuration={2000}
    />
  );
}

export default function App() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [groupData, setGroupData] = useState<CreateGroupRequest>({
    group_name: 'Bangkok → Chiang Mai Adventure',
    description: 'Join us for an amazing cultural journey through Thailand. We\'ll explore ancient temples, taste incredible street food, and experience the famous Yi Peng lantern festival. Perfect for travelers who love food, culture, and making new friends!',
    destination: 'Chiang Mai, Thailand',
    max_members: 8,
    start_date: new Date('2025-11-12'),
    end_date: new Date('2025-11-16'),
    interest_fields: [],
    profile: undefined,
    profile_url: undefined
  });

  const updateGroupData = (updates: Partial<CreateGroupRequest>) => {
    setGroupData(prev => ({ ...prev, ...updates }));
  };

  // Handle group creation
  const handleCreateGroup = async (formData: CreateGroupRequest) => {
    try {      
      // The formData already contains the File object in the profile field
      // Build CreateGroupRequest for backend
      const createGroupRequest = {
        group_name: formData.group_name,
        description: formData.description,
        interest_fields: formData.interest_fields,
        profile: formData.profile, // This is now a File object
        max_members: formData.max_members,
      };
      console.log("Creating group with data:", createGroupRequest);
      
      const response = await groupService.createGroup(createGroupRequest);
      
      setShowSuccessModal(true);

      // Redirect after a short delay
      const groupId = (response as any)?.group_id;
      setTimeout(() => {
        if (groupId) {
          router.push(`/group/${groupId}/info`);
        } else {
          router.push("/home");
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error; // Re-throw to let CreateGroupForm handle the error display
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-orange-400 mb-2">Create New Group</h1>
          <p className="text-orange-200/80">Set up your travel group and find perfect companions</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Preview Card */}
          <div className="space-y-6">
            <GroupPreviewCard groupData={groupData} />
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            <CreateGroupForm 
              groupData={groupData} 
              updateGroupData={updateGroupData}
              onSubmit={handleCreateGroup}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <GroupCreateSuccess isOpen={showSuccessModal} />
    </div>
  );
}