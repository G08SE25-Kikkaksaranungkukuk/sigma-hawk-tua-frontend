"use client";
import React, { useState, useEffect } from "react";
import { Search as SearchIcon, BookOpen, Tag, X } from "lucide-react";

// Blog interfaces
export interface BlogFilterReq {
  tag_ids?: number[];
  title?: string;
  content?: string;
  page?: number;
  page_size?: number;
}

export interface BlogInfo {
  blog_id: string;
  title: string;
  description: string;
  content?: string;
  tag_ids: number[];
  author_id: string;
  author_name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Blog tags/categories type
type BlogTag = {
  id: number;
  label: string;
  color: string;
  emoji?: string;
  description?: string;
};

interface BlogSearchBarProps {
  onSearch: (filters: BlogFilterReq) => void;
  loading?: boolean;
  placeholder?: string;
  showTypeToggle?: boolean;
  className?: string;
}

export const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  onSearch,
  loading = false,
  placeholder = "Search blogs...",
  showTypeToggle = true,
  className = ""
}) => {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [searchType, setSearchType] = useState<"title" | "content">("title");
  const [blogTags, setBlogTags] = useState<BlogTag[]>([]);

  // Mock blog tags (replace with API call)
  useEffect(() => {
    const mockTags: BlogTag[] = [
      { id: 1, label: "Travel Tips", color: "#3B82F6", emoji: "✈️" },
      { id: 2, label: "Adventure", color: "#EF4444", emoji: "🏔️" },
      { id: 3, label: "Culture", color: "#8B5CF6", emoji: "🏛️" },
      { id: 4, label: "Food", color: "#F59E0B", emoji: "🍜" },
      { id: 5, label: "Photography", color: "#10B981", emoji: "📸" },
      { id: 6, label: "Budget Travel", color: "#F97316", emoji: "💰" },
      { id: 7, label: "Solo Travel", color: "#EC4899", emoji: "🚶" },
      { id: 8, label: "Family Travel", color: "#6366F1", emoji: "👨‍👩‍👧‍👦" },
      { id: 9, label: "Backpacking", color: "#14B8A6", emoji: "🎒" },
      { id: 10, label: "Luxury Travel", color: "#84CC16", emoji: "✨" }
    ];
    setBlogTags(mockTags);
  }, []);

  const handleSearch = () => {
    const filters: BlogFilterReq = {
      [searchType]: query,
      tag_ids: selectedTags.length > 0 ? selectedTags : undefined,
      page: 1,
      page_size: 10
    };
    onSearch(filters);
  };

  const toggleBlogTag = (tagId: number) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId];
      return newTags;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
    setSearchType("title");
  };

  // Auto-search when filters change
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query || selectedTags.length > 0) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedTags, searchType]);

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-orange-900/60 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-2xl ${className}`}>
      {/* Search Type Toggle */}
      {showTypeToggle && (
        <div className="mb-4">
          <span className="font-semibold text-orange-300 text-sm mb-2 block">
            Search in:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType("title")}
              className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                searchType === "title"
                  ? "bg-orange-500/30 border-orange-500 text-white"
                  : "bg-gray-800/70 border-orange-500/30 text-orange-300 hover:border-orange-500"
              }`}
            >
              <SearchIcon className="w-3 h-3 inline mr-1" />
              Title
            </button>
            <button
              onClick={() => setSearchType("content")}
              className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                searchType === "content"
                  ? "bg-orange-500/30 border-orange-500 text-white"
                  : "bg-gray-800/70 border-orange-500/30 text-orange-300 hover:border-orange-500"
              }`}
            >
              <BookOpen className="w-3 h-3 inline mr-1" />
              Content
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-orange-500/30 focus:border-orange-500 bg-gray-800/70 text-white placeholder:text-gray-400 text-sm shadow focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "..." : <SearchIcon className="w-4 h-4" />}
          </button>
          {(query || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2.5 rounded-lg bg-gray-600/70 text-gray-300 hover:bg-gray-500/70 transition-all"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tag Filters */}
      <div>
        <span className="font-semibold text-orange-300 text-sm mb-2 block">
          Filter by Tags:
        </span>
        <div className="flex flex-wrap gap-2">
          {blogTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleBlogTag(tag.id)}
              style={{
                background: selectedTags.includes(tag.id)
                  ? tag.color + "33"
                  : "#23272a",
                borderColor: selectedTags.includes(tag.id)
                  ? tag.color
                  : "#fb923c33",
                color: selectedTags.includes(tag.id)
                  ? "#fff"
                  : tag.color,
              }}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow hover:scale-105 hover:shadow-lg ${
                selectedTags.includes(tag.id)
                  ? "scale-105"
                  : "hover:border-orange-500"
              }`}
            >
              {tag.emoji ? `${tag.emoji} ` : ""}
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(query || selectedTags.length > 0) && (
        <div className="mt-4 pt-4 border-t border-orange-500/20">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-orange-300 font-medium">Active filters:</span>
            {query && (
              <span className="bg-orange-500/20 text-orange-200 px-2 py-1 rounded-full border border-orange-500/30">
                {searchType}: "{query}"
              </span>
            )}
            {selectedTags.map((tagId) => {
              const tag = blogTags.find(t => t.id === tagId);
              return tag ? (
                <span
                  key={tagId}
                  className="bg-orange-500/20 text-orange-200 px-2 py-1 rounded-full border border-orange-500/30 flex items-center gap-1"
                >
                  {tag.emoji} {tag.label}
                  <button
                    onClick={() => toggleBlogTag(tagId)}
                    className="ml-1 text-orange-300 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSearchBar;