"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Users, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<groupInfo[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // <-- use number[]
  const [page, setPage] = useState(1);
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(false); // <-- loading state

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
        const interestsArr: Interest[] = data.data.interests || [];
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
    setLoading(true); // <-- set loading true
    const filterReq: groupFilterReq = {
      group_name: groupName,
      interest_id: tags,
      page: pageNum,
      page_size,
    };
    const backendRes = await fetchGroups(filterReq);
    const group_array = backendRes?.data?.group_array ?? [];
    const group_count = backendRes?.data?.group_count ?? 0;
    setGroupCount(group_count);
    setResults(group_array);
    setLoading(false); // <-- set loading false
  };

  useEffect(() => {
    handleFilter(page, selectedTags, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTags, query]);

  // FIX: tagId is number
  const toggleInterestTag = (tagId: number) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId];
      setPage(1);
      return newTags;
    });
  };

  const totalPages = Math.ceil(groupCount / page_size);
  const pagedGroups = results;

  const goToPage = (newPage: number) => {
    setPage(newPage);
    handleFilter(newPage, selectedTags, query);
  };

  const handleGroupCardClick = (groupId: number) => {
    router.push(`/group/${groupId}/info`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 p-4 bg-floating-shapes relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-orange-600/30 rounded-full blur-2xl animate-pulse"></div>
        <Sparkles className="absolute top-32 right-32 text-orange-500/40 w-8 h-8 animate-spin-slow" />
        <Users className="absolute bottom-32 left-32 text-orange-400/40 w-7 h-7 animate-bounce" />
        <MapPin className="absolute top-1/2 right-10 text-orange-300/40 w-6 h-6 animate-pulse" />
      </div>
      <div className="max-w-lg mx-auto relative z-10">
        <div className="flex items-center mb-8 pt-8 slide-up">
          <h1 className="text-3xl font-extrabold text-orange-100 drop-shadow-lg tracking-wide">
            Find Your Travel Group
          </h1>
        </div>
        <div className="shadow-2xl border border-orange-500/30 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-orange-900/60 backdrop-blur-xl rounded-2xl p-8 card-hover bounce-in">
          <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center tracking-wide">
            Group Search
          </h2>
          <div className="mb-6">
            <span className="font-semibold text-orange-300 text-lg">
              Filter by Interests:
            </span>
            <div className="flex flex-wrap gap-3 mt-3">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterestTag(interest.id)} // <-- pass number
                  style={{
                    background: selectedTags.includes(interest.id)
                      ? interest.color + "33"
                      : "#23272a",
                    borderColor: selectedTags.includes(interest.id)
                      ? interest.color
                      : "#fb923c33",
                    color: selectedTags.includes(interest.id)
                      ? "#fff"
                      : interest.color,
                  }}
                  className={`px-4 py-2 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow hover:scale-105 hover:shadow-lg ${
                    selectedTags.includes(interest.id)
                      ? "scale-105 ring-2 ring-orange-400"
                      : "hover:border-orange-500"
                  }`}
                >
                  {interest.emoji ? `${interest.emoji} ` : ""}
                  {interest.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter group name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-orange-500/30 focus:border-orange-500 bg-gray-800/70 text-white placeholder:text-gray-400 text-lg shadow"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg btn-hover-lift border-0 hover:scale-105 hover:shadow-xl transition-all"
            >
              Search
            </button>
          </div>
          {loading ? ( // <-- loading indicator
            <div className="text-center py-6">
              <span className="text-orange-300 font-semibold">Loading...</span>
            </div>
          ) : (
            <ul className="mt-2 space-y-4">
              {pagedGroups.length === 0 && (
                <li className="text-orange-300 text-center py-6 text-lg font-semibold">No groups found.</li>
              )}
              {pagedGroups.map((group, idx) => (
                <li
                  key={group.group_id + "-" + idx}
                  className="py-4 px-5 rounded-xl bg-gradient-to-r from-gray-800/80 to-orange-900/40 border border-orange-500/20 shadow-lg hover:scale-[1.02] transition-all cursor-pointer hover:border-orange-500/40"
                  onClick={() => handleGroupCardClick(group.group_id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-orange-200">{group.group_name}</div>
                      <div className="text-xs mt-2 flex flex-wrap gap-2">
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
                            className="px-3 py-1 rounded-full border text-xs font-semibold shadow hover:scale-105 transition-all"
                          >
                            {interests.find((i) => i.id === tagId)?.emoji
                              ? interests.find((i) => i.id === tagId)?.emoji + " "
                              : ""}
                            {interestLabelMap[String(tagId)] || tagId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {group.max_members && (
                        <span className="text-xs text-orange-300 font-semibold">
                          Max: {group.max_members}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Leader ID: {group.group_leader_id}
                      </span>
                    </div>
                  </div>
                  {group.description && (
                    <div className="text-sm text-orange-400 mt-3">{group.description}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className="px-4 py-2 rounded bg-orange-500/30 text-orange-100 font-bold disabled:opacity-50 shadow hover:bg-orange-500/50 transition-all"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              >
                Prev
              </button>
              <span className="text-orange-200 font-bold text-lg">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 rounded bg-orange-500/30 text-orange-100 font-bold disabled:opacity-50 shadow hover:bg-orange-500/50 transition-all"
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