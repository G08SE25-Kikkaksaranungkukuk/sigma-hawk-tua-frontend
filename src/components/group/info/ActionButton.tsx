import { Button } from "@/components/ui/button";
import { SuccessModal } from "@/components/shared/SuccessModal";
import { Share, Info, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface ActionButtonsProps {
  userRole: 'host' | 'member' | 'visitor';
  onManageGroup?: () => void;
  onJoinGroup?: () => void;
  onLeaveGroup?: () => void;
  onViewInfo?: () => void;
  onShare?: () => void;
  // External success state management
  showSuccess?: boolean;
  successType?: 'join' | 'leave' | 'profile';
  onShowSuccess?: (type: 'join' | 'leave' | 'profile') => void;
  onHideSuccess?: () => void;
}

interface ActionSuccessProps {
  isOpen: boolean;
  actionType?: 'join' | 'leave' | 'profile';
  onClose?: () => void;
}

export function ActionSuccess({ isOpen, actionType = 'profile', onClose }: ActionSuccessProps) {
  return (
    <SuccessModal
      isOpen={isOpen}
      actionType={actionType}
      onClose={onClose}
      autoCloseDuration={1500}
    />
  );
}

export function ActionButtons({ 
  userRole, 
  onManageGroup, 
  onJoinGroup, 
  onLeaveGroup, 
  onViewInfo, 
  onShare,
  showSuccess = false,
  successType = 'profile',
  onShowSuccess,
  onHideSuccess
}: ActionButtonsProps) {
  // Use internal state as fallback if external state management is not provided
  const [internalShowSuccess, setInternalShowSuccess] = useState(false);
  const [internalSuccessType, setInternalSuccessType] = useState<'join' | 'leave' | 'profile'>('profile');

  // Determine which state management to use
  const isShowSuccess = showSuccess || internalShowSuccess;
  const currentSuccessType = successType || internalSuccessType;
  
  // Auto-hide success modal after 3 seconds (fallback only)
  useEffect(() => {
    if (!onShowSuccess && internalShowSuccess) {
      const timer = setTimeout(() => {
        setInternalShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [internalShowSuccess, onShowSuccess]);

  const handleJoinGroup = async () => {
    try {
      if (onJoinGroup) {
        await onJoinGroup();
        // Only show internal success if external management is not provided
        if (onShowSuccess) {
          onShowSuccess('join');
        } else {
          setInternalSuccessType('join');
          setInternalShowSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      if (onLeaveGroup) {
        await onLeaveGroup();
        // Only show internal success if external management is not provided
        if (onShowSuccess) {
          onShowSuccess('leave');
        } else {
          setInternalSuccessType('leave');
          setInternalShowSuccess(true);
        }
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };
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
            onClick={handleLeaveGroup}
            className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Group
          </Button>
        );
      case 'visitor':
        return (
          <Button 
            onClick={handleJoinGroup}
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
    <>
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

      <ActionSuccess 
        isOpen={isShowSuccess} 
        actionType={currentSuccessType} 
        onClose={() => {
          if (onHideSuccess) {
            onHideSuccess();
          } else {
            setInternalShowSuccess(false);
          }
        }} 
      />
    </>
  );
}