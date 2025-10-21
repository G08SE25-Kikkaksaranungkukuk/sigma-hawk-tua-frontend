import { Heart, Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface BlogHeaderProps {
  title: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishDate: string;
  readTime: string;
  likes: number;
  tags: string[];
  coverImage: string;
}

export function BlogHeader({
  title,
  author,
  publishDate,
  readTime,
  likes,
  tags,
  coverImage,
}: BlogHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Hero Image */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
        <ImageWithFallback
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Tags Overlay */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-white/90 backdrop-blur-sm text-black hover:bg-white border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Like Count */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span className="text-sm text-black">{likes.toLocaleString()}</span>
        </div>
      </div>

      {/* Title and Author Info */}
      <div className="mt-8 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl mb-6">{title}</h1>
        
        <div className="flex items-center gap-6 flex-wrap">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-border">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-sm text-muted-foreground">{author.role}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}