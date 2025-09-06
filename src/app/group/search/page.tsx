"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Users, MapPin } from "lucide-react";

// Interfaces
export interface groupFilterReq {
    interest_fields?: string[];
    group_name?: string;
    page?: number;
    page_size?: number;
}

export interface groupInfo {
    interest_fields: string[];
    group_name: string;
}

export interface groupFilterRes {
    success: boolean;
    data: {
        group_array: groupInfo[];
        group_count: number;
    };
}

// Helper to build query string for backend
function buildQueryString(req: groupFilterReq) {
    const params = new URLSearchParams();
    if (req.interest_fields) {
        req.interest_fields.forEach(field => params.append("interest_fields", field));
    }
    if (req.group_name) params.append("group_name", req.group_name);
    if (req.page) params.append("page", req.page.toString());
    if (req.page_size) params.append("page_size", req.page_size.toString());
    return params.toString();
}

// Fetch groups from local API route
async function fetchGroups(req: groupFilterReq): Promise<groupFilterRes | null> {
    try {
        const query = buildQueryString(req);
        const res = await fetch(`/api/group/search?${query}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

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

export default function GroupSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<groupInfo[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [groupCount, setGroupCount] = useState(0); // Add this line
    const [cache, setCache] = useState<{ [key: string]: groupInfo[] }>({});

    // Helper to build cache key based on filters
    const getCacheKey = (pageNum: number, tags: string[], groupName: string) =>
        `${pageNum}|${tags.sort().join(",")}|${groupName}`;

    // Only called when search button is pressed
    const handleSearch = async () => {
        setPage(1); // Reset to first page on new search
        await handleFilter(1, selectedTags, query);
    };

    // Called for page, tag, or query changes
    const handleFilter = async (
        pageNum = page,
        tags = selectedTags,
        groupName = query
    ) => {
        const cacheKey = getCacheKey(pageNum, tags, groupName);

        // Check cache first
        if (cache[cacheKey]) {
            setResults(cache[cacheKey]);
            return;
        }

        const filterReq: groupFilterReq = {
            group_name: groupName,
            interest_fields: tags,
            page: pageNum,
            page_size,
        };

        const backendRes = await fetchGroups(filterReq);
        const group_array = backendRes?.data?.group_array ?? [];
        const group_count = backendRes?.data?.group_count ?? 0;
        setGroupCount(group_count);
        setResults(group_array);

        // Cache the result
        setCache(prev => ({
            ...prev,
            [cacheKey]: group_array,
        }));
    };

    // Fetch groups when page, query, or selectedTags change (not search button)
    useEffect(() => {
        handleFilter(page, selectedTags, query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, selectedTags, query]);

    // Tag toggle should update selectedTags and reset to page 1
    const toggleThemeTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tagId)
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId];
            setPage(1); // Reset to first page when filter changes
            return newTags;
        });
    };

    useEffect(() => {
        setCache({});
        setPage(1); // Reset to first page when filters change
    }, [selectedTags, query]);


    const page_size = 8; // Fetch up to 8 results from backend for client-side pagination

    // Only use API, no fallback
    const totalPages = Math.ceil(groupCount / page_size);
    const pagedGroups = results;


    // Add this function inside your component:
    const goToPage = (newPage: number) => {
        setPage(newPage);
        handleFilter(newPage, selectedTags, query);
    };

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
                                    className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${selectedTags.includes(theme.id)
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
                        {pagedGroups.map((group, idx) => (
                            <li
                                key={group.group_name + idx}
                                className="py-2 px-3 mb-2 rounded-lg bg-gray-800/60 border border-orange-500/10"
                            >
                                <div className="font-semibold text-orange-200">{group.group_name}</div>
                                <div className="text-xs mt-1 flex flex-wrap gap-1">
                                    {group.interest_fields.map(tag => (
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
                                onClick={() => goToPage(page - 1)}
                            >
                                Prev
                            </button>
                            <span className="text-orange-300 font-semibold">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 font-semibold disabled:opacity-50"
                                disabled={page === totalPages}
                                onClick={() => goToPage(page + 1)}
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

/*
SQL for testing

TRUNCATE TABLE "Group" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;


INSERT INTO "User" 
  (first_name, middle_name, last_name, birth_date, sex, phone, profile_url, social_credit, password, email)
VALUES
  ('Alice', NULL, 'Johnson', '1990-05-14', 'F', '123-456-7890', 'https://example.com/profiles/alice.jpg', 10, 'hashed_password1', 'alice@example.com'),
  ('Bob', 'Michael', 'Smith', '1985-09-23', 'M', '123-555-7890', 'https://example.com/profiles/bob.jpg', 20, 'hashed_password2', 'bob@example.com'),
  ('Charlie', NULL, 'Kim', '1992-12-01', 'M', '123-777-7890', NULL, 15, 'hashed_password3', 'charlie@example.com'),
  ('Diana', 'Rose', 'Lopez', '1995-03-19', 'F', '123-999-7890', 'https://example.com/profiles/diana.jpg', 25, 'hashed_password4', 'diana@example.com'),
  ('Ethan', NULL, 'Brown', '1988-07-30', 'M', '123-888-7890', NULL, 5, 'hashed_password5', 'ethan@example.com');


INSERT INTO "Group" (group_name, group_leader_id, interest_fields)
VALUES
  ('Mountain Hiking Friends', 1, ARRAY['Hiking', 'Mountains', 'Adventure']),
  ('Coastal Hiking Tribe', 2, ARRAY['Hiking', 'Beaches', 'Nature']),
  ('Hiking & Photography', 3, ARRAY['Hiking', 'Photography', 'Exploration']),
  ('Desert Hiking Nomads', 4, ARRAY['Hiking', 'Desert', 'Camping']),
  ('Family Hiking Club', 5, ARRAY['Hiking', 'Kids Friendly', 'Outdoors']),
  ('Hiking for Wellness', 1, ARRAY['Hiking', 'Health', 'Mindfulness']),
  ('Hiking Meetup Group', 2, ARRAY['Hiking', 'Community', 'Events']),
  ('City Hiking Explorers', 3, ARRAY['Hiking', 'Urban Trails']),
  ('Hiking & Camping Crew', 4, ARRAY['Hiking', 'Camping', 'Bonfire']),
  ('Weekend Hiking Buddies', 5, ARRAY['Hiking', 'Adventure', 'Friendship']),
  ('Trail Running & Hiking', 1, ARRAY['Hiking', 'Running', 'Fitness']),
  ('Extreme Night Hiking', 2, ARRAY['Hiking', 'Nightlife', 'Adventure']),
  ('Snow Hiking Lovers', 3, ARRAY['Hiking', 'Snow', 'Winter Sports']),
  ('Sunset Hiking Squad', 4, ARRAY['Hiking', 'Sunset', 'Scenic Views']),
  ('Solo Hiking Network', 5, ARRAY['Hiking', 'Solo Travel']),
  ('Hiking & Foodies', 1, ARRAY['Hiking', 'Food', 'Culture']),
  ('Hiking for Beginners', 2, ARRAY['Hiking', 'Learning', 'Outdoor Basics']),
  ('Global Hiking Friends', 3, ARRAY['Hiking', 'International', 'Travel']),
  ('Hiking & Yoga Retreats', 4, ARRAY['Hiking', 'Yoga', 'Wellness']),
  ('Eco Hiking Group', 5, ARRAY['Hiking', 'Environment', 'Sustainability']);



SELECT * FROM "Group"
ORDER BY group_id ASC 
*/