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
import BlogSearchBar, { BlogFilterReq } from "@/components/blog/BlogSearchBar";
import BlogSearchResults from "@/components/blog/BlogSearchResults";
import { Plus, Search, BookOpen } from "lucide-react";

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
    const [showSearch, setShowSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    const handleBlogSearch = async (filters: BlogFilterReq) => {
        setSearchLoading(true);
        
        // Mock search results - replace with actual API call
        const mockResults = [
            {
                blog_id: "search1",
                title: "Best Travel Destinations 2024",
                description: "Explore the most amazing travel destinations for the upcoming year. From hidden gems to popular hotspots.",
                tag_ids: [1, 2, 5],
                author_id: "author1",
                author_name: "Travel Expert",
                created_at: new Date().toISOString()
            },
            {
                blog_id: "search2",
                title: "Budget Backpacking Guide",
                description: "Complete guide to backpacking on a budget. Tips, tricks, and essential advice for budget-conscious travelers.",
                tag_ids: [6, 9, 1],
                author_id: "author2", 
                author_name: "Budget Traveler",
                created_at: new Date().toISOString()
            }
        ];
        
        // Simulate API delay
        setTimeout(() => {
            setSearchResults(mockResults);
            setSearchLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            
            <FloatingElements />
            
            <div className="relative z-10 max-w-6xl mx-auto px-8 pb-8">

                {/* Enhanced Header with Search Toggle */}
                <section className="mt-8 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Travel Blog</h1>
                            <p className="text-gray-300">Discover amazing travel stories and share your own adventures</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center gap-2 ${
                                    showSearch 
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-300' 
                                        : 'bg-gray-800/70 border-orange-500/30 text-orange-300 hover:border-orange-500'
                                }`}
                            >
                                <Search className="w-4 h-4" />
                                {showSearch ? 'Hide Search' : 'Search Blogs'}
                            </button>
                            <a 
                                href="/blog/create" 
                                className="bg-orange-500 hover:bg-orange-600 rounded-lg px-6 flex items-center gap-2 text-sm font-bold transition-all hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                Create Blog
                            </a>
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                {showSearch && (
                    <section className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Search Sidebar */}
                            <div className="lg:col-span-1">
                                <BlogSearchBar 
                                    onSearch={handleBlogSearch}
                                    loading={searchLoading}
                                    placeholder="Search all blogs..."
                                    showTypeToggle={true}
                                />
                            </div>
                            
                            {/* Search Results */}
                            <div className="lg:col-span-2">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Search Results
                                    </h3>
                                </div>
                                <BlogSearchResults
                                    blogs={searchResults}
                                    loading={searchLoading}
                                    showAuthor={true}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Access to All Blogs */}
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-gray-800/60 to-orange-900/30 rounded-xl p-6 border border-orange-500/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-orange-300 mb-2">Explore All Blogs</h3>
                                <p className="text-gray-400">Browse through all travel stories and find inspiration for your next adventure</p>
                            </div>
                            <a
                                href="/blog/search"
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Browse All Blogs
                            </a>
                        </div>
                    </div>
                </section>

                {/* Blog listing (user's written blogs) */}
                <section className="mt-8">
                    <div className="flex flex-row justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-1">Your Blogs</h2>
                            <p className="text-gray-400">Manage and edit your travel stories</p>
                        </div>
                    </div>
                    <BlogList currentUser={currentUser}/>
                </section>
            </div>
        </div>
    );
}
