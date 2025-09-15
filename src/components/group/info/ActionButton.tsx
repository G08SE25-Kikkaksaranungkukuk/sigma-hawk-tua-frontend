import { Button } from "@/components/ui/button";
import { Share, Info, Settings, LogOut } from "lucide-react";

interface ActionButtonsProps {
  userRole: 'host' | 'member' | 'visitor';
  onManageGroup?: () => void;
  onJoinGroup?: () => void;
  onLeaveGroup?: () => void;
  onViewInfo?: () => void;
  onShare?: () => void;
}

export function ActionButtons({ 
  userRole, 
  onManageGroup, 
  onJoinGroup, 
  onLeaveGroup, 
  onViewInfo, 
  onShare 
}: ActionButtonsProps) {
  const renderPrimaryButton = () => {
    switch (userRole) {
      case 'host':
        return (
          <Button 
            onClick={onManageGroup}
            className="w-full bg-[#ff6600] hover:bg-[#ff6600]/80 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Group
          </Button>
        );
      case 'member':
        return (
          <Button 
            onClick={onLeaveGroup}
            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Group
          </Button>
        );
      case 'visitor':
        return (
          <Button 
            onClick={onJoinGroup}
            className="w-full bg-[#ff6600] hover:bg-[#ff6600]/80 text-white"
          >
            Join Group
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {renderPrimaryButton()}
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          onClick={onViewInfo}
          className="w-full border-gray-600 bg-transparent text-gray-300 hover:bg-[rgba(255,102,0,0.1)] hover:border-[#ff6600]"
        >
          <Info className="w-4 h-4 mr-2" />
          View Group Info
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onShare}
          className="w-full border-gray-600 bg-transparent text-gray-300 hover:bg-[rgba(255,102,0,0.1)] hover:border-[#ff6600]"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}