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

export default function GroupSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<groupInfo[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [groupCount, setGroupCount] = useState(0);
    const [cache, setCache] = useState<{ [key: string]: groupInfo[] }>({});
    // New interest API type and state
    type Interest = {
        id: string;
        label: string;
        color: string;
    };
    const [themeTags, setThemeTags] = useState<Interest[]>([]);
    // Add mapping from interest id to label
    const [interestLabelMap, setInterestLabelMap] = useState<{ [key: string]: string }>({});

    // Fetch interests from API on mount
    useEffect(() => {
        async function fetchInterests() {
            try {
                const res = await fetch("/api/interests");
                const data = await res.json();
                setThemeTags(data.interests || []);
                // Build label map
                const map: { [key: string]: string } = {};
                (data.interests || []).forEach((interest: Interest) => {
                    map[interest.id] = interest.label;
                });
                setInterestLabelMap(map);
            } catch {
                setThemeTags([]);
                setInterestLabelMap({});
            }
        }
        fetchInterests();
    }, []);

    const getCacheKey = (pageNum: number, tags: string[], groupName: string) =>
        `${pageNum}|${tags.sort().join(",")}|${groupName}`;

    const handleSearch = async () => {
        setPage(1);
        await handleFilter(1, selectedTags, query);
    };

    const handleFilter = async (
        pageNum = page,
        tags = selectedTags,
        groupName = query
    ) => {
        const cacheKey = getCacheKey(pageNum, tags, groupName);
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
        setCache(prev => ({
            ...prev,
            [cacheKey]: group_array,
        }));
    };

    useEffect(() => {
        handleFilter(page, selectedTags, query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, selectedTags, query]);

    const toggleThemeTag = (tagId: string) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tagId)
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId];
            setPage(1);
            return newTags;
        });
    };

    useEffect(() => {
        setCache({});
        setPage(1);
    }, [selectedTags, query]);

    const page_size = 8;
    const totalPages = Math.ceil(groupCount / page_size);
    const pagedGroups = results;

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
                                        ? `bg-${theme.color}-500/30 border-${theme.color}-500 text-white shadow-md scale-105 orange-glow`
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
                                            {/* Use label from interests API if available, else fallback to tag */}
                                            {interestLabelMap[tag] || tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
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
  ('Sea Lovers Club', 1, ARRAY['SEA', 'BEACH_BAR', 'FOOD_STREET']),
  ('Mountain Hiking Friends', 2, ARRAY['MOUNTAIN', 'NATIONAL_PARK', 'CAFE']),
  ('Waterfall Explorers', 3, ARRAY['WATERFALL', 'NATIONAL_PARK', 'ISLAND']),
  ('Temple Tour Group', 4, ARRAY['TEMPLE', 'HISTORICAL', 'MARKET']),
  ('Shopping Enthusiasts', 5, ARRAY['SHOPPING_MALL', 'MARKET', 'CAFE']),
  ('Island Adventure Crew', 1, ARRAY['ISLAND', 'SEA', 'FESTIVAL']),
  ('Cafe Hoppers', 2, ARRAY['CAFE', 'FOOD_STREET', 'MARKET']),
  ('History Buffs', 3, ARRAY['HISTORICAL', 'MUSEUM', 'THEATRE']),
  ('Amusement Seekers', 4, ARRAY['AMUSEMENT_PARK', 'FESTIVAL', 'ZOO']),
  ('Zoo Friends', 5, ARRAY['ZOO', 'NATIONAL_PARK', 'ISLAND']),
  ('Festival Goers', 1, ARRAY['FESTIVAL', 'FOOD_STREET', 'MARKET']),
  ('Museum Lovers', 2, ARRAY['MUSEUM', 'HISTORICAL', 'THEATRE']),
  ('Food Street Fans', 3, ARRAY['FOOD_STREET', 'CAFE', 'MARKET']),
  ('Beach Bar Crew', 4, ARRAY['BEACH_BAR', 'SEA', 'ISLAND']),
  ('Theatre Troupe', 5, ARRAY['THEATRE', 'MUSEUM', 'CAFE']),
  ('National Park Explorers', 1, ARRAY['NATIONAL_PARK', 'MOUNTAIN', 'WATERFALL']),
  ('Market Wanderers', 2, ARRAY['MARKET', 'SHOPPING_MALL', 'FOOD_STREET']),
  ('Cafe Park Party', 3, ARRAY['AMUSEMENT_PARK', 'FESTIVAL', 'CAFE']),
  ('Market Zoo Group', 4, ARRAY['ZOO', 'Market', 'NATIONAL_PARK']),
  ('Sea Cafe Foodies', 5, ARRAY['FOOD_STREET', 'SEA', 'CAFE']);

SELECT * FROM "Group"
ORDER BY group_id ASC;
*/