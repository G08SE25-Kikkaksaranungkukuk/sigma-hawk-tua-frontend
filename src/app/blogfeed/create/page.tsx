'use client';

import { useState, useRef } from 'react';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InterestsPill } from '@/components/ui/interests-pill';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingElements } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ImageCropModal } from '@/components/ImageCropModal';
import {
  Calendar,
  Tag,
  Image,
  Upload
} from 'lucide-react';


export default function App() {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [showCover, setShowCover] = useState(true);
  const [tags, setTags] = useState(['Travel', 'Adventure', 'Beach']);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageToCrop(result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    try {
      // Here you would typically send the post data to your backend
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
    setCoverImage(croppedImageUrl);
    setIsCropModalOpen(false);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingElements />
      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 pb-100">
        <Card className="bg-[#12131a]/90 backdrop-blur-sm border border-gray-800/70 shadow-2xl mb-24">
          {/* Cover Image */}
          {showCover && (
            <div className="relative h-64 overflow-hidden group">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full bg-[#1a1b23] border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-[#9aa3b2] cursor-pointer hover:bg-[#1f2029] transition-colors"
                  onClick={triggerImageUpload}
                >
                  <Upload className="w-12 h-12 mb-3" />
                  <span className="text-lg">Click to upload image</span>
                  <span className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={triggerImageUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {coverImage ? 'Change Cover' : 'Upload Cover'}
                </Button>
                {coverImage && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCoverImage('')}
                  >
                    Remove
                  </Button>
                )}
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
                <Upload className="w-4 h-4 mr-2" />
                Add Cover Image
              </Button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload cover image"
            />

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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button 
                variant="outline" 
                className="border-border/50 hover:bg-accent/50"
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
                onClick={handleCreatePost}
              >
                Create Post
              </Button>
            </div>
          </div>
        </Card>

        {/* Image Crop Modal */}
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          imageUrl={imageToCrop}
          onCropComplete={handleCropComplete}
          fileName="blog-cover.jpg"
        />
      </main>
    </div>
  );
}