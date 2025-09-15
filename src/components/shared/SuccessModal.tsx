import { PopupCard } from "@/components/ui/popup-card";
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from "lucide-react";

export interface SuccessModalProps {
  isOpen: boolean;
  actionType?: 'join' | 'leave' | 'profile' | 'login' | 'signup' | 'group-create' | 'generic';
  onClose?: () => void;
  // Override defaults for custom messages
  customTitle?: string;
  customMessage?: string;
  customIcon?: React.ReactNode;
  customIconColor?: string;
  customIconTextColor?: string;
  // Auto-close configuration
  autoCloseDuration?: number; // in milliseconds, 0 to disable
}

export function SuccessModal({ 
  isOpen, 
  actionType = 'generic', 
  onClose,
  customTitle,
  customMessage,
  customIcon,
  customIconColor,
  customIconTextColor,
  autoCloseDuration = 0
}: SuccessModalProps) {
  
  const getSuccessContent = () => {
    // Return custom content if provided
    if (customTitle || customMessage) {
      return {
        title: customTitle || 'Success! 🎉',
        message: customMessage || 'Operation completed successfully!',
        iconColor: customIconColor || 'bg-green-500/20 border-green-500/40',
        iconTextColor: customIconTextColor || 'text-green-400'
      };
    }

    // Default content based on action type
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
      case 'profile':
        return {
          title: 'Profile Updated! 🎉',
          message: 'Your profile has been updated successfully! Redirecting you back to the home page...',
          iconColor: 'bg-green-500/20 border-green-500/40',
          iconTextColor: 'text-green-400'
        };
      case 'login':
        return {
          title: 'Login Successful!',
          message: 'Welcome back! Redirecting you to the home page...',
          iconColor: 'bg-green-500/20 border-green-500/40',
          iconTextColor: 'text-green-400'
        };
      case 'signup':
        return {
          title: 'Sign Up Successful! 🎉',
          message: 'Welcome to our community! Redirecting you to the login page...',
          iconColor: 'bg-green-500/20 border-green-500/40',
          iconTextColor: 'text-green-400'
        };
      case 'group-create':
        return {
          title: 'Group Created Successfully! 🎉',
          message: 'Your travel group has been created! Redirecting you to the group page...',
          iconColor: 'bg-green-500/20 border-green-500/40',
          iconTextColor: 'text-green-400'
        };
      default: // 'generic'
        return {
          title: 'Success! 🎉',
          message: 'Operation completed successfully!',
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
                    {customIcon || <CheckCircle2 className={`w-10 h-10 ${content.iconTextColor}`} />}
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

                  {/* Progress indicator - only show for auto-close */}
                  {autoCloseDuration > 0 && (
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
                        transition={{ 
                          delay: 0.6, 
                          duration: (autoCloseDuration - 600) / 1000, 
                          ease: "easeInOut" 
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}