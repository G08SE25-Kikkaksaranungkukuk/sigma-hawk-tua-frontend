import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';
import { PopupCard } from "@/components/ui/popup-card";
import { Share, Info, Settings, LogOut, CheckCircle2 } from "lucide-react";
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
  const getSuccessContent = () => {
    switch (actionType) {
      case 'join':
        return {
          title: 'Welcome to the Group! 🎉',
          message: 'You have successfully joined the group. Get ready for an amazing travel experience!',
          iconColor: 'bg-blue-500/20 border-blue-500/40',
          iconTextColor: 'text-blue-400'
        };
      case 'leave':
        return {
          title: 'Left Successfully! 👋',
          message: 'You have successfully left the group. We hope you had a great experience!',
          iconColor: 'bg-red-500/20 border-red-500/40',
          iconTextColor: 'text-red-400'
        };
      default: // 'profile'
        return {
          title: 'Successfully! 🎉',
          message: 'Your profile has been updated! Redirecting you back to the home page...',
          iconColor: 'bg-green-500/20 border-green-500/40',
          iconTextColor: 'text-green-400'
        };
    }
  };

  const content = getSuccessContent();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            className="flex items-center justify-center p-6 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 30, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30, 
                mass: 0.8,
                duration: 0.5
              }}
              className="w-full max-w-xl mx-4"
            >
              <PopupCard className="w-full bg-slate-900/98 border-2 border-orange-500/50 shadow-2xl backdrop-blur-md ring-1 ring-orange-500/20">
                <div className="p-10 flex flex-col items-center gap-8 text-center">
                  {/* Success Icon with animation */}
                  <motion.div 
                    className={`flex items-center justify-center w-20 h-20 rounded-full ${content.iconColor}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className={`w-10 h-10 ${content.iconTextColor}`} />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="space-y-4 max-w-md">
                    <motion.h2 
                      className="text-3xl font-bold text-orange-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {content.title}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-300 text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {content.message}
                    </motion.p>
                  </div>

                  {/* Progress indicator */}
                  <motion.div 
                    className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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