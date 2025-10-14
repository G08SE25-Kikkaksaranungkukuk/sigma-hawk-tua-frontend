import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Crown, UserMinus, Search, UserPlus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Member {
  user_id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  joined_at: Date;
  is_leader: boolean;
}

export function GroupMembers({ groupId, maxMembers }: { groupId: number; maxMembers: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([
    {
      user_id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar_url: null,
      joined_at: new Date("2024-01-15"),
      is_leader: true
    },
    {
      user_id: 2,
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar_url: null,
      joined_at: new Date("2024-02-20"),
      is_leader: false
    },
    {
      user_id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      avatar_url: null,
      joined_at: new Date("2024-03-10"),
      is_leader: false
    }
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = (userId: number) => {
    setMembers(members.filter(m => m.user_id !== userId));
    toast.success("Member removed from group");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <Button className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600] text-white shadow-lg shadow-[#ff6600]/25">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
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
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-orange-300/50 mb-4" />
                <p className="text-orange-200/60">No members found</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 border border-gray-800/70 bg-[#1a1b23]/50 rounded-xl hover:bg-[#1a1b23]/80 hover:border-[#ff6600]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-orange-400/30">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="bg-[#ff6600]/20 text-orange-300">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-200">{member.name}</span>
                        {member.is_leader && (
                          <Badge variant="default" className="gap-1 bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white border-none">
                            <Crown className="h-3 w-3" />
                            Leader
                          </Badge>
                        )}
                      </div>
                      <p className="text-orange-200/60 text-sm">{member.email}</p>
                    </div>
                  </div>
                  {!member.is_leader && (
                    <RemoveMemberDialog
                      memberName={member.name}
                      onConfirm={() => handleRemoveMember(member.user_id)}
                    />
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
    </div>
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
