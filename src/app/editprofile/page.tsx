"use client";

import { useState } from "react";
import { Camera, Save, Heart, Star, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import ProfilePictureModal from "../../components/ProfilePictureModal";
import ResetPasswordModal from "../../components/ResetPasswordModal";

const interestOptions = [
  "CAFE", "NATIONAL PARK", "HISTORICAL", "ISLAND", 
  "AMUSEMENT PARK", "TEMPLE", "ZOO", "SHOPPING MALL",
  "WATERFALL", "MARKET", "MOUNTAIN", "THEATRE"
];

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    interests: [] as string[]
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
  };

  const handleResetPassword = () => {
    setIsResetPasswordModalOpen(true);
  };

  const handlePasswordReset = (passwordData: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    console.log("Password reset data:", passwordData);
    // Here you would typically call an API to reset the password
    // For now, we'll just log the data
  };

  const handleImageSelect = (imageFile: File | null) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setProfileImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full animate-bounce"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-8 h-8 bg-orange-500/25 rounded-full animate-pulse"></div>
        <Star className="absolute top-32 right-32 text-orange-500/40 w-6 h-6 animate-pulse" />
        <Sparkles className="absolute bottom-32 left-32 text-orange-400/40 w-5 h-5 animate-bounce" />
        <Heart className="absolute top-1/2 right-10 text-orange-300/40 w-4 h-4 animate-pulse" />
        <div className="absolute top-1/4 left-16 w-6 h-6 bg-orange-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Header */}
      <div className="flex justify-center mt-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 shadow-md w-full max-w-md">
          <div className="flex items-center">
            <ArrowLeft className="w-6 h-6 text-black mr-3" />
            <h1 className="text-black text-xl font-bold flex-1 text-center mr-9">
              Edit your Profile
            </h1>
            <Star className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>


      <div className="max-w-md mx-auto bg-slate-800 min-h-screen relative z-10">
        {/* Profile Picture Section */}
        <div className="bg-slate-700 px-6 py-8 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-600" />
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-4 right-4 bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 py-6 space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">👤</span> Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 bg-slate-700 border-slate-600 text-white"
              placeholder="Current Name"
            />
          </div>

          {/* Interests Section */}
          <div>
            <Label className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">❤️</span> Interests
            </Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-orange-500 text-black'
                      : 'bg-slate-700 text-orange-500 border border-orange-500'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <Label htmlFor="phoneNumber" className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">📱</span> Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 bg-slate-700 border-slate-600 text-white"
              placeholder="Current Phone Number"
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">📧</span> Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 bg-slate-700 border-slate-600 text-white"
              placeholder="Current Email"
            />
          </div>

          {/* Change Password Section */}
          <div>
            <Label className="text-white text-sm">Change password</Label>
            <Button
              onClick={handleResetPassword}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg"
            >
              Reset Password
            </Button>
          </div>

          {/* Confirm Changes Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="text-black"></span>
              Confirm Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImage={profileImage || undefined}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onConfirm={handlePasswordReset}
      />
    </div>
  );
}