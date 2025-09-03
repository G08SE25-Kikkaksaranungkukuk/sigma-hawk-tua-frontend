"use client";

import { useState } from "react";
import { Camera, Save, Heart, Star, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import ProfilePictureModal from "../../components/editprofile/ProfilePictureModal";
import ResetPasswordModal from "../../components/editprofile/ResetPasswordModal";

const interestOptions = [
  { id: "nature", label: "🌿 Nature", color: "green" },
  { id: "food", label: "🍴 Food", color: "red" },
  { id: "culture", label: "🏛️ Culture", color: "purple" },
  { id: "adventure", label: "🏔️ Adventure", color: "blue" },
  { id: "beach", label: "🏖️ Beach", color: "cyan" },
  { id: "city", label: "🏙️ City", color: "slate" },
  { id: "cafe", label: "☕ Cafe", color: "amber" },
  { id: "historical", label: "🏛️ Historical", color: "yellow" },
  { id: "island", label: "🏝️ Island", color: "teal" },
  { id: "amusement", label: "🎢 Amusement Park", color: "pink" },
  { id: "temple", label: "🙏 Temple", color: "indigo" },
  { id: "zoo", label: "🦁 Zoo", color: "emerald" },
  { id: "shopping", label: "🛍️ Shopping Mall", color: "violet" },
  { id: "waterfall", label: "💧 Waterfall", color: "sky" },
  { id: "market", label: "🏪 Market", color: "orange" },
  { id: "theatre", label: "🎭 Theatre", color: "rose" }
];

const getColorClasses = (color: string, isSelected: boolean) => {
  if (!isSelected) {
    // ยังไม่คลิก: สีดำ + กรอบส้มอ่อน
    return "bg-slate-900 text-orange-300 border-2 border-orange-400/60 hover:border-orange-300 hover:text-orange-200";
  }
  
  // คลิกแล้ว: สีอ่อนๆ + กรอบสีที่ match
  const colorMap: { [key: string]: string } = {
    green: "bg-green-200/25 text-green-300 border-2 border-green-400/70",
    red: "bg-red-200/25 text-red-300 border-2 border-red-400/70",
    purple: "bg-purple-200/25 text-purple-300 border-2 border-purple-400/70",
    blue: "bg-blue-200/25 text-blue-300 border-2 border-blue-400/70",
    cyan: "bg-cyan-200/25 text-cyan-300 border-2 border-cyan-400/70",
    slate: "bg-slate-200/25 text-slate-300 border-2 border-slate-400/70",
    amber: "bg-amber-200/25 text-amber-300 border-2 border-amber-400/70",
    yellow: "bg-yellow-200/25 text-yellow-300 border-2 border-yellow-400/70",
    teal: "bg-teal-200/25 text-teal-300 border-2 border-teal-400/70",
    pink: "bg-pink-200/25 text-pink-300 border-2 border-pink-400/70",
    indigo: "bg-indigo-200/25 text-indigo-300 border-2 border-indigo-400/70",
    emerald: "bg-emerald-200/25 text-emerald-300 border-2 border-emerald-400/70",
    violet: "bg-violet-200/25 text-violet-300 border-2 border-violet-400/70",
    sky: "bg-sky-200/25 text-sky-300 border-2 border-sky-400/70",
    orange: "bg-orange-200/25 text-orange-300 border-2 border-orange-400/70",
    rose: "bg-rose-200/25 text-rose-300 border-2 border-rose-400/70"
  };
  
  return colorMap[color] || "bg-orange-200/25 text-orange-300 border-2 border-orange-400/70";
};

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

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
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


      <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative z-10">
        {/* Profile Picture Section */}
        <div className="bg-slate-800 px-6 py-8 text-center">
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
              className="mt-1 bg-slate-800 border-slate-700 text-white"
              placeholder="Current Name"
            />
          </div>

          {/* Interests Section */}
          <div>
            <Label className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">❤️</span> Interests
            </Label>
            <div className="my-3">
              {interestOptions.map((interest) => {
                const isSelected = formData.interests.includes(interest.id);
                const colorClasses = getColorClasses(interest.color, isSelected);
                return (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`px-4 py-3 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 w-fit shadow-md backdrop-blur-sm ${colorClasses}`}
                  >
                    {interest.label}
                  </button>
                );
              })}
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
              className="mt-1 bg-slate-800 border-slate-700 text-white"
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
              className="mt-1 bg-slate-800 border-slate-700 text-white"
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