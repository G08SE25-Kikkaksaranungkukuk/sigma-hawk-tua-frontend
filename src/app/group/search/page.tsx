"use client";
import React, { useState } from "react";
import { Sparkles, Users, MapPin } from "lucide-react";

// backend integration will be added later
const mockGroups = [
    { id: 1, name: "Math Study Group", tags: ["Adventure", "Culture"] },
    { id: 2, name: "Physics Enthusiasts", tags: ["Science", "Education"] },
    { id: 3, name: "Software Engineering Team", tags: ["Tech", "Education"] },
    { id: 4, name: "Literature Circle", tags: ["Culture", "Relaxation"] },
    { id: 5, name: "Beach Lovers", tags: ["Relaxation", "Adventure"] },
    { id: 6, name: "City Explorers", tags: ["Culture", "Tech"] },
    { id: 7, name: "Mountain Hikers", tags: ["Adventure", "Nature"] },
    { id: 8, name: "Foodies United", tags: ["Culture", "Education"] },
    { id: 9, name: "Budget Backpackers", tags: ["Adventure", "Tech"] },
    { id: 10, name: "Luxury Travelers", tags: ["Relaxation", "Culture"] },
    { id: 11, name: "History Buffs", tags: ["Culture", "Education"] },
    { id: 12, name: "Science Seekers", tags: ["Science", "Tech"] },
    { id: 13, name: "Art Lovers", tags: ["Culture", "Relaxation"] },
    { id: 14, name: "Adventure Addicts", tags: ["Adventure", "Tech"] },
    { id: 15, name: "Nature Enthusiasts", tags: ["Nature", "Relaxation"] },
    { id: 16, name: "Solo Travelers", tags: ["Adventure", "Culture"] },
    { id: 17, name: "Wanderlust Wizards", tags: ["Adventure", "Tech"] },
    { id: 18, name: "Beach Bum Brigade", tags: ["Relaxation", "Beach"] },
    { id: 19, name: "Lost in Translation", tags: ["Culture", "Education"] },
    { id: 20, name: "Snack Attack Squad", tags: ["Food", "Adventure"] },
    { id: 21, name: "No GPS Needed", tags: ["Adventure", "Nature"] },
    { id: 22, name: "Jet Lag Jokers", tags: ["Relaxation", "Tech"] },
    { id: 23, name: "Suitcase Circus", tags: ["Adventure", "Culture"] },
    { id: 24, name: "Map Masters", tags: ["Tech", "Education"] },
    { id: 25, name: "Sunburn Survivors", tags: ["Beach", "Adventure"] },
    { id: 26, name: "Caffeine Caravan", tags: ["Food", "Culture"] },
    { id: 27, name: "Passport Pirates", tags: ["Adventure", "Tech"] },
    { id: 28, name: "Flip Flop Fanatics", tags: ["Beach", "Relaxation"] },
    { id: 29, name: "Globetrotter Goofs", tags: ["Adventure", "Culture"] },
    { id: 30, name: "Selfie Seekers", tags: ["Tech", "Nature"] },
    { id: 31, name: "Hiking Hooligans", tags: ["Nature", "Adventure"] },
    { id: 32, name: "Culture Vultures", tags: ["Culture", "Education"] },
    { id: 33, name: "Mystery Tourists", tags: ["Adventure", "Relaxation"] },
    { id: 34, name: "Baggage Claimers", tags: ["Tech", "Relaxation"] },
    { id: 35, name: "Midnight Snackers", tags: ["Food", "Adventure"] },
    { id: 36, name: "Lost Socks Society", tags: ["Adventure", "Nature"] },
    { id: 37, name: "WiFi Wanderers", tags: ["Tech", "Culture"] },
    { id: 38, name: "Sunset Chasers", tags: ["Nature", "Relaxation"] },
    { id: 39, name: "Epic Fail Expeditions", tags: ["Adventure", "Tech"] },
    { id: 40, name: "Rolling Suitcases", tags: ["Culture", "Relaxation"] },
];

