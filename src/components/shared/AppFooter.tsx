"use client";
import React from 'react';
import { Button } from '../ui/button';
import { Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { APP_CONFIG } from '../../config/shared';

export const AppFooter: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/home');
  };

  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-orange-500/20">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Plane className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                {APP_CONFIG.APP_NAME}
              </span>
            </button>
            <p className="text-orange-300/80 text-sm leading-relaxed mb-4">
              Connect with fellow travelers, discover amazing
              destinations, and create unforgettable memories
              together. Your perfect travel companion is just
              a click away.
            </p>
            <div className="flex gap-4">
              <Button
                size="sm"
                className="bg-orange-500 text-black hover:bg-orange-600"
              >
                Join Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-500 text-orange-400"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="/group/search"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Discover Groups
              </a>
              <a
                href="/group/create"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Create Group
              </a>
              <a
                href="/profile/edit"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                My Profile
              </a>
              <a
                href="#"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Messages
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-4">
              Support
            </h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Safety Tips
              </a>
              <a
                href="#"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/signup/privacyPolicy"
                className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-500/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-orange-300/60 text-sm">
            © 2025 {APP_CONFIG.APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/signup/termsOfService"
              className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/signup/privacyPolicy"
              className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};