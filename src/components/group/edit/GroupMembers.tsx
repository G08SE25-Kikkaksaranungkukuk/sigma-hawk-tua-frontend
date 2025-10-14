import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Crown, UserMinus, Search, UserPlus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import TravelInviteModal from "@/components/TravelInviteModal";
import { groupService } from "@/lib/services/group/group-service";
import { Member as APIMember } from "@/lib/types";

interface MemberWithOwner extends APIMember {
  isOwner?: boolean;
}

export function GroupMembers({ groupId, maxMembers }: { groupId: number; maxMembers: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<MemberWithOwner[]>([]);
  const [groupLeaderId, setGroupLeaderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState<string>("");

  // Fetch group members from backend
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        const groupData = await groupService.getGroupDetails(groupId.toString());
        
        // Process members to include isOwner flag
        const processedMembers = (groupData.members || []).map((member): MemberWithOwner => ({
          ...member,
          isOwner: member.user_id === groupData.group_leader_id
        }));
        
        setMembers(processedMembers);
        setGroupLeaderId(groupData.group_leader_id);
        
        // Set invite URL
        if (typeof window !== 'undefined') {
          setPageUrl(`${window.location.protocol}//${window.location.host}/group/${groupId}/info`);
        }
      } catch (error) {
        console.error("Failed to fetch group data:", error);
        toast.error("Failed to load group members");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const getFullName = (member: MemberWithOwner) => {
    return `${member.first_name} ${member.last_name}`;
  };

  const filteredMembers = members.filter(member => {
    const fullName = getFullName(member).toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleRemoveMember = async (userId: number) => {
    try {
      await groupService.removeMember(groupId.toString(), userId);
      
      setMembers(members.filter(m => m.user_id !== userId));
      toast.success("Member removed from group");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        if (error.response?.status === 403) {
          toast.error("Unauthorized: You don't have permission to remove members");
        } else {
          toast.error("Failed to remove member");
        }
      }
    }
  };

  const handleTransferOwnership = async (userId: number) => {
    try {
      await groupService.transferOwnership(groupId.toString(), userId);
      
      // Update local state
      const updatedMembers = members.map(m => ({
        ...m,
        isOwner: m.user_id === userId
      }));
      setMembers(updatedMembers);
      setGroupLeaderId(userId);
      
      toast.success("Ownership transferred successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        if (error.response?.status === 403) {
          toast.error("Unauthorized: Only the group leader can transfer ownership");
        } else {
          toast.error("Failed to transfer ownership");
        }
      }
    }
  };

  const getInitials = (member: MemberWithOwner) => {
    const firstInitial = member.first_name?.charAt(0) || '';
    const lastInitial = member.last_name?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const getAge = (birthDate?: Date | string): number | null => {
    if (!birthDate) return null;
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    if (isNaN(date.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-orange-400">Group Members</CardTitle>
              <CardDescription className="text-orange-200/80">
                {members.length} of {maxMembers} members
              </CardDescription>
            </div>
            <Button 
              onClick={() => setInviteOpen(true)}
              className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Generate Invite Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-300/70" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#1a1b23]/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-[#ff6600] focus:ring-[#ff6600]/30"
            />
          </div>

          {/* Member List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mb-4" />
                <p className="text-orange-200/60">Loading members...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
                <p className="text-orange-200/60">No members found</p>
              </div>
            ) : (
              filteredMembers.sort((a, b) => (a.isOwner ? -1 : 1)).map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 border border-gray-800/70 bg-[#1a1b23]/50 rounded-xl hover:bg-[#1a1b23]/80 hover:border-[#ff6600]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-orange-400/30">
                      <AvatarImage 
                        src={member.profile_url 
                          ? `http://localhost:6969/${member.profile_url}?t=${Date.now()}` 
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(member))}&background=ff6600&color=ffffff&size=128`
                        } 
                      />
                      <AvatarFallback className="bg-[#ff6600]/20 text-orange-300">{getInitials(member)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-200">{getFullName(member)}</span>
                        {member.isOwner && (
                          <Badge variant="default" className="gap-1 bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white border-none">
                            <Crown className="h-3 w-3" />
                            Leader
                          </Badge>
                        )}
                      </div>
                      <p className="text-orange-200/60 text-sm">
                        {member.email || 'No email'} {getAge(member.birth_date) ? `• ${getAge(member.birth_date)}Y` : ''}
                      </p>
                    </div>
                  </div>
                  {!member.isOwner && (
                    <div className="flex gap-2">
                      <TransferOwnershipDialog
                        memberName={getFullName(member)}
                        onConfirm={() => handleTransferOwnership(member.user_id)}
                      />
                      <RemoveMemberDialog
                        memberName={getFullName(member)}
                        onConfirm={() => handleRemoveMember(member.user_id)}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="bg-[#12131a]/90 backdrop-blur-sm border-gray-800/70 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-orange-400">Join Requests</CardTitle>
          <CardDescription className="text-orange-200/80">
            Pending requests to join your group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserPlus className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
            <p className="text-orange-200/60">No pending requests</p>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <TravelInviteModal 
        inviteLink={pageUrl} 
        isOpen={inviteOpen} 
        onClose={() => setInviteOpen(false)} 
      />
    </div>
  );
}

function TransferOwnershipDialog({ memberName, onConfirm }: { memberName: string; onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Transfer ownership"
        onClick={() => setIsOpen(true)}
        className="text-orange-300 hover:text-white hover:bg-[#ff6600]"
      >
        <Crown className="h-4 w-4" />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-[#12131a] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-400">Transfer Ownership</AlertDialogTitle>
            <AlertDialogDescription className="text-orange-200/70">
              Are you sure you want to transfer group ownership to <span className="font-semibold text-orange-300">{memberName}</span>? You will no longer be the group leader.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a1b23] border-gray-700 text-orange-300 hover:bg-[#1a1b23]/80 hover:text-orange-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white">
              Transfer Ownership
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RemoveMemberDialog({ memberName, onConfirm }: { memberName: string; onConfirm: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Remove member"
        onClick={() => setIsOpen(true)}
        className="text-orange-300 hover:text-white hover:bg-red-600"
      >
        <UserMinus className="h-4 w-4" />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-[#12131a] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-400">Remove Member</AlertDialogTitle>
            <AlertDialogDescription className="text-orange-200/70">
              Are you sure you want to remove {memberName} from this group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1a1b23] border-gray-700 text-orange-300 hover:bg-[#1a1b23]/80 hover:text-orange-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