const themeTags = [
    { id: "Adventure", label: "🏔️ Adventure", color: "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30" },
    { id: "Culture", label: "🏛️ Culture", color: "bg-orange-400/20 border-orange-400/50 text-orange-300 hover:bg-orange-400/30" },
    { id: "Relaxation", label: "🛏️ Relaxation", color: "bg-orange-300/20 border-orange-300/50 text-orange-300 hover:bg-orange-300/30" },
    { id: "Tech", label: "💻 Tech", color: "bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30" },
    { id: "Science", label: "🔬 Science", color: "bg-orange-600/20 border-orange-600/50 text-orange-300 hover:bg-orange-600/30" },
    { id: "Education", label: "📚 Education", color: "bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30" },
    { id: "Nature", label: "🌿 Nature", color: "bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30" },
    { id: "Beach", label: "🏖️ Beach", color: "bg-orange-300/20 border-orange-300/50 text-orange-300 hover:bg-orange-300/30" },
    { id: "Food", label: "🍜 Food", color: "bg-orange-600/20 border-orange-600/50 text-orange-300 hover:bg-orange-600/30" },
];

const GROUPS_PER_PAGE = 8;

export default function GroupSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<typeof mockGroups>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    const toggleThemeTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tagId)
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId];
            setTimeout(() => handleSearch(newTags), 0);
            return newTags;
        });
    };

    const handleSearch = (tags?: string[]) => {
        // TODO: Integrate with backend API
        let filtered = mockGroups;

        if (query) {
            filtered = filtered.filter(group =>
                group.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        const activeTags = tags ?? selectedTags;
        if (activeTags.length > 0) {
            filtered = filtered.filter(group =>
                activeTags.every(tag => group.tags.includes(tag))
            );
        }

        setResults(filtered);
        setPage(1);
    };

    // Show results if search/filter is active, otherwise show all groups
    const displayGroups =
        (query || selectedTags.length > 0)
            ? results
            : mockGroups;

    const totalPages = Math.ceil(displayGroups.length / GROUPS_PER_PAGE);
    const pagedGroups = displayGroups.slice(
        (page - 1) * GROUPS_PER_PAGE,
        page * GROUPS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-black p-4 bg-floating-shapes relative">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-12 h-12 bg-orange-500/20 rounded-full float"></div>
                <div className="absolute top-60 right-16 w-8 h-8 bg-orange-400/30 rounded-full float-delayed"></div>
                <div className="absolute bottom-40 left-20 w-16 h-16 bg-orange-600/20 rounded-full float-delayed-2"></div>
                <Sparkles className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 float" />
                <Users className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 float-delayed" />
                <MapPin className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 float-delayed-2" />
            </div>
            <div className="max-w-md mx-auto relative z-10">
                <div className="flex items-center mb-6 pt-4 slide-up">
                    <h1 className="text-xl font-semibold text-white">
                        Find Your Travel Group
                    </h1>
                </div>
                <div className="shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 card-hover bounce-in">
                    <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
                        Group Search
                    </h2>
                    <div className="mb-4">
                        <span className="font-semibold text-orange-300">
                            Filter by Theme:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {themeTags.map(theme => (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => toggleThemeTag(theme.id)}
                                    className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${
                                        selectedTags.includes(theme.id)
                                            ? `${theme.color} shadow-md scale-105 orange-glow`
                                            : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500"
                                    }`}
                                >
                                    {theme.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Enter group name..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border-2 border-orange-500/30 focus:border-orange-500 bg-gray-800/50 text-white placeholder:text-gray-400"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-black font-semibold shadow btn-hover-lift border-0 orange-glow"
                        >
                            Search
                        </button>
                    </div>
                    <ul className="mt-2">
                        {pagedGroups.length === 0 && (
                            <li className="text-orange-300 text-center py-4">No groups found.</li>
                        )}
                        {pagedGroups.map(group => (
                            <li
                                key={group.id}
                                className="py-2 px-3 mb-2 rounded-lg bg-gray-800/60 border border-orange-500/10"
                            >
                                <div className="font-semibold text-orange-200">{group.name}</div>
                                <div className="text-xs mt-1 flex flex-wrap gap-1">
                                    {group.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-orange-500/10 text-orange-300 px-2 py-1 rounded-full border border-orange-500/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 font-semibold disabled:opacity-50"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                            <span className="text-orange-300 font-semibold">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 font-semibold disabled:opacity-50"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
