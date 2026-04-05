import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

interface BentoBlogCardProps {
  post: BlogPost;
  size?: "small" | "medium" | "large" | "featured";
  orientation?: "horizontal" | "vertical";
}

export function BentoBlogCard({ post, size = "medium", orientation = "vertical" }: BentoBlogCardProps) {
  const sizeClasses = {
    small: "col-span-1 row-span-1 min-h-[250px]",
    medium: "col-span-1 md:col-span-2 row-span-2 min-h-[400px]",
    large: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[400px]",
    featured: "col-span-1 md:col-span-4 lg:col-span-6 row-span-1 min-h-[400px]"
  };

  return (
    <Card className={`group cursor-pointer overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-black/30 backdrop-blur-lg hover:bg-black/50 ${sizeClasses[size]} relative`}>
      {/* Background Image */}
      <ImageWithFallback
        src={post.image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay - Always visible, stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300"></div>
      
      {/* Content Overlay */}
      <CardContent className="relative h-full flex flex-col justify-between p-6 z-10">
        {/* Top Section - Category Badge */}
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-orange-500/90 text-white backdrop-blur-sm border-0 shadow-sm hover:bg-orange-600/90 transition-colors">
            {post.category}
          </Badge>
          
          {/* Read More Icon */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="w-8 h-8 bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-600/90 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Section - Title, Description, and Date */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className={`font-bold text-white group-hover:text-orange-400 transition-colors ${
            size === 'large' || size === 'featured' ? 'text-2xl line-clamp-3' : 
            size === 'medium' ? 'text-xl line-clamp-2' : 'text-lg line-clamp-2'
          }`}>
            {post.title}
          </h3>
          
          {/* Description - Show on medium, large, and featured */}
          {size !== 'small' && (
            <p className={`text-gray-300 group-hover:text-gray-200 transition-colors ${
              size === 'large' || size === 'featured' ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'
            }`}>
              {post.excerpt}
            </p>
          )}

          {/* Date and Read Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            {size !== 'small' && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}