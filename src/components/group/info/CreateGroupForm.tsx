import React from 'react';
import { CreateGroupRequest, Interest } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/imageUpload';
import { InterestSelector } from './InterestSelector';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';


interface CreateGroupFormProps {
  groupData: CreateGroupRequest;
  updateGroupData: (updates: Partial<CreateGroupRequest>) => void;
  onSubmit?: (groupData: CreateGroupRequest) => Promise<void>;
  onCancel?: () => void;
}

export function CreateGroupForm({ groupData, updateGroupData, onSubmit, onCancel }: CreateGroupFormProps) {
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);

  const handleCreateGroup = async () => {
    if (onSubmit) {
      try {
        // Include the file in the group data
        const groupDataWithFile = {
          ...groupData,
          profile: profileImageFile || undefined
        };
        console.log('Submitting group data:', groupDataWithFile);
        await onSubmit(groupDataWithFile);
      } catch (error) {
        console.error('Failed to create group:', error);
        alert('Failed to create group. Please try again.');
      }
    } else {
      // Fallback behavior for demo mode
      console.log('Creating group:', groupData);
      alert('Group created successfully! (This is a demo)');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Handle cancel/back logic here
      console.log('Cancelled group creation');
    }
  };

  return (
    <div className="bg-[#12131a] rounded-3xl p-8 border border-gray-800/50">
      <div className="space-y-6">
        {/* Form Header */}
        <div>
          <h2 className="text-2xl text-orange-400 mb-2">Group Details</h2>
          <p className="text-orange-200/80">Fill in the information below to create your travel group</p>
        </div>

        {/* Group Title */}
        <div className="space-y-2">
          <Label className="text-orange-300">Group Title</Label>
          <Input
            value={groupData.group_name || ''}
            onChange={(e) => updateGroupData({ group_name: e.target.value })}
            placeholder="Enter group title..."
            className="bg-[#1a1b23] border-gray-700 text-[#e8eaee] placeholder:text-[#9aa3b2] focus:border-[#ff6600] focus:ring-[#ff6600]/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-orange-300">Description</Label>
          <Textarea
            value={groupData.description || ''}
            onChange={(e) => updateGroupData({ description: e.target.value })}
            placeholder="Describe your travel group and what makes it special..."
            className="bg-[#1a1b23] border-gray-700 text-[#e8eaee] placeholder:text-[#9aa3b2] focus:border-[#ff6600] focus:ring-[#ff6600]/20 min-h-[100px] resize-none"
          />
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label className="text-orange-300">Destination</Label>
          <Input
            value={groupData.destination || ''}
            onChange={(e) => updateGroupData({ destination: e.target.value })}
            placeholder="Where are you planning to go?"
            className="bg-[#1a1b23] border-gray-700 text-[#e8eaee] placeholder:text-[#9aa3b2] focus:border-[#ff6600] focus:ring-[#ff6600]/20"
          />
        </div>

        {/* Max Members */}
        <div className="space-y-2">
          <Label className="text-orange-300">Maximum Members</Label>
          <Input
            type="number"
            value={groupData.max_members || 1}
            onChange={(e) => updateGroupData({ max_members: parseInt(e.target.value) || 1 })}
            min="1"
            max="50"
            className="bg-[#1a1b23] border-gray-700 text-[#e8eaee] placeholder:text-[#9aa3b2] focus:border-[#ff6600] focus:ring-[#ff6600]/20"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-orange-300">Start Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={groupData.start_date instanceof Date ? groupData.start_date.toISOString().split('T')[0] : (groupData.start_date || '')}
                onChange={(e) => updateGroupData({ start_date: e.target.value ? new Date(e.target.value) : undefined })}
                className="bg-[#1a1b23] border-gray-700 text-white focus:border-[#ff6600] focus:ring-[#ff6600]/20 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-orange-300">End Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={groupData.end_date instanceof Date ? groupData.end_date.toISOString().split('T')[0] : (groupData.end_date || '')}
                onChange={(e) => updateGroupData({ end_date: e.target.value ? new Date(e.target.value) : undefined })}
                className="bg-[#1a1b23] border-gray-700 text-white focus:border-[#ff6600] focus:ring-[#ff6600]/20 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label className="text-orange-300">Interests</Label>
          <InterestSelector 
            selectedInterestKeys={groupData.interest_fields || []}
            onInterestKeysChange={(interestKeys: string[]) => updateGroupData({ interest_fields: interestKeys })}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-orange-300">Cover Image</Label>
          <ImageUpload 
            currentImage={groupData.profile_url || ''}
            onImageChange={(profile_url) => updateGroupData({ profile_url })}
            onFileChange={(file) => setProfileImageFile(file)}
          />
        </div>

        {/* Orange divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#ff6600]/30 to-transparent"></div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleCreateGroup}
            className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 transition-all duration-200 hover:shadow-[#ff6600]/40 h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Group
          </Button>
          
          <button
            onClick={handleCancel}
            className="w-full text-[#9aa3b2] hover:text-[#e8eaee] transition-colors duration-200 text-center py-2"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}