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

import { useState } from "react";
import BlogForm from "@/components/blog/BlogForm";
import BlogList from "@/components/blog/BlogList";
import { Plus } from "lucide-react";

// ...existing code...
export default function blogHomePage() {
    const router = useRouter();
    const { groups, loading, error, refreshGroups } = useUserGroups();
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();
    const { searchGroups } = useGroupSearch();

    const [refreshBlogs, setRefreshBlogs] = useState(0);

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
            
            <div className="relative z-10 max-w-6xl mx-auto px-8 pb-8">

                {/* Blog creation for writers */}

                {/* Blog listing (user's written blogs) */}
                <section className="mt-8">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Blogs</h2>
                    <a href="/blog/create" className="bg-orange-500 hover:bg-orange-600 rounded-md px-6 flex flex-row items-center justify-center gap-1 text-sm font-bold">
                        <Plus></Plus>
                        Create Blog
                    </a>
                    </div>
                    <BlogList currentUser={currentUser}/>
                </section>
            </div>
        </div>
    );
}
// ...existing code...