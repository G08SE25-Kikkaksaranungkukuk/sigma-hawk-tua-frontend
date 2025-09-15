import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crop, X } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string, croppedFile: File) => void;
  fileName?: string;
}

export function ImageCropModal({ isOpen, onClose, imageUrl, onCropComplete, fileName = 'cropped-image.jpg' }: ImageCropModalProps) {
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a resize handle
    if (target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeHandle(target.dataset.handle || '');
      setDragStart({ x, y });
    } else {
      // Regular drag to move the crop area
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  }, [cropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isResizing && resizeHandle) {
      // Handle resizing
      let newCropArea = { ...cropArea };
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      switch (resizeHandle) {
        case 'nw': // Top-left
          newCropArea.x = Math.max(0, cropArea.x + deltaX);
          newCropArea.y = Math.max(0, cropArea.y + deltaY);
          newCropArea.width = Math.max(50, cropArea.width - deltaX);
          newCropArea.height = Math.max(50, cropArea.height - deltaY);
          break;
        case 'ne': // Top-right
          newCropArea.y = Math.max(0, cropArea.y + deltaY);
          newCropArea.width = Math.max(50, Math.min(rect.width - cropArea.x, cropArea.width + deltaX));
          newCropArea.height = Math.max(50, cropArea.height - deltaY);
          break;
        case 'sw': // Bottom-left
          newCropArea.x = Math.max(0, cropArea.x + deltaX);
          newCropArea.width = Math.max(50, cropArea.width - deltaX);
          newCropArea.height = Math.max(50, Math.min(rect.height - cropArea.y, cropArea.height + deltaY));
          break;
        case 'se': // Bottom-right
          newCropArea.width = Math.max(50, Math.min(rect.width - cropArea.x, cropArea.width + deltaX));
          newCropArea.height = Math.max(50, Math.min(rect.height - cropArea.y, cropArea.height + deltaY));
          break;
        case 'n': // Top
          newCropArea.y = Math.max(0, cropArea.y + deltaY);
          newCropArea.height = Math.max(50, cropArea.height - deltaY);
          break;
        case 's': // Bottom
          newCropArea.height = Math.max(50, Math.min(rect.height - cropArea.y, cropArea.height + deltaY));
          break;
        case 'w': // Left
          newCropArea.x = Math.max(0, cropArea.x + deltaX);
          newCropArea.width = Math.max(50, cropArea.width - deltaX);
          break;
        case 'e': // Right
          newCropArea.width = Math.max(50, Math.min(rect.width - cropArea.x, cropArea.width + deltaX));
          break;
      }

      // Ensure crop area stays within bounds
      newCropArea.x = Math.max(0, Math.min(newCropArea.x, rect.width - newCropArea.width));
      newCropArea.y = Math.max(0, Math.min(newCropArea.y, rect.height - newCropArea.height));

      setCropArea(newCropArea);
      setDragStart({ x, y });
    } else if (isDragging) {
      // Handle dragging (moving the crop area)
      const newX = Math.max(0, Math.min(x - dragStart.x, rect.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragStart.y, rect.height - cropArea.height));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, cropArea]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  const getCroppedImage = useCallback(async (): Promise<{ url: string; file: File }> => {
    if (!imageRef.current || !containerRef.current) {
      throw new Error('Image not loaded');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const image = imageRef.current;
    const container = containerRef.current;
    
    // Get the actual displayed image dimensions and position
    const imageRect = image.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate the actual image display size within the container
    const displayedImageWidth = Math.min(
      container.offsetWidth,
      (image.naturalWidth * container.offsetHeight) / image.naturalHeight
    );
    const displayedImageHeight = Math.min(
      container.offsetHeight,
      (image.naturalHeight * container.offsetWidth) / image.naturalWidth
    );
    
    // Calculate offset of image within container (for object-contain centering)
    const imageOffsetX = (container.offsetWidth - displayedImageWidth) / 2;
    const imageOffsetY = (container.offsetHeight - displayedImageHeight) / 2;
    
    // Adjust crop area relative to the actual displayed image
    const adjustedCropArea = {
      x: Math.max(0, cropArea.x - imageOffsetX),
      y: Math.max(0, cropArea.y - imageOffsetY),
      width: Math.min(cropArea.width, displayedImageWidth - Math.max(0, cropArea.x - imageOffsetX)),
      height: Math.min(cropArea.height, displayedImageHeight - Math.max(0, cropArea.y - imageOffsetY))
    };
    
    // Calculate the scale between displayed image and actual image
    const scaleX = image.naturalWidth / displayedImageWidth;
    const scaleY = image.naturalHeight / displayedImageHeight;

    // Calculate actual crop area in original image coordinates
    const actualCropArea = {
      x: adjustedCropArea.x * scaleX,
      y: adjustedCropArea.y * scaleY,
      width: adjustedCropArea.width * scaleX,
      height: adjustedCropArea.height * scaleY
    };

    // Set canvas size to crop area size
    canvas.width = actualCropArea.width;
    canvas.height = actualCropArea.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      actualCropArea.x, actualCropArea.y, actualCropArea.width, actualCropArea.height,
      0, 0, actualCropArea.width, actualCropArea.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          resolve({ url, file });
        }
      }, 'image/jpeg', 0.9);
    });
  }, [cropArea, fileName]);

  const handleCrop = async () => {
    try {
      const { url, file } = await getCroppedImage();
      onCropComplete(url, file);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Set initial crop area to center of the actual displayed image
    if (containerRef.current && imageRef.current) {
      const container = containerRef.current;
      const image = imageRef.current;
      
      // Calculate the actual displayed image dimensions
      const displayedImageWidth = Math.min(
        container.offsetWidth,
        (image.naturalWidth * container.offsetHeight) / image.naturalHeight
      );
      const displayedImageHeight = Math.min(
        container.offsetHeight,
        (image.naturalHeight * container.offsetWidth) / image.naturalWidth
      );
      
      // Calculate offset of image within container (for object-contain centering)
      const imageOffsetX = (container.offsetWidth - displayedImageWidth) / 2;
      const imageOffsetY = (container.offsetHeight - displayedImageHeight) / 2;
      
      // Set crop area to center 80% of the displayed image
      const cropWidth = displayedImageWidth * 0.8;
      const cropHeight = displayedImageHeight * 0.6;
      
      setCropArea({
        x: imageOffsetX + (displayedImageWidth - cropWidth) / 2,
        y: imageOffsetY + (displayedImageHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  // Don't render modal if no valid image URL is provided
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#12131a] border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-orange-400">Crop Your Image</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adjust the crop area by dragging the handles or moving the selection area.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-gray-300 text-sm space-y-1">
            <p><strong>Instructions:</strong></p>
            <p>• Drag the crop area to move it around</p>
            <p>• Drag the corner handles to resize freely</p>
            <p>• Drag the edge handles to resize in one direction</p>
          </div>

          <div 
            ref={containerRef}
            className="relative w-full h-80 bg-black rounded-lg overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imageUrl ? (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Image to crop"
                className="w-full h-full object-contain"
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <span>No image to crop</span>
              </div>
            )}

            {imageLoaded && (
              <>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />
                
                {/* Crop area */}
                <div
                  className="absolute border-2 border-orange-500 bg-transparent"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                  }}
                >
                  {/* Transparent interior */}
                  <div className="absolute inset-0 bg-transparent cursor-move" />
                  
                  {/* Corner resize handles */}
                  <div 
                    className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-orange-500 cursor-nw-resize hover:bg-orange-400" 
                    data-handle="nw"
                  />
                  <div 
                    className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-orange-500 cursor-ne-resize hover:bg-orange-400" 
                    data-handle="ne"
                  />
                  <div 
                    className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-orange-500 cursor-sw-resize hover:bg-orange-400" 
                    data-handle="sw"
                  />
                  <div 
                    className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 cursor-se-resize hover:bg-orange-400" 
                    data-handle="se"
                  />
                  
                  {/* Edge resize handles */}
                  <div 
                    className="resize-handle absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-500 cursor-n-resize hover:bg-orange-400" 
                    data-handle="n"
                  />
                  <div 
                    className="resize-handle absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-500 cursor-s-resize hover:bg-orange-400" 
                    data-handle="s"
                  />
                  <div 
                    className="resize-handle absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-3 bg-orange-500 cursor-w-resize hover:bg-orange-400" 
                    data-handle="w"
                  />
                  <div 
                    className="resize-handle absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-3 bg-orange-500 cursor-e-resize hover:bg-orange-400" 
                    data-handle="e"
                  />
                  
                  {/* Dimension display */}
                  <div className="absolute -bottom-6 left-0 text-xs text-orange-400 bg-black/50 px-1 rounded">
                    {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>Crop Area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px</span>
            <span>Position: ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})</span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleCrop}
            className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] hover:from-[#e55a00] hover:to-[#ff6600]"
            disabled={!imageLoaded}
          >
            <Crop className="w-4 h-4 mr-2" />
            Crop Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}