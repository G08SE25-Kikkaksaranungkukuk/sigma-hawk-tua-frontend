import { Users, Zap, MessageCircle, Shield, AlertCircle } from "lucide-react";
import { ActionButtons } from "./ActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { groupService } from "@/lib/services/group/group-service";
import { useState } from "react";
import TravelInviteModal from "@/components/TravelInviteModal";

interface GroupStatsCardProps {
  groupId?: string;
  userRole: 'host' | 'member' | 'visitor';
  members: {
    current: number;
    max: number;
  };
  spotsLeft: number;
  pace: string;
  languages: string[];
  onDataChange?: () => void;
}

export function GroupStatsCard({ groupId, userRole, members, spotsLeft, pace, languages, onDataChange }: GroupStatsCardProps) {
  const router = useRouter();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleManageGroup = () => {
    if (userRole === 'host') {
      router.push(`/group/${groupId}/manage`);
    } else if (userRole === 'member' || userRole === 'visitor') {
      router.push(`/group/${groupId}/info`);
    }
  };

  const handleJoinGroup = async () => {
    if (groupId && userRole === 'visitor') {
      try {
        await groupService.joinGroup(groupId);
        // Refresh the data by calling the parent's refetch function
        onDataChange?.();
      } catch (error) {
        console.error('Failed to join group:', error);
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (userRole === 'member' && groupId) {
      try {
        await groupService.leaveGroup(groupId);
        onDataChange?.();
      } catch (error) {
        console.error('Failed to leave group:', error);
      }
    }
  };

  const handleViewInfo = () => {
    if (groupId) {
      router.push(`/group/${groupId}/info`);
    }
  };

  const handleShare = () => {
    setIsInviteModalOpen(true);
  };

  const memberProgress = (members.current / members.max) * 100;

  return (
    <Card className="bg-[#12131a] border-[rgba(255,102,0,0.25)] rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#ff6600]" />
          Group Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Member Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Members</span>
            <span className="text-white font-medium">{members.current}/{members.max}</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div 
              className="h-full bg-[#ff6600] transition-all duration-300 ease-in-out rounded-full origin-left"
              style={{ transform: `scaleX(${Math.min(1, Math.max(0, memberProgress / 100))})` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-[#ff6600]" />
            <span className="text-gray-300">{spotsLeft} spots remaining</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/30 rounded-xl p-4 border border-[rgba(255,102,0,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#ff6600]" />
              <span className="text-gray-400 text-sm">Pace</span>
            </div>
            <p className="text-white font-medium">{pace}</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-4 border border-[rgba(255,102,0,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-[#ff6600]" />
              <span className="text-gray-400 text-sm">Languages</span>
            </div>
            <p className="text-white font-medium text-sm">{languages.slice(0, 2).join(', ')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[rgba(255,102,0,0.25)]">
          <ActionButtons
            userRole={userRole}
            onManageGroup={handleManageGroup}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
            onViewInfo={handleViewInfo}
            onShare={handleShare}
          />
        </div>

        {/* Safety Notice */}
        <div className="bg-black/20 rounded-xl p-4 border border-[rgba(255,102,0,0.15)]">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#ff6600] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-white text-sm font-medium mb-2">Safety First</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Always meet in public places and trust your instincts. Report any concerns to our support team.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Travel Invite Modal */}
      <TravelInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteLink={`${typeof window !== 'undefined' ? window.location.origin : ''}/group/${groupId}/info`}
      />
    </Card>
  );
}