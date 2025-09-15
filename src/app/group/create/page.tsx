'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGroupRequest, Interest } from '@/lib/types';
import { GroupPreviewCard } from '@/components/group/info/GroupPreviewCard';
import { CreateGroupForm } from '@/components/group/info/CreateGroupForm';
import { groupService } from '@/lib/services/group/group-service';
import { PopupCard } from '@/components/ui/popup-card';
import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Success Modal Component
interface GroupCreateSuccessProps {
  isOpen: boolean;
}

function GroupCreateSuccess({ isOpen }: GroupCreateSuccessProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex items-center justify-center p-4 min-h-[80vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.6 }}
            >
              <PopupCard className="max-w-md w-full bg-gray-900/95 border-2 border-orange-500/30 p-6 text-white">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                      Group Created Successfully! 🎉
                    </h2>
                    <p className="text-gray-300">
                      Your travel group has been created! Redirecting you to the group page...
                    </p>
                  </div>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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