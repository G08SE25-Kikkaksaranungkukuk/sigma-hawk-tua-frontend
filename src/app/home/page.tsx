"use client";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { AppHeader } from "../../components/shared";
import { AppIntro, AppStats, YourGroupsSection } from "../../components/home";
import { useUserGroups, useGroupSearch } from "../../lib/hooks/home";
import { useCurrentUser } from "../../lib/hooks/user";
import { Group } from "../../lib/types/home";
import {
    Plane,
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

export default function homePage() {
    const router = useRouter();
    const { groups, loading, error, refreshGroups } = useUserGroups();
    const { currentUser, loading: userLoading, error: userError } = useCurrentUser();
    const { searchGroups } = useGroupSearch();

    const handleProfileClick = () => {
        router.push('/profile/edit');
    };

    const handleCreateGroup = () => {
        // TODO: Implement create group modal or navigate to create group page
        console.log('Create group clicked');
    };

    const handleViewGroup = (group: Group) => {
        // TODO: Navigate to group detail page
        console.log('View group:', group);
    };

    const handleLogout = () => {
        // Clear auth token or session if needed
        localStorage.removeItem("token");
        // Redirect to login page
        router.push("/login");
    };

    const handleSearchGroups = () => {
        // TODO: Navigate to search groups page
        router.push('/groupSearch');
        console.log('Navigate to search groups page');
    };

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Navigation Bar */}
            <AppHeader 
                onEditProfileClick={handleProfileClick} 
                onLogoutClick={handleLogout}
                firstName={currentUser?.firstName}
                middleName={currentUser?.middleName}
                lastName={currentUser?.lastName}
                userEmail={currentUser?.email}
            />

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
                        onCreateGroup={handleCreateGroup}
                        onViewGroup={handleViewGroup}
                        onSearchGroups={handleSearchGroups}
                    />
                </div>

                {/* Bottom stats */}
                <AppStats />
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-t border-orange-500/20 mt-12">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-black" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    TravelMatch
                                </span>
                            </div>
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
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Discover Groups
                                </a>
                                <a
                                    href="#"
                                    className="block text-orange-300/80 hover:text-orange-400 text-sm transition-colors"
                                >
                                    Create Group
                                </a>
                                <a
                                    href="#"
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
                                    href="#"
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
                            © 2025 TravelMatch. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="text-orange-300/60 hover:text-orange-400 text-sm transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
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
        </div>
    );
}
