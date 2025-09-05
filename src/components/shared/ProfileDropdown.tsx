"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  User,
  Settings,
  LogOut,
  Bookmark,
  HelpCircle,
  Shield,
  Bell,
} from 'lucide-react';

interface ProfileDropdownProps {
  onProfileClick: () => void;
  userImage?: string;
  userName?: string;
  userEmail?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onProfileClick,
  userImage,
  userName = "User",
  userEmail = "user@example.com",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  const handleSettings = () => {
    // TODO: Navigate to settings page
    console.log('Settings clicked');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notifications page
    console.log('Notifications clicked');
  };

  const handleBookmarks = () => {
    // TODO: Navigate to bookmarks page
    console.log('Bookmarks clicked');
  };

  const handleHelp = () => {
    // TODO: Navigate to help page
    console.log('Help clicked');
  };

  const handlePrivacySafety = () => {
    // TODO: Navigate to privacy & safety page
    console.log('Privacy & Safety clicked');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <button className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full cursor-pointer">
            <Avatar className="w-8 h-8 border-2 border-orange-500/20">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-black text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </DropdownMenuTrigger>
      
      <div>
        <DropdownMenuContent 
          className="w-56 bg-gray-900 border-orange-500/20 text-white" 
          align="end"
          sideOffset={8}
        >
          {/* User Info Section */}
          <div className="px-3 py-2 border-b border-orange-500/20">
            <p className="text-sm font-medium text-orange-300">{userEmail}</p>
          </div>

          {/* Profile Actions */}
          <DropdownMenuItem 
            onClick={onProfileClick}
            className="text-orange-300 cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Your Profile
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleBookmarks}
            className="text-orange-300 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Your Bookmarks
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleNotifications}
            className="text-orange-300 cursor-pointer"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-orange-500/20" />

          {/* Settings & Help */}
          <DropdownMenuItem 
            onClick={handleSettings}
            className="text-orange-300 cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handlePrivacySafety}
            className="text-orange-300 cursor-pointer"
          >
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Safety
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleHelp}
            className="text-orange-300 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & Support
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-orange-500/20" />

          {/* Logout */}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-400 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};