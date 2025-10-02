import { BentoBlogCard } from "./BentoBlogCard";

const blogPosts = [
  {
    id: 1,
    title: "Building Modern Web Applications with React and TypeScript",
    excerpt: "Discover the best practices for building scalable and maintainable web applications using React, TypeScript, and modern development tools. Learn how to structure your project for long-term success and create applications that scale.",
    image: "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NTkwNzQ4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Development",
    author: "Sarah Chen",
    date: "Sep 25, 2025",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "The Future of AI in Software Development",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we write code, test applications, and deploy software. From code generation to automated testing, AI is changing everything we know about development.",
    image: "https://images.unsplash.com/photo-1625314887424-9f190599bd56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3R8ZW58MXx8fHwxNzU5MDMzNzk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "AI",
    author: "Marcus Rodriguez",
    date: "Sep 22, 2025",
    readTime: "12 min read"
  },
  {
    id: 3,
    title: "Designing Intuitive User Interfaces: A Complete Guide",
    excerpt: "Learn the principles of good UI design and how to create interfaces that users love. From color theory to typography, spacing, and interaction design patterns.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB1aSUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTkwNzUwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Design",
    author: "Emma Thompson",
    date: "Sep 20, 2025",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Building a Successful Tech Startup: Lessons Learned",
    excerpt: "Insights from entrepreneurs who have built successful tech companies. Learn about common pitfalls, funding strategies, and how to build a team that can execute your vision.",
    image: "https://images.unsplash.com/photo-1702468049239-49fd1cf99d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydXAlMjBidXNpbmVzcyUyMHRlYW18ZW58MXx8fHwxNzU5MDAxODI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Business",
    author: "David Park",
    date: "Sep 18, 2025",
    readTime: "15 min read"
  },
  {
    id: 5,
    title: "Mobile App Development: Native vs Cross-Platform",
    excerpt: "A comprehensive comparison of native development versus cross-platform solutions. Understand the pros and cons of each approach and when to choose which strategy.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NTkwMjEzNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Mobile",
    author: "Lisa Wang",
    date: "Sep 15, 2025",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "Remote Work: Building Productive Development Teams",
    excerpt: "Best practices for managing remote development teams, tools that enhance collaboration, and strategies for maintaining team culture in a distributed environment.",
    image: "https://images.unsplash.com/photo-1505495142263-9357db572571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwYmxvZyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTkwNzUwMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Remote Work",
    author: "James Mitchell",
    date: "Sep 12, 2025",
    readTime: "9 min read"
  }
];

// Smart layout function based on content properties
const getLayoutSize = (post: typeof blogPosts[0], index: number) => {
  // First post is always featured
  if (index === 0) return { size: "featured", orientation: "horizontal" };
  
  // Determine size based on content characteristics
  const readTimeMinutes = parseInt(post.readTime);
  const isLongContent = readTimeMinutes >= 12;
  const isMediumContent = readTimeMinutes >= 8;
  
  // Priority categories that should be larger
  const priorityCategories = ["AI", "Development", "Business"];
  const isPriority = priorityCategories.includes(post.category);
  
  // Recent posts (within last 5 days) get priority
  const postDate = new Date(post.date);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 3600 * 24));
  const isRecent = daysDiff <= 5;
  
  // Decision logic
  if (isLongContent || (isPriority && isRecent)) {
    return { size: "large", orientation: "vertical" };
  } else if (isMediumContent || isPriority || isRecent) {
    return { size: "medium", orientation: "vertical" };
  } else {
    return { size: "small", orientation: "vertical" };
  }
};

// Alternative: Predefined pattern for consistent visual balance
const bentoLayoutPattern = [
  { size: "featured", orientation: "horizontal" }, // First post - always featured
  { size: "medium", orientation: "vertical" },     // Second post
  { size: "medium", orientation: "vertical" },     // Third post
  { size: "small", orientation: "vertical" },      // Fourth post
  { size: "small", orientation: "vertical" },      // Fifth post
  { size: "large", orientation: "vertical" },      // Sixth post
];

// Choose which approach to use
const USE_SMART_LAYOUT = true; // Set to true for content-based sizing

export function BlogSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-transparent">
      <div className="text-center mb-12">
        <h2 className="mb-4 text-4xl font-bold text-orange-500">Latest Blog Posts</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest insights, tutorials, and trends in technology, 
          design, and business from our expert team.
        </p>
      </div>
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-[minmax(250px,auto)] gap-4">
        {blogPosts.map((post, index) => {
          // Use smart layout or predefined pattern
          const layout = USE_SMART_LAYOUT 
            ? getLayoutSize(post, index)
            : bentoLayoutPattern[index] || { size: "medium", orientation: "vertical" };
          
          return (
            <BentoBlogCard 
              key={post.id} 
              post={post} 
              size={layout.size as "small" | "medium" | "large" | "featured"}
              orientation={layout.orientation as "horizontal" | "vertical"}
            />
          );
        })}
      </div>
      
      <div className="text-center mt-12">
        <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          View All Posts
        </button>
      </div>
    </section>
  );
}