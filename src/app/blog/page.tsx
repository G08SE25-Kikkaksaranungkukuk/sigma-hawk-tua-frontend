"use client";

import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, Filter, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AppIntro, AppStats, YourGroupsSection } from "@/components/home";
import { useUserGroups } from "@/lib/hooks/home";
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

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function blogHomePage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState<{ [key: string]: boolean }>({ travel: true, tips: true, news: true });
    const [showFilters, setShowFilters] = useState(false);
    const [interestIds, setInterestIds] = useState<number[]>([]);

    const toggleInterest = (id: number) => {
        setInterestIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    };
    const { groups, loading, error, refreshGroups } = useUserGroups();
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();

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

                {/* Back to Blog Feed Button */}
                <div className="pt-6 pb-4">
                    <button
                        onClick={() => router.push('/blogfeed')}
                        className="flex items-center gap-2 text-orange-300 hover:text-orange-400 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Blog Feed</span>
                    </button>
                </div>

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
                                const params = new URLSearchParams();
                                if (query) params.set('keyword', query);
                                if (sortBy) params.set('sort_by', sortBy);
                                if (interestIds.length) params.set('interest_id', interestIds.join(','));
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
                                    <SelectItem value="most_like">Most like</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters((s) => !s)}
                                className="h-10 px-3"
                                aria-expanded={showFilters}
                                aria-controls="blog-home-filters"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                <span className="text-sm">Filters</span>
                                <span className="ml-2">{showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters panel under the search box */}
                <div className="max-w-3xl mx-auto mb-4">
                    <div
                        id="blog-home-filters"
                        className={`mt-4 p-4 border border-white/10 rounded-md bg-white/5 transition-all w-full ${showFilters ? 'block' : 'hidden'}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="text-sm text-gray-300">Filter posts by interest</div>
                            </div>
                            <div className="ml-4">
                                <Button size="sm" onClick={() => { setInterestIds([]); setSortBy('newest'); }} variant="outline">Reset</Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 1, label: '🌊 Sea' },
                                { id: 2, label: '⛰️ Mountain' },
                                { id: 3, label: '💧 Waterfall' },
                                { id: 4, label: '🏞️ National Park' },
                                { id: 5, label: '🏝️ Island' },
                                { id: 6, label: '🙏 Temple' },
                                { id: 7, label: '🛍️ Shopping Mall' },
                                { id: 8, label: '🏪 Market' },
                                { id: 9, label: '☕ Cafe' },
                                { id: 10, label: '🏛️ Historical' },
                                { id: 11, label: "🎢 Amusement Park" },
                                { id: 12, label: "🦁 Zoo"},
                                { id: 13, label: "🎉 Festival"},
                                { id: 14, label: "🏛️ Museum"},
                                { id: 15, label: "🍴 Food Street"},
                                { id: 16, label: "🍹 Beach Bar"},
                                { id: 17, label: "🎭 Theatre"},
                            ].map((it) => (
                                <button
                                    key={it.id}
                                    type="button"
                                    onClick={() => toggleInterest(it.id)}
                                    className="px-2 py-1 rounded-full border-2 text-xs font-medium transition-all"
                                >
                                    <span className={`${interestIds.includes(it.id) ? 'bg-orange-500 text-black border-transparent shadow-lg orange-glow px-2 py-1 rounded-full' : 'bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 px-2 py-1 rounded-full'}`}>
                                        {it.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog creation for writers */}

                {/* Blog listing (user's written blogs) */}
                <section className="mt-8">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Blogs</h2>
                    <div className="flex gap-3">
                        <a href="/blogfeed" className="bg-gray-700 hover:bg-gray-600 rounded-md px-6 flex flex-row items-center justify-center gap-1 text-sm font-bold text-white transition-colors">
                            <Search className="w-4 h-4" />
                            Blog Feed
                        </a>
                        <a href="/blog/create" className="bg-orange-500 hover:bg-orange-600 rounded-md px-6 flex flex-row items-center justify-center gap-1 text-sm font-bold transition-colors">
                            <Plus className="w-4 h-4" />
                            Create Blog
                        </a>
                    </div>
                    </div>
                    <BlogList currentUser={currentUser}/>
                </section>
            </div>
        </div>
    );
}
