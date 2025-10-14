"use client";
import React from "react";
import { BookOpen, User, Calendar, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

// Blog interfaces
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

interface BlogSearchResultsProps {
  blogs: BlogInfo[];
  loading?: boolean;
  onBlogClick?: (blogId: string) => void;
  showAuthor?: boolean;
  className?: string;
}

export const BlogSearchResults: React.FC<BlogSearchResultsProps> = ({
  blogs,
  loading = false,
  onBlogClick,
  showAuthor = true,
  className = ""
}) => {
  const router = useRouter();

  // Mock blog tags (should match BlogSearchBar)
  const blogTags: BlogTag[] = [
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

  const handleBlogClick = (blogId: string) => {
    if (onBlogClick) {
      onBlogClick(blogId);
    } else {
      router.push(`/blog/${blogId}`);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTagInfo = (tagId: number) => {
    return blogTags.find(tag => tag.id === tagId) || {
      id: tagId,
      label: `Tag ${tagId}`,
      color: "#fb923c"
    };
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gradient-to-r from-gray-800/60 to-orange-900/30 rounded-xl p-6 border border-orange-500/20"
          >
            <div className="h-6 bg-gray-700/50 rounded mb-3"></div>
            <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
              <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpen className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-orange-300 mb-2">No blogs found</h3>
        <p className="text-gray-400">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {blogs.map((blog, index) => (
        <article
          key={blog.blog_id}
          className="group bg-gradient-to-r from-gray-800/80 to-orange-900/40 rounded-xl p-6 border border-orange-500/20 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-orange-500/40"
          onClick={() => handleBlogClick(blog.blog_id)}
        >
          {/* Blog Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-200 mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-300 leading-relaxed line-clamp-3 mb-3">
                {blog.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          {blog.tag_ids && blog.tag_ids.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tag_ids.slice(0, 5).map((tagId) => {
                const tag = getTagInfo(tagId);
                return (
                  <span
                    key={tagId}
                    style={{
                      background: tag.color + "33",
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                    className="px-3 py-1 rounded-full border text-xs font-semibold shadow hover:scale-105 transition-all"
                  >
                    {tag.emoji ? `${tag.emoji} ` : ""}
                    {tag.label}
                  </span>
                );
              })}
              {blog.tag_ids.length > 5 && (
                <span className="px-3 py-1 rounded-full border border-gray-500 text-gray-400 text-xs font-semibold">
                  +{blog.tag_ids.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Blog Footer */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              {showAuthor && blog.author_name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-orange-300">{blog.author_name}</span>
                </div>
              )}
              {blog.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium">Read more</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogSearchResults;