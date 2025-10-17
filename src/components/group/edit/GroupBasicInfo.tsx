import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { groupService } from "@/lib/services/group/group-service";
import { InterestSelector } from "@/components/group/create/InterestSelector";
import { Interest, UpdateGroupRequest } from "@/lib/types";

interface GroupBasicInfoProps {
  groupData: {
    group_id: number;
    group_name: string;
    description: string | null;
    profile_url: string | null;
    max_members: number;
    interests?: Interest[];
  };
  setGroupData: (data: any) => void;
  onDataChange?: (data: { formData: any; profileImageFile: File | null | undefined; interestKeys?: string[] }) => void;
  profileImageFile?: File | null;
}

export function GroupBasicInfo({ groupData, setGroupData, onDataChange, profileImageFile: externalProfileImageFile }: GroupBasicInfoProps) {
  const [formData, setFormData] = useState({
    group_name: groupData.group_name,
    description: groupData.description || "",
    max_members: groupData.max_members
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize selected interests from groupData
  const [selectedInterestKeys, setSelectedInterestKeys] = useState<string[]>(
    groupData.interests?.map(interest => interest.key) || []
  );

  // Update parent component whenever form data changes (draft mode)
  useEffect(() => {
    const originalInterestKeys = groupData.interests?.map(interest => interest.key) || [];
    const interestsChanged = 
      selectedInterestKeys.length !== originalInterestKeys.length ||
      !selectedInterestKeys.every(key => originalInterestKeys.includes(key));
    
    // Check if there are any changes from original data
    const hasFormChanges = 
      formData.group_name !== groupData.group_name ||
      formData.description !== (groupData.description || "") ||
      formData.max_members !== groupData.max_members ||
      externalProfileImageFile !== null ||
      interestsChanged;
    
    setHasChanges(hasFormChanges);
    
    // Notify parent of changes (only if there are changes)
    if (onDataChange && hasFormChanges) {
      onDataChange({ formData, profileImageFile: externalProfileImageFile, interestKeys: selectedInterestKeys });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, externalProfileImageFile, selectedInterestKeys]);

  const handleReset = () => {
    setFormData({
      group_name: groupData.group_name,
      description: groupData.description || "",
      max_members: groupData.max_members
    });
    setSelectedInterestKeys(groupData.interests?.map(interest => interest.key) || []);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create update request object (service will handle FormData)
      const updateGroupRequest: UpdateGroupRequest = {
        group_name: formData.group_name,
        description: formData.description,
        max_members: formData.max_members,
        interest_fields: selectedInterestKeys,
        profile: externalProfileImageFile || undefined
      };

      // Call the update API
      const updatedGroup = await groupService.updateGroup(groupData.group_id.toString(), updateGroupRequest);
      
      // Update the group data with the response
      setGroupData(updatedGroup);
      
      // Reset states
      setHasChanges(false);
      
      toast.success("Changes saved successfully!");
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-orange-400">Basic Information</CardTitle>
        <CardDescription className="text-orange-200/80">
          Update your group's basic details and settings (changes are saved as draft)
        </CardDescription>
      </CardHeader>
      <div>
        <CardContent className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group_name" className="text-orange-300">Group Name</Label>
            <Input
              id="group_name"
              placeholder="Enter group name"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              required
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-orange-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your group's purpose and activities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30 resize-none"
            />
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="max_members" className="text-orange-300">Maximum Members</Label>
            <Input
              id="max_members"
              type="number"
              min="1"
              max="100"
              value={formData.max_members}
              onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
              required
              className="bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
            <p className="text-orange-200/60 text-sm">
              Set the maximum number of members allowed in this group
            </p>
          </div>

          {/* Group Interests */}
          <div className="space-y-2 pb-6">
            <Label className="text-orange-300">Group Interests</Label>
            <p className="text-orange-200/60 text-sm mb-3">
              Select interests that represent your group to attract like-minded members
            </p>
            <InterestSelector
              selectedInterestKeys={selectedInterestKeys}
              onInterestKeysChange={setSelectedInterestKeys}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-6">
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="border-gray-600 text-orange-300 hover:bg-[#1a1b23]/80 hover:text-orange-200"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9944] text-white shadow-lg shadow-[#ff6600]/30 hover:shadow-[#ff6600]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
          <div className="text-sm text-orange-300/60">
            {hasChanges ? "✓ Unsaved changes" : "No changes"}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
