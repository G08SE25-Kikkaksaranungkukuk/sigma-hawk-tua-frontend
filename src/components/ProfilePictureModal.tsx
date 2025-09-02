"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageFile: File | null) => void;
  currentImage?: string;
}

export default function ProfilePictureModal({ 
  isOpen, 
  onClose, 
  onImageSelect, 
  currentImage 
}: ProfilePictureModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    onImageSelect(selectedFile);
    onClose();
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    onImageSelect(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-800 rounded-lg max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-black text-lg font-bold">Edit Profile Picture</h2>
                <button onClick={onClose} className="text-black hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Profile Picture Preview */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Options */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  onClick={handleUploadClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-orange-500 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {selectedImage ? "Change Photo" : "Upload Photo"}
                </Button>

                {selectedImage && (
                  <Button
                    onClick={handleRemove}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500/10 py-3 rounded-lg"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>

              {/* File Info */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Supported formats: JPG, PNG, GIF
                </p>
                <p className="text-gray-400 text-sm">
                  Maximum size: 5MB
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-500/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  disabled={!selectedFile && !currentImage}
                >
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
