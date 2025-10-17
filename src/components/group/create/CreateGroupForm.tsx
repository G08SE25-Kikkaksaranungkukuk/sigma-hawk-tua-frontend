import React from 'react';
import { CreateGroupRequest } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/imageUpload';
import { InterestSelector } from './InterestSelector';
import { ArrowLeft, Plus, Calendar, AlertCircle } from 'lucide-react';
import { 
  ValidationErrors,
  validateGroupForm,
  validateGroupName,
  validateDescription,
  validateDestination,
  validateMaxMembers,
  validateStartDate,
  validateEndDate,
  isFormValid
} from '@/app/utils/groupValidation';


interface CreateGroupFormProps {
  groupData: CreateGroupRequest;
  updateGroupData: (updates: Partial<CreateGroupRequest>) => void;
  onSubmit?: (groupData: CreateGroupRequest) => Promise<void>;
  onCancel?: () => void;
}

export function CreateGroupForm({ groupData, updateGroupData, onSubmit, onCancel }: CreateGroupFormProps) {
  const [profileImageFile, setProfileImageFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const validationErrors = validateGroupForm(groupData);
    setErrors(validationErrors);
    return isFormValid(validationErrors);
  };

  const clearFieldError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  };

  const handleCreateGroup = async () => {
    // Run validation
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.border-red-400');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
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
    <div className="bg-[#12131a]/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/70 shadow-2xl">
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
            onChange={(e) => {
              updateGroupData({ group_name: e.target.value });
              clearFieldError('group_name');
            }}
            onBlur={() => {
              if (groupData.group_name?.trim()) {
                const error = validateGroupName(groupData.group_name);
                if (error) {
                  setErrors(prev => ({ ...prev, group_name: error }));
                }
              }
            }}
            placeholder="Enter group title..."
            className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 ${
              errors.group_name ? 'border-red-400 focus:border-red-400' : ''
            }`}
          />
          <ErrorMessage error={errors.group_name} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-orange-300">Description</Label>
          <Textarea
            value={groupData.description || ''}
            onChange={(e) => {
              updateGroupData({ description: e.target.value });
              clearFieldError('description');
            }}
            onBlur={() => {
              if (groupData.description?.trim()) {
                const error = validateDescription(groupData.description);
                if (error) {
                  setErrors(prev => ({ ...prev, description: error }));
                }
              }
            }}
            placeholder="Describe your travel group and what makes it special..."
            className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 min-h-[100px] resize-none ${
              errors.description ? 'border-red-400 focus:border-red-400' : ''
            }`}
          />
          <div className="flex justify-between items-center">
            <ErrorMessage error={errors.description} />
            <span className="text-xs text-[#9aa3b2]">
              {groupData.description?.length || 0}/500
            </span>
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label className="text-orange-300">Destination</Label>
          <Input
            value={groupData.destination || ''}
            onChange={(e) => {
              updateGroupData({ destination: e.target.value });
              clearFieldError('destination');
            }}
            onBlur={() => {
              if (groupData.destination?.trim()) {
                const error = validateDestination(groupData.destination);
                if (error) {
                  setErrors(prev => ({ ...prev, destination: error }));
                }
              }
            }}
            placeholder="Where are you planning to go?"
            className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 ${
              errors.destination ? 'border-red-400 focus:border-red-400' : ''
            }`}
          />
          <ErrorMessage error={errors.destination} />
        </div>

        {/* Max Members */}
        <div className="space-y-2">
          <Label className="text-orange-300">Maximum Members</Label>
          <Input
            type="number"
            value={groupData.max_members || 1}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              updateGroupData({ max_members: value });
              clearFieldError('max_members');
            }}
            onBlur={() => {
              const error = validateMaxMembers(groupData.max_members);
              if (error) {
                setErrors(prev => ({ ...prev, max_members: error }));
              }
            }}
            min="1"
            max="50"
            className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 ${
              errors.max_members ? 'border-red-400 focus:border-red-400' : ''
            }`}
          />
          <ErrorMessage error={errors.max_members} />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-orange-300">Start Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={groupData.start_date instanceof Date ? groupData.start_date.toISOString().split('T')[0] : (groupData.start_date || '')}
                onChange={(e) => {
                  updateGroupData({ start_date: e.target.value ? new Date(e.target.value) : undefined });
                  clearFieldError('start_date');
                  clearFieldError('end_date'); // Clear end date error as it may depend on start date
                }}
                onBlur={() => {
                  const error = validateStartDate(groupData.start_date);
                  if (error) {
                    setErrors(prev => ({ ...prev, start_date: error }));
                  }
                }}
                className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                  errors.start_date ? 'border-red-400 focus:border-red-400' : ''
                }`}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <ErrorMessage error={errors.start_date} />
          </div>
          <div className="space-y-2">
            <Label className="text-orange-300">End Date</Label>
            <div className="relative">
              <Input
                type="date"
                value={groupData.end_date instanceof Date ? groupData.end_date.toISOString().split('T')[0] : (groupData.end_date || '')}
                onChange={(e) => {
                  updateGroupData({ end_date: e.target.value ? new Date(e.target.value) : undefined });
                  clearFieldError('end_date');
                }}
                onBlur={() => {
                  const error = validateEndDate(groupData.end_date, groupData.start_date);
                  if (error) {
                    setErrors(prev => ({ ...prev, end_date: error }));
                  }
                }}
                className={`bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                  errors.end_date ? 'border-red-400 focus:border-red-400' : ''
                }`}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <ErrorMessage error={errors.end_date} />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label className="text-orange-300">Interests</Label>
          <InterestSelector 
            selectedInterestKeys={groupData.interest_fields || []}
            onInterestKeysChange={(interestKeys: string[]) => {
              updateGroupData({ interest_fields: interestKeys });
              clearFieldError('interest_fields');
            }}
          />
          <ErrorMessage error={errors.interest_fields} />
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
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25 transition-all duration-200 hover:shadow-[#ff6600]/40 h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#ff6600] disabled:hover:to-[#ff8533]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Continue to Itineraries
              </>
            )}
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