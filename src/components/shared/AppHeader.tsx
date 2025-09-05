import React from 'react';
import { Button } from '../ui/button';
import { Plane, Menu } from 'lucide-react';
import { APP_CONFIG } from '../../config/shared';
import { ProfileDropdown } from './ProfileDropdown';

interface AppHeaderProps {
  onProfileClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onProfileClick }) => {
  return (
    <nav className="relative z-20 bg-gray-900/90 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
            <Plane className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">
            {APP_CONFIG.APP_NAME}
          </span>
        </div>

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
          <ProfileDropdown onProfileClick={onProfileClick} />
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
