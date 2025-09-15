"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
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
  const { currentUser, loading } = useCurrentUser();
  
  // Define pages where header should not be shown
  const pagesWithoutHeader = ['/login', '/signup', '/'];

  const showHeader = !pagesWithoutHeader.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
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
            />
          )}
          <main className="flex-1 relative">
            {children}
          </main>
          {showHeader && !loading && <AppFooter />}
        </div>
      </body>
    </html>
  );
}
