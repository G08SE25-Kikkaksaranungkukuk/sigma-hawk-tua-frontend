import { Users, Calendar, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { groupService } from "@/lib/services/group/group-service";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { ImageCropModal } from "@/components/ImageCropModal";

interface GroupHeroProps {
  groupData: {
    group_name: string;
    description: string | null;
    profile_url: string | null;
    created_at: Date;
  };
  memberCount: number;
  maxMembers: number;
  groupId: number;
  onImageChange?: (imageUrl: string) => void;
  onFileChange?: (file: File | null) => void;
  previewImageUrl?: string;
}

export function GroupHero({ groupData, memberCount, maxMembers, groupId, onImageChange, onFileChange, previewImageUrl }: GroupHeroProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string>("");
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview URL and open crop modal
    const imageUrl = URL.createObjectURL(file);
    setSelectedImageForCrop(imageUrl);
    setOriginalFileName(file.name);
    setIsCropModalOpen(true);
  };

  const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
    // Update preview with cropped image
    setProfileImageUrl(croppedImageUrl);
    
    // Notify parent components
    if (onImageChange) onImageChange(croppedImageUrl);
    if (onFileChange) onFileChange(croppedFile);
    
    // Close modal
    setIsCropModalOpen(false);
  };

  const handleCropModalClose = () => {
    setIsCropModalOpen(false);
    // Clean up the temporary image URL
    if (selectedImageForCrop) {
      URL.revokeObjectURL(selectedImageForCrop);
      setSelectedImageForCrop("");
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!groupId) return;
      
      setImageLoading(true);
      if (groupData.profile_url) {
        try {
          const response = await groupService.getGroupProfile(groupId.toString());
          
          // Check if response is a Blob (image) or JSON (no image)
          if (response instanceof Blob && response.size > 0) {
            // Create object URL from blob data
            const imageUrl = URL.createObjectURL(response);
            setProfileImageUrl(imageUrl);
            
            // Cleanup function to revoke object URL when component unmounts
            return () => URL.revokeObjectURL(imageUrl);
          } else {
            // No profile image available
            console.log('No profile image available for group:', groupId);
            setProfileImageUrl(null);
          }
        } catch (error) {
          console.error('Failed to fetch group profile image:', error);
          setProfileImageUrl(null);
        } finally {
          setImageLoading(false);
        }
      } else {
        setProfileImageUrl(null);
        setImageLoading(false);
      }
    };

    fetchProfileImage();
  }, [groupId, groupData.profile_url]);

  // Use preview image if available, otherwise use fetched image
  const displayImageUrl = previewImageUrl || profileImageUrl;

  return (
    <>
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={handleCropModalClose}
        imageUrl={selectedImageForCrop}
        onCropComplete={handleCropComplete}
        fileName={originalFileName}
      />
      
      <div className="relative w-full mb-8">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      
      {/* Banner Image */}
      <div className="relative h-100 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 via-orange-400/10 to-[#12131a]">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-orange-300">
              <div className="w-12 h-12 mx-auto border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mb-4" />
              <p>Loading image...</p>
            </div>
          </div>
        ) : displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={groupData.group_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-orange-300/50">
              <Users className="mx-auto h-16 w-16 mb-4 opacity-20" />
              <p className="opacity-50">No banner image</p>
            </div>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent pointer-events-none" />
        
        {/* Upload Button - Bottom Right */}
        <div className="absolute bottom-6 right-6 z-20">
          <Button
            onClick={handleUploadClick}
            size="sm"
            className="backdrop-blur-sm bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#ff7722] hover:to-[#ff9944] text-white shadow-lg shadow-[#ff6600]/30 pointer-events-auto"
          >
            <Upload className="h-4 w-4 mr-1" />
            {displayImageUrl ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>
        
        {/* Group Information - Overlaying the banner */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-orange-400 drop-shadow-lg">{groupData.group_name}</h1>
              </div>
              {groupData.description && (
                <p className="text-orange-100 drop-shadow max-w-2xl mb-4">
                  {groupData.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="gap-2 backdrop-blur-sm bg-[#12131a]/80 border border-gray-800/70 text-orange-300 hover:bg-[#1a1b23]/80">
                  <Users className="h-3.5 w-3.5" />
                  {memberCount} / {maxMembers} members
                </Badge>
                <Badge variant="secondary" className="gap-2 backdrop-blur-sm bg-[#12131a]/80 border border-gray-800/70 text-orange-300 hover:bg-[#1a1b23]/80">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {formatDate(groupData.created_at)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
