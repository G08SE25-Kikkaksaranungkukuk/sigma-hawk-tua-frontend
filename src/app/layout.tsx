"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader, AppFooter } from "../components/shared";
import { useCurrentUser } from "../lib/hooks/user";
import { 
  handleProfileClick, 
  handleLogout,
  handleHomeClick
} from "../components/home/homeHandlers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  
  // Define pages where header should not be shown
  const pagesWithoutHeader = ['/login', '/signup', '/'];
  
  // Define pages that don't require authentication
  const publicPages = ['/login', '/signup', '/'];
  
  const showHeader = !pagesWithoutHeader.includes(pathname);
  const isPublicPage = publicPages.includes(pathname);
  
  // Call useCurrentUser but pass info about whether authentication is required
  const { currentUser, loading } = useCurrentUser();

  // Check if profile was updated and trigger refresh
  useEffect(() => {
    const profileUpdated = searchParams.get('profileUpdated');
    const localStorageFlag = localStorage.getItem('profileUpdated');
    
    if (profileUpdated === 'true' || localStorageFlag === 'true') {
      setTriggerRefresh(true);
      
      // Clean up the URL by removing the parameter
      if (profileUpdated === 'true') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('profileUpdated');
        window.history.replaceState({}, '', newUrl.toString());
      }
      
      // Clean up localStorage flag
      if (localStorageFlag === 'true') {
        localStorage.removeItem('profileUpdated');
      }
      
      // Reset trigger after a short delay
      setTimeout(() => {
        setTriggerRefresh(false);
      }, 100);
    }
  }, [searchParams]);

  // Additional check on component mount for localStorage flag
  useEffect(() => {
    const checkLocalStorage = () => {
      const localStorageFlag = localStorage.getItem('profileUpdated');
      if (localStorageFlag === 'true') {
        setTriggerRefresh(true);
        localStorage.removeItem('profileUpdated');
        setTimeout(() => {
          setTriggerRefresh(false);
        }, 100);
      }
    };

    // Check immediately on mount
    checkLocalStorage();

    // Also check when the window regains focus (helpful for navigation)
    const handleFocus = () => {
      checkLocalStorage();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen overflow-x-hidden`}
      >
        <div className="flex flex-col min-h-screen">
          {showHeader && !loading && (
            <AppHeader 
              onEditProfileClick={() => handleProfileClick(router)} 
              onLogoutClick={() => handleLogout(router)}
              onHomeClick={() => handleHomeClick(router)}
              firstName={currentUser?.firstName}
              middleName={currentUser?.middleName}
              lastName={currentUser?.lastName}
              userEmail={currentUser?.email}
              triggerRefresh={triggerRefresh}
            />
          )}
          <main className={`flex-1 relative ${showHeader && !loading ? 'pt-20' : ''}`}>
            {children}
          </main>
          {showHeader && !loading && <AppFooter />}
        </div>
      </body>
    </html>
  );
}
