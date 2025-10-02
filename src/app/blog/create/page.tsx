'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InterestsPill } from '@/components/ui/interests-pill';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingElements } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  Calendar,
  Tag
} from 'lucide-react';


export default function App() {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc1OTI1MjIxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  const [showCover, setShowCover] = useState(true);
  const [tags, setTags] = useState(['Travel', 'Adventure', 'Beach']);

  return (
    <div className="min-h-screen bg-background">
      <FloatingElements />
      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 pb-100">
        <Card className="bg-[#12131a]/90 backdrop-blur-sm border border-gray-800/70 shadow-2xl mb-24">
          {/* Cover Image */}
          {showCover && (
            <div className="relative group">
              <ImageWithFallback
                src={coverImage}
                alt="Cover"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const images = [
                      'https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc1OTI1MjIxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                      'https://images.unsplash.com/photo-1568345835090-e48fb14389db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMHRyYXZlbHxlbnwxfHx8fDE3NTkzMzA0MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                      'https://images.unsplash.com/photo-1688311305063-63c25e56f2e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiYWNrcGFja3xlbnwxfHx8fDE3NTkzMTQzODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
                    ];
                    const currentIndex = images.indexOf(coverImage);
                    const nextIndex = (currentIndex + 1) % images.length;
                    setCoverImage(images[nextIndex]);
                  }}
                >
                  Change Cover
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCover(false)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {!showCover && (
              <Button
                variant="ghost"
                size="sm"
                className="mb-8"
                onClick={() => setShowCover(true)}
              >
                Add Cover Image
              </Button>
            )}

            {/* Post Meta */}
            <div className="mb-8 space-y-4">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span>John Doe</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      October 1, 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-7 rounded-full px-3">
                  + Add tag
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Travel Story"
                className="w-full text-5xl font-bold border-none outline-none bg-transparent placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="pb-8">
              <RichTextEditor />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}