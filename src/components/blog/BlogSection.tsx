import { BentoBlogCard } from "./BentoBlogCard";
import { blogService } from "@/lib/services/blog/blogService";
import { Blog } from "@/lib/types/api";
import { useEffect, useState } from "react";

// Helper function to extract image URL from json_config
const extractImageFromJsonConfig = (jsonConfig: string): string | null => {
  try {
    const config = JSON.parse(jsonConfig);
    const findImage = (content: any[]): string | null => {
      for (const node of content) {
        if (node.type === 'image' && node.attrs?.src) {
          return node.attrs.src;
        }
        if (node.content) {
          const found = findImage(node.content);
          if (found) return found;
        }
      }
      return null;
    };
    return findImage(config.content || []);
  } catch {
    return null;
  }
};

// Helper function to calculate read time based on content
const calculateReadTime = (htmlOutput: string): string => {
  const text = htmlOutput.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed: 200 words/min
  return `${readTime} min read`;
};

// Transform Blog API data to the format expected by BentoBlogCard
const transformBlogData = (blog: Blog) => {
  const imageUrl = extractImageFromJsonConfig(blog.json_config);
  const category = blog.blog_interests.length > 0 
    ? blog.blog_interests[0].interest_name || "General" 
    : "General";
  
  return {
    id: blog.blog_id,
    title: blog.title,
    excerpt: blog.description,
    image: imageUrl || "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?w=1080", // Fallback image
    category: category,
    author: `User ${blog.user_id}`, // You might want to fetch user details separately
    date: new Date(blog.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    readTime: calculateReadTime(blog.html_output)
  };
};

// Repeating Bento layout pattern for neat alignment
const getLayoutPattern = (index: number): { size: "small" | "medium" | "large" | "featured", orientation: "horizontal" | "vertical" } => {
  // First post is always featured
  if (index === 0) return { size: "featured", orientation: "horizontal" };
  
  // Define a repeating pattern that tiles nicely in the grid
  // Pattern repeats every 8 posts after the featured one
  const patterns = [
    { size: "medium", orientation: "vertical" },   // Post 1
    { size: "medium", orientation: "vertical" },   // Post 2
    { size: "small", orientation: "vertical" },    // Post 3
    { size: "small", orientation: "vertical" },    // Post 4
    { size: "large", orientation: "vertical" },    // Post 5
    { size: "small", orientation: "vertical" },    // Post 6
    { size: "medium", orientation: "vertical" },   // Post 7
    { size: "medium", orientation: "vertical" },   // Post 8
  ] as const;
  
  // Use modulo to repeat the pattern
  const patternIndex = (index - 1) % patterns.length;
  return patterns[patternIndex];
};

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllBlogs();
        setBlogs(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Transform blogs to the format expected by BentoBlogCard
  const blogPosts = blogs.map(transformBlogData);

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto bg-transparent">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-orange-500">Latest Blog Posts</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Loading blog posts...
          </p>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto bg-transparent">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-orange-500">Latest Blog Posts</h2>
          <p className="text-red-400 max-w-2xl mx-auto">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-4xl font-bold text-orange-500">Latest Blog Posts</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Stay inspired with the latest travel stories, destination guides, and adventure tips from our passionate explorers.
        </p>
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(250px,auto)] gap-4">
        {blogPosts.map((post, index) => {
          const layout = getLayoutPattern(index);
          
          return (
            <BentoBlogCard 
              key={post.id} 
              post={post} 
              size={layout.size}
              orientation={layout.orientation}
            />
          );
        })}
      </div>
      
      {blogPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No blog posts available yet.</p>
        </div>
      )}
      
      {/* <div className="text-center mt-12">
        <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          View All Posts
        </button>
      </div> */}
    </section>
  );
}