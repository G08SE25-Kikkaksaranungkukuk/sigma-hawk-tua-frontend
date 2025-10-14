"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, BookOpen, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import BlogSearchBar, { BlogFilterReq, BlogInfo } from "@/components/blog/BlogSearchBar";
import BlogSearchResults from "@/components/blog/BlogSearchResults";

// Fetch blogs from local API route
async function fetchBlogs(req: BlogFilterReq): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (req.tag_ids) {
      req.tag_ids.forEach((id) => params.append("tag_id", id.toString()));
    }
    if (req.title) params.append("title", req.title);
    if (req.content) params.append("content", req.content);
    if (req.page) params.append("page", req.page.toString());
    if (req.page_size) params.append("page_size", req.page_size.toString());
    
    const res = await fetch(`/api/blog/search?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function BlogSearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<BlogInfo[]>([]);
  const [page, setPage] = useState(1);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<BlogFilterReq>({});

  const page_size = 6;

  const handleSearch = async (filters: BlogFilterReq) => {
    setLoading(true);
    setCurrentFilters(filters);
    setPage(1);
    
    const searchReq = { ...filters, page: 1, page_size };
    
    // Mock data for now - replace with actual API call
    const mockBlogs: BlogInfo[] = [
      {
        blog_id: "1",
        title: "Amazing Adventure in Thailand",
        description: "Discover the hidden gems of northern Thailand in this comprehensive travel guide. From bustling markets to serene temples, explore the cultural richness and natural beauty that makes this region so special.",
        tag_ids: [1, 2, 4],
        author_id: "user1",
        author_name: "John Explorer",
        created_at: new Date().toISOString()
      },
      {
        blog_id: "2", 
        title: "Budget Travel Tips for Southeast Asia",
        description: "Learn how to travel across Southeast Asia on a shoestring budget with these proven tips and tricks. From finding cheap accommodation to eating like a local without breaking the bank.",
        tag_ids: [1, 6, 9],
        author_id: "user2",
        author_name: "Sarah Wanderer",
        created_at: new Date().toISOString()
      },
      {
        blog_id: "3",
        title: "Photography Guide: Capturing Culture",
        description: "Master the art of cultural photography while traveling with these professional techniques. Learn how to respectfully document local traditions and create stunning visual stories.",
        tag_ids: [3, 5],
        author_id: "user3", 
        author_name: "Mike Photographer",
        created_at: new Date().toISOString()
      },
      {
        blog_id: "4",
        title: "Solo Female Travel in Japan",
        description: "A comprehensive guide for solo female travelers exploring Japan. Safety tips, cultural insights, and must-visit destinations for an unforgettable journey.",
        tag_ids: [7, 3, 1],
        author_id: "user4",
        author_name: "Emma Solo",
        created_at: new Date().toISOString()
      },
      {
        blog_id: "5",
        title: "Family Adventures in Europe",
        description: "Planning a family trip to Europe? Discover kid-friendly activities, family accommodations, and practical tips for traveling with children across the continent.",
        tag_ids: [8, 1],
        author_id: "user5",
        author_name: "David Family",
        created_at: new Date().toISOString()
      },
      {
        blog_id: "6",
        title: "Luxury Travel: Five-Star Experiences",
        description: "Indulge in the finest travel experiences around the world. From exclusive resorts to private tours, discover luxury travel at its best.",
        tag_ids: [10, 1],
        author_id: "user6",
        author_name: "Victoria Luxury",
        created_at: new Date().toISOString()
      }
    ];
    
    // Filter mock data based on search criteria
    let filteredBlogs = mockBlogs;
    
    if (filters.title) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    
    if (filters.content) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.description.toLowerCase().includes(filters.content!.toLowerCase())
      );
    }
    
    if (filters.tag_ids && filters.tag_ids.length > 0) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.tag_ids.some(tagId => filters.tag_ids!.includes(tagId))
      );
    }
    
    setBlogCount(filteredBlogs.length);
    setResults(filteredBlogs);
    setLoading(false);
  };

  const totalPages = Math.ceil(blogCount / page_size);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    const newFilters = { ...currentFilters, page: newPage, page_size };
    handleSearch(newFilters);
  };

  const handleBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 p-4 relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-orange-600/30 rounded-full blur-2xl animate-pulse"></div>
        <Sparkles className="absolute top-32 right-32 text-orange-500/40 w-8 h-8 animate-spin-slow" />
        <BookOpen className="absolute bottom-32 left-32 text-orange-400/40 w-7 h-7 animate-bounce" />
        <Tag className="absolute top-1/2 right-10 text-orange-300/40 w-6 h-6 animate-pulse" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center mb-8 pt-8">
          <h1 className="text-4xl font-extrabold text-orange-100 drop-shadow-lg tracking-wide">
            Discover Travel Stories
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Sidebar */}
          <div className="lg:col-span-1">
            <BlogSearchBar 
              onSearch={handleSearch}
              loading={loading}
              placeholder="Search blogs..."
              showTypeToggle={true}
              className="sticky top-8"
            />
          </div>
          
          {/* Results Area */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-orange-400">
                  Search Results
                </h2>
                {!loading && results.length > 0 && (
                  <span className="text-orange-300 text-sm">
                    {blogCount} blog{blogCount !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </div>
            
            <BlogSearchResults
              blogs={results}
              loading={loading}
              onBlogClick={handleBlogClick}
              showAuthor={true}
            />
            
            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  className="px-4 py-2 rounded-lg bg-orange-500/30 text-orange-100 font-bold disabled:opacity-50 shadow hover:bg-orange-500/50 transition-all"
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </button>
                <span className="text-orange-200 font-bold text-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 rounded-lg bg-orange-500/30 text-orange-100 font-bold disabled:opacity-50 shadow hover:bg-orange-500/50 transition-all"
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
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 p-4 bg-floating-shapes relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-orange-600/30 rounded-full blur-2xl animate-pulse"></div>
        <Sparkles className="absolute top-32 right-32 text-orange-500/40 w-8 h-8 animate-spin-slow" />
        <BookOpen className="absolute bottom-32 left-32 text-orange-400/40 w-7 h-7 animate-bounce" />
        <Tag className="absolute top-1/2 right-10 text-orange-300/40 w-6 h-6 animate-pulse" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center mb-8 pt-8 slide-up">
          <h1 className="text-3xl font-extrabold text-orange-100 drop-shadow-lg tracking-wide">
            Discover Travel Stories
          </h1>
        </div>
        
        <div className="shadow-2xl border border-orange-500/30 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-orange-900/60 backdrop-blur-xl rounded-2xl p-8 card-hover bounce-in">
          <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center tracking-wide">
            Blog Search
          </h2>
          
          {/* Search Type Toggle */}
          <div className="mb-6">
            <span className="font-semibold text-orange-300 text-lg mb-3 block">
              Search in:
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setSearchType("title")}
                className={`px-4 py-2 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow hover:scale-105 ${
                  searchType === "title"
                    ? "bg-orange-500/30 border-orange-500 text-white scale-105"
                    : "bg-gray-800/70 border-orange-500/30 text-orange-300 hover:border-orange-500"
                }`}
              >
                <SearchIcon className="w-4 h-4 inline mr-2" />
                Title
              </button>
              <button
                onClick={() => setSearchType("content")}
                className={`px-4 py-2 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow hover:scale-105 ${
                  searchType === "content"
                    ? "bg-orange-500/30 border-orange-500 text-white scale-105"
                    : "bg-gray-800/70 border-orange-500/30 text-orange-300 hover:border-orange-500"
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Content
              </button>
            </div>
          </div>
          
          {/* Tag Filters */}
          <div className="mb-6">
            <span className="font-semibold text-orange-300 text-lg">
              Filter by Tags:
            </span>
            <div className="flex flex-wrap gap-3 mt-3">
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
                  className={`px-4 py-2 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow hover:scale-105 hover:shadow-lg ${
                    selectedTags.includes(tag.id)
                      ? "scale-105 ring-2 ring-orange-400"
                      : "hover:border-orange-500"
                  }`}
                >
                  {tag.emoji ? `${tag.emoji} ` : ""}
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder={`Search in ${searchType}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-orange-500/30 focus:border-orange-500 bg-gray-800/70 text-white placeholder:text-gray-400 text-lg shadow"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg btn-hover-lift border-0 hover:scale-105 hover:shadow-xl transition-all"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Results */}
          {loading ? (
            <div className="text-center py-6">
              <span className="text-orange-300 font-semibold">Loading...</span>
            </div>
          ) : (
            <div className="mt-2 space-y-6">
              {pagedBlogs.length === 0 && (
                <div className="text-orange-300 text-center py-6 text-lg font-semibold">
                  No blogs found.
                </div>
              )}
              {pagedBlogs.map((blog, idx) => (
                <article
                  key={blog.blog_id + "-" + idx}
                  className="py-6 px-6 rounded-xl bg-gradient-to-r from-gray-800/80 to-orange-900/40 border border-orange-500/20 shadow-lg hover:scale-[1.02] transition-all cursor-pointer hover:border-orange-500/40"
                  onClick={() => handleBlogCardClick(blog.blog_id)}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-orange-200 mb-2 hover:text-orange-300 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed mb-3">
                          {blog.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {blog.tag_ids.map((tagId) => (
                          <span
                            key={tagId}
                            style={{
                              background:
                                blogTags.find((t) => t.id === tagId)?.color + "33" ||
                                "#fb923c33",
                              borderColor:
                                blogTags.find((t) => t.id === tagId)?.color ||
                                "#fb923c33",
                              color:
                                blogTags.find((t) => t.id === tagId)?.color || "#fb923c",
                            }}
                            className="px-3 py-1 rounded-full border text-sm font-semibold shadow hover:scale-105 transition-all"
                          >
                            {blogTags.find((t) => t.id === tagId)?.emoji
                              ? blogTags.find((t) => t.id === tagId)?.emoji + " "
                              : ""}
                            {tagLabelMap[String(tagId)] || tagId}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-col items-end text-sm text-gray-400">
                        {blog.author_name && (
                          <span className="font-semibold text-orange-300">
                            by {blog.author_name}
                          </span>
                        )}
                        {blog.created_at && (
                          <span>
                            {new Date(blog.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Pagination */}
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