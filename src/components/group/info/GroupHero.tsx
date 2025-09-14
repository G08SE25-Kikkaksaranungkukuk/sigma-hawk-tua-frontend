import { MapPin, Calendar, Clock, Globe, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Interest } from "@/lib/types"
import { InterestsPill } from "@/components/ui/interests-pill";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { groupService } from "@/lib/services/group/group-service";
import { useState, useEffect } from "react";

interface GroupHeroProps {
  title: string;
  destination: string;
  dateRange: string;
  timezone: string;
  location: string;
  interests: Interest[];
  groupType: string;
  isPublic: boolean;
  memberCount: number;
  maxMembers: number;
  groupImage?: string;
  groupId?: string; // Add groupId to fetch profile image
  hasProfile?: string | null; // New prop to indicate if the group has a profile image
}

export function GroupHero({ 
  title, 
  destination, 
  dateRange, 
  timezone, 
  location, 
  interests, 
  groupType, 
  isPublic,
  memberCount,
  maxMembers,
  groupImage,
  groupId,
  hasProfile
}: GroupHeroProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
        if (!groupId) return;
      
        setImageLoading(true);
        if (hasProfile) {
            try {
                const response = await groupService.getGroupProfile(groupId);
                
                // Check if response.data is a Blob (image) or JSON (no image)
                if (response instanceof Blob && response.size > 0) {
                // Create object URL from blob data
                const imageUrl = URL.createObjectURL(response);
                setProfileImageUrl(imageUrl);
                
                // Cleanup function to revoke object URL when component unmounts
                return () => URL.revokeObjectURL(imageUrl);
                } else {
                // No profile image available (profile_url is null)
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
            setProfileImageUrl("https://images.unsplash.com/photo-1674980630249-543635167c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFpbGFuZCUyMGxhbnRlcm4lMjBmZXN0aXZhbCUyMEJhbmdrb2slMjB0ZW1wbGUlMjBuaWdodHxlbnwxfHx8fDE3NTc3NjQ0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral");
            setImageLoading(false);
        }
    };

    fetchProfileImage();
  }, [groupId, hasProfile]);

  // Determine which image to display with proper null handling:
  // 1. Profile image fetched from API (if available and not null)
  // 2. Fallback to groupImage prop (static fallback)
  const displayImage = profileImageUrl || groupImage;
  return (
    <div className="bg-gradient-to-r from-[#12131a] to-[#1a1b24] rounded-3xl border border-[rgba(255,102,0,0.25)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6600] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9333ea] rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
      </div>
      
      <div className="relative z-10">
        {/* Hero Image Section */}
        {displayImage && (
          <div className="relative h-64 lg:h-80 overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
                <div className="text-white">Loading image...</div>
              </div>
            )}
            <ImageWithFallback 
              src={displayImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-transparent"></div>
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <Badge 
                  variant={isPublic ? "default" : "secondary"}
                  className={`${
                    isPublic 
                      ? "bg-[#ff6600] text-white hover:bg-[#ff6600]/80" 
                      : "bg-gray-600 text-white hover:bg-gray-600/80"
                  } px-4 py-2 text-sm`}
                >
                  {groupType}
                </Badge>
                <div className="flex items-center gap-2 text-[#ff6600]">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{memberCount}/{maxMembers} members</span>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl text-white mb-6 leading-tight">{title}</h1>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-[rgba(255,102,0,0.15)]">
              <div className="w-10 h-10 bg-[#ff6600]/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#ff6600]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Destination</p>
                <p className="text-white font-medium">{destination}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-[rgba(255,102,0,0.15)]">
              <div className="w-10 h-10 bg-[#ff6600]/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#ff6600]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date Range</p>
                <p className="text-white font-medium">{dateRange}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-[rgba(255,102,0,0.15)]">
              <div className="w-10 h-10 bg-[#ff6600]/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#ff6600]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Timezone</p>
                <p className="text-white font-medium">{timezone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-[rgba(255,102,0,0.15)]">
              <div className="w-10 h-10 bg-[#ff6600]/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#ff6600]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-medium">{location}</p>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <p className="text-gray-400 text-sm mb-4">Trip Interests</p>
            <div className="flex flex-wrap gap-3">
                <InterestsPill interests={interests} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}