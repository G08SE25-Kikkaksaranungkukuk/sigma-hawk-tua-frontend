import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Plane, Menu } from 'lucide-react';
import { APP_CONFIG } from '../../config/shared';
import { ProfileDropdown } from './ProfileDropdown';
import { useCurrentUser } from '../../lib/hooks/user/useCurrentUser';

interface AppHeaderProps {
  onEditProfileClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
  // Optional props for fallback data if hook fails
  firstName?: string;
  middleName?: string;
  lastName?: string;
  userEmail?: string;
  // Optional prop to force refetch on external changes
  triggerRefresh?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onEditProfileClick,
  onLogoutClick,
  onHomeClick,
  firstName: fallbackFirstName = "",
  middleName: fallbackMiddleName = "", 
  lastName: fallbackLastName = "",
  userEmail: fallbackUserEmail = "",
  triggerRefresh = false
}) => {
  // Use the useCurrentUser hook to fetch and manage user data
  const { currentUser, loading, error, refreshCurrentUser, isAuthenticated } = useCurrentUser();
  
  // Add a key to force re-render of profile image when it changes
  const [imageKey, setImageKey] = useState(Date.now());

  // Trigger refresh when triggerRefresh prop changes
  useEffect(() => {
    if (triggerRefresh) {
      refreshCurrentUser().then(() => {
        // Force image re-render by updating the key
        setImageKey(Date.now());
      });
    }
  }, [triggerRefresh, refreshCurrentUser]);

  // Additional safety net: check localStorage on mount for profile updates
  useEffect(() => {
    const checkForProfileUpdate = () => {
      const profileUpdated = localStorage.getItem('profileUpdated');
      if (profileUpdated === 'true') {
        refreshCurrentUser().then(() => {
          // Force image re-render by updating the key
          setImageKey(Date.now());
        });
        localStorage.removeItem('profileUpdated');
      }
    };

    checkForProfileUpdate();
  }, [refreshCurrentUser]);

  // Update image key when currentUser profile image changes
  useEffect(() => {
    if (currentUser?.profileImage) {
      console.log('AppHeader: Profile image updated:', currentUser.profileImage);
      setImageKey(Date.now());
    }
  }, [currentUser?.profileImage]);

  // Use data from hook if available, otherwise fall back to props
  const firstName = currentUser?.firstName || fallbackFirstName;
  const middleName = currentUser?.middleName || fallbackMiddleName;
  const lastName = currentUser?.lastName || fallbackLastName;
  const userEmail = currentUser?.email || fallbackUserEmail;
  const profileImage = currentUser?.profileImage;

  // Create cache-busted image URL
  const profileImageWithKey = profileImage ? `${profileImage}&key=${imageKey}` : undefined;

  const fullName = firstName && lastName ? `${firstName} ${middleName} ${lastName}`.trim() : 
                  loading ? "Loading..." : 
                  error ? "Error loading user" : "User";

  return (
    <nav className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
            <Plane className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">
            {APP_CONFIG.APP_NAME}
          </span>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {APP_CONFIG.NAV_LINKS.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              className="text-orange-300 hover:text-orange-400"
            >
              {link.label}
            </Button>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* User Name Display */}
          <span className="hidden md:block text-orange-300 font-medium">
            {fullName}
          </span>
          <ProfileDropdown 
            onEditProfileClick={onEditProfileClick} 
            onLogoutClick={onLogoutClick}
            userName={firstName}
            userEmail={userEmail}
            userImage={profileImageWithKey}
            onRefreshUser={refreshCurrentUser}
          />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-orange-400 hover:bg-orange-500/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
