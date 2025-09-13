import React, { useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For demo purposes, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    // Reset to default image
    onImageChange('https://images.unsplash.com/photo-1710608646861-cb7f10c8bc4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMHRyb3BpY2FsJTIwYmVhY2h8ZW58MXx8fHwxNzU3NzM5NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  };

  const isDefaultImage = currentImage.includes('unsplash.com');

  return (
    <div className="space-y-3">
      <p className="text-[#9aa3b2] text-sm">Upload a cover image for your group</p>
      
      {/* Image Preview */}
      <div className="relative">
        <div className="w-full h-32 bg-[#1a1b23] rounded-xl border-2 border-dashed border-gray-700 overflow-hidden">
          {currentImage ? (
            <div className="relative w-full h-full">
              <img 
                src={currentImage} 
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              {!isDefaultImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#9aa3b2]">
              <Image className="w-8 h-8 mb-2" />
              <span className="text-sm">No image selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1b23] hover:bg-[#2a2b33] text-[#e8eaee] border border-gray-700 hover:border-[#ff6600]/50 rounded-lg transition-all duration-200"
      >
        <Upload className="w-4 h-4" />
        {currentImage && !isDefaultImage ? 'Change Image' : 'Upload Image'}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-[#9aa3b2] text-xs">
        Recommended: 1200x600px, JPG or PNG, max 5MB
      </p>
    </div>
  );
}