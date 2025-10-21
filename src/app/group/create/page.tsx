'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGroupRequest, Itinerary } from '@/lib/types';
import { GroupPreviewCard } from '@/components/group/create/GroupPreviewCard';
import { CreateGroupForm } from '@/components/group/create/CreateGroupForm';
import { ItineraryPage } from '@/components/group/create/ItineraryPage';
import { StepIndicator } from '@/components/group/create/StepIndicator';
import { groupService } from '@/lib/services/group/group-service';
import { SuccessModal } from '@/components/shared/SuccessModal';
import { FloatingElements } from '@/components/shared';

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
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);
  
  const [groupData, setGroupData] = useState<CreateGroupRequest>({
    group_name: '',
    description: '',
    destination: '',
    max_members: 8,
    start_date: undefined,
    end_date: undefined,
    interest_fields: [],
    profile: undefined,
    profile_url: undefined
  });

  const updateGroupData = (updates: Partial<CreateGroupRequest>) => {
    setGroupData(prev => ({ ...prev, ...updates }));
  };

  // Handle proceeding to step 2 (itinerary page)
  const handleProceedToItinerary = async (formData: CreateGroupRequest) => {
    setGroupData(formData);
    
    // Create the group first, then proceed to itineraries
    try {
      const createGroupRequest = {
        group_name: formData.group_name,
        description: formData.description,
        destination: formData.destination,
        interest_fields: formData.interest_fields,
        profile: formData.profile,
        max_members: formData.max_members,
      };
      
      const response = await groupService.createGroup(createGroupRequest);
      setCreatedGroupId(response.group_id);
      setCurrentStep(2);
    } catch (error) {
      console.error("Failed to create group:", error);
      alert('Failed to create group. Please try again.');
    }
  };

  // Handle going back to step 1
  const handleBackToDetails = () => {
    setCurrentStep(1);
  };

  // Handle completing itinerary step
  const handleCompleteItineraries = async () => {
    // Group and itineraries have already been created via API
    // Just show success and redirect
    setShowSuccessModal(true);

    setTimeout(() => {
      if (createdGroupId) {
        router.push(`/group/${createdGroupId}/info`);
      } else {
        router.push("/home");
      }
    }, 2000);
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/home');
  };

  // Prepare group data for itinerary page
  const getGroupDataForItinerary = () => {
    const formatDate = (date: Date | undefined | string) => {
      if (!date) return '';
      if (date instanceof Date) return date.toISOString().split('T')[0];
      return date;
    };

    return {
      title: groupData.group_name,
      destination: groupData.destination,
      startDate: formatDate(groupData.start_date),
      endDate: formatDate(groupData.end_date),
    };
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-6">
      <FloatingElements />
      
      {currentStep === 1 ? (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl text-orange-400 mb-2">Create New Group</h1>
            <p className="text-orange-200/80">Set up your travel group and find perfect companions</p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator currentStep={1} />
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
                onSubmit={handleProceedToItinerary}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      ) : createdGroupId ? (
        <ItineraryPage
          groupId={createdGroupId}
          onComplete={handleCompleteItineraries}
          groupData={getGroupDataForItinerary()}
        />
      ) : null}

      {/* Success Popup */}
      <GroupCreateSuccess isOpen={showSuccessModal} />
    </div>
  );
}