"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppIntro, AppStats, YourGroupsSection } from "@/components/home";
import { useUserGroups, useGroupSearch } from "@/lib/hooks/home";
import { useCurrentUser } from "@/lib/hooks/user";
import { FloatingElements }  from "@/components/shared"
import HeroSection from "@/components/home/HeroSection";

import {
    handleProfileClick,
    handleCreateGroup,
    handleViewGroup,
    handleLogout,
    handleSearchGroups,
} from "@/components/home/homeHandlers";

export default function homePage() {
    const router = useRouter();
    const { groups, loading, error, refreshGroups } = useUserGroups();
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();
    const { searchGroups } = useGroupSearch();

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            
            <FloatingElements />
            <HeroSection />
            {/* App Introduction */}
            <AppIntro />

            {/* Main Content */}
            <main className="relative z-10 max-w-6xl mx-auto px-8">
                {/* Your Groups Section - 1/3 Width */}
                <div className="w-1/2 mx-auto">
                    <YourGroupsSection
                        groups={groups}
                        loading={loading}
                        error={error}
                        onCreateGroup={() => handleCreateGroup(router)}
                        onViewGroup={(group) => handleViewGroup(router, group)}
                        onSearchGroups={() => handleSearchGroups(router)}
                    />
                </div>
            </main>

            <div className="relative z-10 max-w-6xl mx-auto px-8 pb-8">
            </div>
        </div>
    );
}
