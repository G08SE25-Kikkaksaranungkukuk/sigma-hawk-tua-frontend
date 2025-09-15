"use client";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { AppIntro, AppStats, YourGroupsSection } from "../../components/home";
import { useUserGroups, useGroupSearch } from "../../lib/hooks/home";
import { useCurrentUser } from "../../lib/hooks/user";
import { Group } from "../../lib/types/home";
import {
    Heart,
    Users,
    Search,
    Plus,
    MapPin,
    Camera,
    Globe,
    Bell,
    Settings,
    User,
    Menu,
} from "lucide-react";
import {
    handleProfileClick,
    handleCreateGroup,
    handleViewGroup,
    handleLogout,
    handleSearchGroups,
} from "../../components/home/homeHandlers";

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
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
                <div className="absolute top-40 right-20 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
                <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
                <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/25 rounded-full float"></div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-orange-500/15 rounded-full float-delayed"></div>

                {/* Floating icons */}
                <div className="absolute top-32 right-32 text-orange-500/30 float-delayed">
                    <Heart className="w-8 h-8" />
                </div>
                <div className="absolute top-1/3 right-16 text-orange-500/30 float">
                    <Globe className="w-5 h-5" />
                </div>
            </div>

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

            {/* Stats positioned at bottom, right above footer */}
            <div className="relative z-10 max-w-6xl mx-auto px-8 pb-8">
                <AppStats />
            </div>
        </div>
    );
}
