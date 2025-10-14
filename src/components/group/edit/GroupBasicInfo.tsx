import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/imageUpload";
import { groupService } from "@/lib/services/group/group-service";

interface GroupBasicInfoProps {
  groupData: {
    group_id: number;
    group_name: string;
    description: string | null;
    profile_url: string | null;
    max_members: number;
  };
  setGroupData: (data: any) => void;
  onDataChange?: (data: { formData: any; profileImageFile: File | null }) => void;
}

export function GroupBasicInfo({ groupData, setGroupData, onDataChange }: GroupBasicInfoProps) {
  const [formData, setFormData] = useState({
    group_name: groupData.group_name,
    description: groupData.description || "",
    max_members: groupData.max_members
  });
  
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch the current profile image on mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!groupData.profile_url) {
        setProfileImageUrl("");
        return;
      }
      
      setIsLoadingImage(true);
      try {
        const response = await groupService.getGroupProfile(groupData.group_id.toString());
        
        if (response instanceof Blob && response.size > 0) {
          const imageUrl = URL.createObjectURL(response);
          setProfileImageUrl(imageUrl);
          
          return () => URL.revokeObjectURL(imageUrl);
        } else {
          setProfileImageUrl("");
        }
      } catch (error) {
        console.error('Failed to fetch group profile image:', error);
        setProfileImageUrl("");
      } finally {
        setIsLoadingImage(false);
      }
    };

    fetchProfileImage();
  }, [groupData.group_id, groupData.profile_url]);

  // Update parent component whenever form data changes (draft mode)
  useEffect(() => {
    // Check if there are any changes from original data
    const hasFormChanges = 
      formData.group_name !== groupData.group_name ||
      formData.description !== (groupData.description || "") ||
      formData.max_members !== groupData.max_members ||
      profileImageFile !== null;
    
    setHasChanges(hasFormChanges);
    
    // Notify parent of changes (only if there are changes)
    if (onDataChange && hasFormChanges) {
      onDataChange({ formData, profileImageFile });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, profileImageFile]);

  const handleImageChange = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  const handleFileChange = (file: File | null) => {
    setProfileImageFile(file);
  };

  const handleReset = () => {
    setFormData({
      group_name: groupData.group_name,
      description: groupData.description || "",
      max_members: groupData.max_members
    });
    setProfileImageFile(null);
    setHasChanges(false);
    toast.info("Changes discarded");
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
          {/* Banner Image */}
          <div className="space-y-2">
            <Label className="text-orange-300">Group Banner Image</Label>
            {isLoadingImage ? (
              <div className="w-full h-32 bg-[#1a1b23] rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                <div className="text-center text-orange-300">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin mb-2" />
                  <p className="text-sm">Loading image...</p>
                </div>
              </div>
            ) : (
              <ImageUpload
                currentImage={profileImageUrl}
                onImageChange={handleImageChange}
                onFileChange={handleFileChange}
              />
            )}
            <p className="text-orange-200/60 text-sm">
              This image will be displayed as the hero banner on your group page
            </p>
          </div>

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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            className="border-gray-600 text-orange-300 hover:bg-[#1a1b23]/80 hover:text-orange-200"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Discard Changes
          </Button>
          <div className="text-sm text-orange-300/60">
            {hasChanges ? "✓ Unsaved changes" : "No changes"}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
