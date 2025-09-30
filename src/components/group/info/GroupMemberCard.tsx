import { Users, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Member {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  isHost?: boolean;
}

interface GroupMembersCardProps {
  members: Member[];
  totalMembers: number;
  maxMembers: number;
}

export function GroupMembersCard({ members, totalMembers, maxMembers }: GroupMembersCardProps) {
  return (
    <Card className="bg-[#12131a] border-[rgba(255,102,0,0.25)] rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5 text-[#ff6600]" />
          Group Members
          <Badge 
            variant="secondary" 
            className="bg-[rgba(255,102,0,0.15)] text-[#ff6600] border border-[rgba(255,102,0,0.3)] ml-auto"
          >
            {totalMembers}/{maxMembers}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Members List */}
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,102,0,0.05)] border border-[rgba(255,102,0,0.1)] hover:bg-[rgba(255,102,0,0.1)] transition-colors">
              {/* Member Avatar */}
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-[#ff6600]/20">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-[#ff6600]/80 text-white text-sm">
                    {member.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium truncate">{member.name}</h4>
                  {member.isHost && (
                    <Badge 
                      variant="secondary" 
                      className="bg-[#ff6600] text-white text-xs px-1.5 py-0.5 h-auto"
                    >
                      Host
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {member.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Members Indicator */}
        {totalMembers > members.length && (
          <div className="text-center pt-2 border-t border-[rgba(255,102,0,0.25)]">
            <p className="text-gray-400 text-sm">
              +{totalMembers - members.length} more member{totalMembers - members.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Available Spots */}
        {totalMembers < maxMembers && (
          <div className="bg-[rgba(255,102,0,0.1)] border border-[rgba(255,102,0,0.2)] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {maxMembers - totalMembers} spot{maxMembers - totalMembers !== 1 ? 's' : ''} available
                </p>
                <p className="text-gray-400 text-sm">Join this amazing group trip!</p>
              </div>
              <div className="w-12 h-12 bg-[rgba(255,102,0,0.2)] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#ff6600]" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}