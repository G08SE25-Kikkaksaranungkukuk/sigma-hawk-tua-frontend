import React, { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { ImageCropModal } from './ImageCropModal';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
  onFileChange?: (file: File | null) => void;
}

export function ImageUpload({ currentImage, onImageChange, onFileChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the original file and create URL for cropping
      const imageUrl = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalImageUrl(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
    onImageChange(croppedImageUrl);
    if (onFileChange) {
      onFileChange(croppedFile);
    }
    setShowCropModal(false);
    
    // Keep the original URL for re-cropping - don't clean it up
    // This allows users to re-crop the same image multiple times
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    
    // Clean up the original URL
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
      setOriginalImageUrl('');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    // Clear the current image
    onImageChange('');
    // Clear the file
    if (onFileChange) {
      onFileChange(null);
    }
    // Clean up original URL when actually removing the image
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
      setOriginalImageUrl('');
    }
    setOriginalFile(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDefaultImage = !currentImage || currentImage === '';

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
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleRemoveImage}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
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
        aria-label="Upload image file"
        title="Upload image file"
      />

      {/* Crop Modal */}
      {(originalImageUrl || currentImage) && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={handleCropCancel}
          imageUrl={originalImageUrl || currentImage}
          onCropComplete={handleCropComplete}
          fileName={originalFile?.name || 'cropped-image.jpg'}
        />
      )}

      <p className="text-[#9aa3b2] text-xs">
        Recommended: 1200x600px, JPG or PNG, max 5MB
      </p>
    </div>
  );
}