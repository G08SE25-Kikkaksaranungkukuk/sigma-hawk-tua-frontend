import { Users, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GroupHeroProps {
  groupData: {
    group_name: string;
    description: string | null;
    profile_url: string | null;
    created_at: Date;
  };
  memberCount: number;
  maxMembers: number;
}

export function GroupHero({ groupData, memberCount, maxMembers }: GroupHeroProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="relative w-full mb-8">
      {/* Banner Image */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 via-orange-400/10 to-[#12131a]">
        {groupData.profile_url ? (
          <img
            src={groupData.profile_url}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/60 to-transparent" />
      </div>

      {/* Group Information */}
      <div className="relative -mt-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">{groupData.group_name}</h1>
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
  );
}
