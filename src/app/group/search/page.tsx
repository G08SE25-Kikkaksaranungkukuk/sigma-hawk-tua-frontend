"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Users, MapPin } from "lucide-react";

// Updated interfaces
export interface groupFilterReq {
  interest_id?: number[];
  group_name?: string;
  page?: number;
  page_size?: number;
}

export interface groupInfo {
  interest_id: number[];
  group_id: number;
  group_name: string;
  group_leader_id: number;
  description?: string;
  max_members?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface groupFilterRes {
  group_array: groupInfo[];
  group_count: number;
}

// Helper to build query string for backend
function buildQueryString(req: groupFilterReq) {
  const params = new URLSearchParams();
  if (req.interest_id) {
    req.interest_id.forEach((id) => params.append("interest_id", id.toString()));
  }
  if (req.group_name) params.append("group_name", req.group_name);
  if (req.page) params.append("page", req.page.toString());
  if (req.page_size) params.append("page_size", req.page_size.toString());
  return params.toString();
}

// Fetch groups from local API route
async function fetchGroups(req: groupFilterReq): Promise<any> {
  try {
    const query = buildQueryString(req);
    const res = await fetch(`/api/group/filter?${query}`);
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
  // Interest API type and state
  type Interest = {
    id: number;
    label: string;
    color: string; // hex code
    emoji?: string;
    description?: string;
  };
  const [interests, setInterests] = useState<Interest[]>([]);
  // Map interest id (number or string) to label
  const [interestLabelMap, setInterestLabelMap] = useState<{ [key: string]: string }>({});

  // Fetch interests from API on mount
  useEffect(() => {
    async function fetchInterests() {
      try {
        const res = await fetch("/api/interest");
        const data = await res.json();
        const interestsArr: Interest[] = data.data || [];
        setInterests(interestsArr);
        // Build label map
        const map: { [key: string]: string } = {};
        interestsArr.forEach((interest) => {
          map[String(interest.id)] = interest.label;
        });
        setInterestLabelMap(map);
      } catch {
        setInterests([]);
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

  const page_size = 8;

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
      interest_id: tags.map(tag => Number(tag)),
      page: pageNum,
      page_size,
    };
    const backendRes = await fetchGroups(filterReq);
    // FIX: Extract from backendRes.data
    const group_array = backendRes?.data?.group_array ?? [];
    const group_count = backendRes?.data?.group_count ?? 0;
    setGroupCount(group_count);
    setResults(group_array);
    setCache((prev) => ({
      ...prev,
      [cacheKey]: group_array,
    }));
  };

  useEffect(() => {
    handleFilter(page, selectedTags, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTags, query]);

  const toggleInterestTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId];
      setPage(1);
      return newTags;
    });
  };

  useEffect(() => {
    setCache({});
    setPage(1);
  }, [selectedTags, query]);

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
              Filter by Interests:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterestTag(String(interest.id))}
                  style={{
                    background:
                      selectedTags.includes(String(interest.id))
                        ? interest.color + "33" // 20% opacity
                        : "#2d3748",
                    borderColor:
                      selectedTags.includes(String(interest.id))
                        ? interest.color
                        : "#fb923c33",
                    color:
                      selectedTags.includes(String(interest.id))
                        ? "#fff"
                        : interest.color,
                  }}
                  className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${
                    selectedTags.includes(String(interest.id))
                      ? "shadow-md scale-105 orange-glow"
                      : "hover:border-orange-500"
                  }`}
                >
                  {interest.emoji ? `${interest.emoji} ` : ""}
                  {interest.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter group name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                key={group.group_id + "-" + idx}
                className="py-2 px-3 mb-2 rounded-lg bg-gray-800/60 border border-orange-500/10"
              >
                <div className="font-semibold text-orange-200">{group.group_name}</div>
                <div className="text-xs mt-1 flex flex-wrap gap-1">
                  {group.interest_id.map((tagId) => (
                    <span
                      key={tagId}
                      style={{
                        background:
                          interests.find((i) => i.id === tagId)?.color + "33" ||
                          "#fb923c33",
                        borderColor:
                          interests.find((i) => i.id === tagId)?.color ||
                          "#fb923c33",
                        color:
                          interests.find((i) => i.id === tagId)?.color || "#fb923c",
                      }}
                      className="px-2 py-1 rounded-full border text-xs font-medium"
                    >
                      {interests.find((i) => i.id === tagId)?.emoji
                        ? interests.find((i) => i.id === tagId)?.emoji + " "
                        : ""}
                      {interestLabelMap[String(tagId)] || tagId}
                    </span>
                  ))}
                </div>
                {group.description && (
                  <div className="text-xs text-orange-400 mt-1">{group.description}</div>
                )}
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