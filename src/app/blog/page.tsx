"use client";

import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search } from 'lucide-react';
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
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState<{ [key: string]: boolean }>({ travel: true, tips: true, news: true });
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

                {/* Centered search group (navigates to /blog/search) */}
                <div className="w-full py-6">
                    <div className="max-w-3xl mx-auto flex items-center gap-3">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search posts, tags, or authors..."
                            aria-label="Search blog"
                            className="!h-10 flex-1"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0"
                            aria-label="Execute search"
                            onClick={() => {
                                const activeFilters = Object.keys(filters).filter(k => filters[k]);
                                const params = new URLSearchParams();
                                if (query) params.set('q', query);
                                if (sortBy) params.set('sort', sortBy);
                                if (activeFilters.length) params.set('filters', activeFilters.join(','));
                                router.push(`/blog/search?${params.toString()}`);
                            }}
                        >
                            <Search className="w-4 h-4 text-white" />
                        </Button>

                        <div className="w-44">
                            <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="popular">Most popular</SelectItem>
                                    <SelectItem value="comments">Most commented</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

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