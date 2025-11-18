"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Plane, Menu, Home, Users, User, Search, PenTool } from 'lucide-react';
import { APP_CONFIG } from '../../config/shared';
import { ProfileDropdown } from './ProfileDropdown';
import { useCurrentUser } from '../../lib/hooks/user/useCurrentUser';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Get current pathname for active state tracking
  const pathname = usePathname();
  
  // Add a key to force re-render of profile image when it changes
  const [imageKey, setImageKey] = useState(Date.now());
  
  // Track hover state for enhanced interactions
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Enhanced navigation items with proper routes and icons - Fixed 3 main sections
  const navigationItems = [
    {
      label: 'Home',
      href: '/home',
      icon: Home,
      isActive: pathname === '/' || pathname === '/home',
    },
    {
      label: 'Groups',
      href: '/group/search',
      icon: Search,
      isActive: pathname.startsWith('/group'),
    },
    {
      label: 'Blog',
      href: '/blogfeed',
      icon: PenTool,
      isActive: pathname.startsWith('/blog') || pathname.startsWith('/blogfeed'),
    },
  ];

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

  // Get current page title for breadcrumb awareness
  const getCurrentPageTitle = () => {
    if (pathname === '/' || pathname === '/home') return 'Home';
    if (pathname.startsWith('/group')) {
      if (pathname.includes('/search')) return 'Find Groups';
      if (pathname.includes('/create')) return 'Create Group';
      if (pathname.includes('/manage')) return 'Manage Group';
      return 'Groups';
    }
    if (pathname.startsWith('/blog') || pathname.startsWith('/blogfeed')) {
      if (pathname.includes('/create')) return 'Create Blog';
      if (pathname === '/blogfeed') return 'Blog Feed';
      return 'Blog';
    }
    if (pathname.startsWith('/profile')) {
      if (pathname.includes('/edit')) return 'Edit Profile';
      return 'Profile';
    }
    if (pathname.startsWith('/login')) return 'Login';
    if (pathname.startsWith('/signup')) return 'Sign Up';
    return 'Dashboard';
  };

  return (
    <>
      {/* Enhanced Navigation Bar with Motion UI */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-orange-500/20 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Enhanced Logo with Motion */}
          <motion.button 
            onClick={onHomeClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer relative"
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center"
              whileHover={{ 
                boxShadow: "0 0 20px rgba(249, 115, 22, 0.6)",
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 0.3 }}
            >
              <Plane className="w-5 h-5 text-black" />
            </motion.div>
            <span className="text-xl font-bold text-white">
              {APP_CONFIG.APP_NAME}
            </span>
          </motion.button>

          {/* Enhanced Navigation Links with Active State Indicators */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.a
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      item.isActive 
                        ? 'text-orange-400 bg-orange-500/10' 
                        : 'text-orange-300 hover:text-orange-400 hover:bg-orange-500/5'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active State Indicator */}
                    {item.isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-orange-500/20 rounded-lg border border-orange-500/30"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover Effect */}
                    {hoveredItem === item.label && !item.isActive && (
                      <motion.div
                        className="absolute inset-0 bg-orange-500/10 rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.a>
                  
                  {/* Tooltip for better UX */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md border border-orange-500/20"
                      >
                        {item.label}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-orange-500/20"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Right Side with Motion */}
          <div className="flex items-center gap-3">
            {/* Current Page Indicator */}
            
            {/* User Name Display with Animation */}
            <motion.span 
              className="hidden md:block text-orange-300 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {fullName}
            </motion.span>
            
            {/* Enhanced Profile Dropdown */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ProfileDropdown 
                onEditProfileClick={onEditProfileClick} 
                onLogoutClick={onLogoutClick}
                userName={firstName}
                userEmail={userEmail}
                userImage={profileImageWithKey}
                onRefreshUser={refreshCurrentUser}
              />
            </motion.div>
            
            {/* Enhanced Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-orange-400 hover:bg-orange-500/10"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Progress Bar for Content Awareness */}
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.nav>
      
    </>
  );
};
