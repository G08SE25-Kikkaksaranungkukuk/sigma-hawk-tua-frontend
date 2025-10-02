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
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-2",
    large: "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
    featured: "col-span-1 md:col-span-4 lg:col-span-6 row-span-1"
  };

  const imageHeights = {
    small: "h-32",
    medium: "h-40 md:h-48",
    large: "h-48 md:h-56",
    featured: "h-64 md:h-80"
  };

  const isHorizontal = orientation === "horizontal" || size === "featured";

  return (
    <Card className={`group cursor-pointer overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-black/30 backdrop-blur-lg hover:bg-black/50 ${sizeClasses[size]} ${isHorizontal ? 'flex flex-row h-full' : 'flex flex-col h-full'}`}>
      <div className={`relative overflow-hidden ${isHorizontal ? 'w-1/2 flex-shrink-0' : 'w-full flex-shrink-0'}`}>
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className={`w-full ${imageHeights[size]} object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-orange-500/90 text-white backdrop-blur-sm border-0 shadow-sm hover:bg-orange-600/90 transition-colors">
            {post.category}
          </Badge>
        </div>

        {/* Read More Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="w-8 h-8 bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-600/90 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <CardContent className={`flex flex-col justify-between ${isHorizontal ? 'w-1/2 p-6' : 'flex-1 p-6'} ${size === 'small' ? 'p-4' : ''}`}>
        <div>
          <h3 className={`mb-3 line-clamp-2 text-white group-hover:text-orange-400 transition-colors ${
            size === 'large' || size === 'featured' ? 'text-xl' : 
            size === 'medium' ? 'text-lg' : 'text-base'
          }`}>
            {post.title}
          </h3>
          
          {size !== 'small' && (
            <p className={`text-gray-400 mb-4 ${
              size === 'large' || size === 'featured' ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm'
            }`}>
              {post.excerpt}
            </p>
          )}
        </div>
        
        <div className={`flex items-center justify-between text-xs text-gray-400 ${
          size === 'small' ? 'flex-col items-start space-y-2' : 'flex-row'
        }`}>
          <div className={`flex items-center ${size === 'small' ? 'flex-col items-start space-y-1' : 'space-x-4'}`}>
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span className={size === 'small' ? 'text-xs' : 'text-sm'}>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span className={size === 'small' ? 'text-xs' : 'text-sm'}>{post.date}</span>
            </div>
          </div>
          
          {size !== 'small' && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="text-sm">{post.readTime}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}