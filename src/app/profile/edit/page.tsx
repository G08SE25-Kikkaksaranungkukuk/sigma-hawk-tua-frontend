"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Star,
  Sparkles,
  Heart,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import ProfilePictureModal from "../../../components/editprofile/ProfilePictureModal";
import ResetPasswordModal from "../../../components/editprofile/ResetPasswordModal";
import { useCurrentUser } from "../../../lib/hooks/user/useCurrentUser";
import { useUserProfile } from "../../../lib/hooks";
import { interestOptions, travelStyleOptions, getColorClasses } from "../../../components/editprofile/profileOptions";
import {
  handleInputChange,
  handleInterestToggle,
  handleTravelStyleToggle,
  handleSave,
  handleResetPassword,
  handlePasswordReset,
  handleBackClick,
  handleImageSelect,
} from "../../../components/editprofile/profileHandlers";
import ConfirmationDialog  from "../../../components/editprofile/ConfirmationDialog";
export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, loading: currentUserLoading, error: currentUserError, refreshCurrentUser } = useCurrentUser();
  const { userProfile, loading, error } = useUserProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    interests: [] as string[],
    travelStyle: [] as string[],
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    interests: "",
    travelStyle: "",
  });

  // Format phone number to display format (0xx-xxx-xxxx)
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return phone;
  };

  // Load user profile data into form
  useEffect(() => {
    const profileData = userProfile || currentUser;
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        middleName: profileData.middleName || "",
        phoneNumber: formatPhoneNumber(profileData.phoneNumber || ""),
        interests: profileData.interests || [],
        travelStyle: profileData.travelStyle || [],
      });
      setProfileImage(profileData.profileImage || null);
    }
  }, [userProfile, currentUser]);

  // Validate form fields
  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      interests: "",
      travelStyle: "",
    };
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    const phoneRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be in format 0xx-xxx-xxxx";
    }
    if (formData.interests.length === 0) errors.interests = "Please select at least 1 interest";
    if (formData.travelStyle.length === 0) errors.travelStyle = "Please select at least 1 travel style";
    setValidationErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  // Check if form is valid for enabling save button
  const isFormValid = () => (
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    /^0\d{2}-\d{3}-\d{4}$/.test(formData.phoneNumber) &&
    formData.interests.length > 0 &&
    formData.travelStyle.length > 0
  );

  // Config for rendering name fields
  const nameFields = [
    {
      id: "firstName",
      label: "First Name",
      required: true,
      icon: "👤",
      placeholder: "Enter your first name",
      error: validationErrors.firstName,
    },
    {
      id: "lastName",
      label: "Last Name",
      required: true,
      icon: "👤",
      placeholder: "Enter your last name",
      error: validationErrors.lastName,
    },
    {
      id: "middleName",
      label: "Middle Name",
      required: false,
      icon: "👤",
      placeholder: "Enter your middle name (optional)",
      error: undefined,
      optional: true,
    },
  ];

  // Handler wrappers for passing to children/components
  const handleInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e, setFormData, setValidationErrors);
  };
  const handleInterestToggleWrapper = (interestId: string) => {
    handleInterestToggle(interestId, setFormData, setValidationErrors);
  };
  const handleTravelStyleToggleWrapper = (styleId: string) => {
    handleTravelStyleToggle(styleId, setFormData, setValidationErrors);
  };
  const handleSaveWrapper = () => {
    handleSave({
      loading,
      currentUserLoading,
      validateForm,
      currentUser,
      formData,
      profileImage,
      setValidationErrors,
      refreshCurrentUser,
      router,
      setFormData,
      setProfileImage,
    });
  };
  const handleResetPasswordWrapper = () => {
    handleResetPassword(setIsResetPasswordModalOpen);
  };
  const handlePasswordResetWrapper = (passwordData: { oldPassword: string; newPassword: string; confirmPassword: string; }) => {
    handlePasswordReset(passwordData);
  };
  const handleBackClickWrapper = () => {
    handleBackClick(router);
  };
  const handleImageSelectWrapper = (imageFile: File | null) => {
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
      {/* Loading overlay */}
      {(loading || currentUserLoading) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-white mt-2">Loading profile...</p>
          </div>
        </div>
      )}

      {/* Error display */}
      {(error || currentUserError) && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg z-40">
          {error || currentUserError}
        </div>
      )}

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
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
      <div className="flex justify-center mt-6 relative z-50">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 shadow-md w-full max-w-md">
          <div className="flex items-center">
            <button
              onClick={handleBackClickWrapper}
              className="mr-3 hover:bg-black/20 hover:scale-110 p-2 rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/30 cursor-pointer relative z-10"
              aria-label="Go back to home page"
              type="button"
            >
              <ArrowLeft className="w-6 h-6 text-black pointer-events-none" />
            </button>
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
          {/* Name Fields */}
          <div className="space-y-4">
            {nameFields.map(f => (
              <div key={f.id}>
                <Label htmlFor={f.id} className="text-orange-500 text-sm flex items-center gap-2">
                  <span className="text-orange-500">{f.icon}</span> {f.label} {f.required && <span className="text-red-500">*</span>}
                  {f.optional && <span className="text-gray-400 text-xs">(optional)</span>}
                </Label>
                <Input
                  id={f.id}
                  name={f.id}
                  type="text"
                  value={formData[f.id as keyof typeof formData]}
                  onChange={handleInputChangeWrapper}
                  className={`mt-1 bg-slate-800 border-slate-700 text-white ${f.error ? "border-red-500" : ""}`}
                  placeholder={f.placeholder}
                />
                {f.error && <p className="text-red-500 text-xs mt-1">{f.error}</p>}
              </div>
            ))}
          </div>

          {/* Interests Section */}
          <div>
            <Label className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">❤️</span> Interests <span className="text-red-500">*</span>
            </Label>
            <div className="my-3">
              {interestOptions.map((interest) => {
                const isSelected = formData.interests.includes(interest.id);
                const colorClasses = getColorClasses(interest.color, isSelected);
                return (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggleWrapper(interest.id)}
                    className={`px-4 py-3 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 w-fit shadow-md backdrop-blur-sm ${colorClasses}`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
            {validationErrors.interests && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.interests}</p>
            )}
          </div>

          {/* Travel Style Section */}
          <div>
            <Label className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">🧳</span> Travel Style <span className="text-red-500">*</span>
            </Label>
            <div className="mt-3 space-y-3">
              {travelStyleOptions.map((style) => {
                const isChecked = formData.travelStyle.includes(style.id);
                return (
                  <div key={style.id} className="flex items-center space-x-3">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={`travel-${style.id}`}
                        checked={isChecked}
                        onChange={() => handleTravelStyleToggleWrapper(style.id)}
                        className="sr-only"
                      />
                      <div
                        onClick={() => handleTravelStyleToggleWrapper(style.id)}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${isChecked ? "bg-orange-500 border-orange-500" : "bg-transparent border-orange-400/60 hover:border-orange-300"}`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <label htmlFor={`travel-${style.id}`} className="text-orange-300 text-sm cursor-pointer select-none hover:text-orange-200 transition-colors">
                      {style.label}
                    </label>
                  </div>
                );
              })}
            </div>
            {validationErrors.travelStyle && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.travelStyle}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <Label htmlFor="phoneNumber" className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">📱</span> Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChangeWrapper}
              className={`mt-1 bg-slate-800 border-slate-700 text-white ${validationErrors.phoneNumber ? "border-red-500" : ""}`}
              placeholder="0xx-xxx-xxxx"
              maxLength={12}
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">Format: 0xx-xxx-xxxx</p>
          </div>

          {/* Email Field - Read Only */}
          <div>
            <Label htmlFor="email" className="text-orange-500 text-sm flex items-center gap-2">
              <span className="text-orange-500">📧</span> Email
              <Lock className="w-3 h-3 text-gray-400" />
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={currentUser?.email || "Loading..."}
                readOnly
                className="mt-1 bg-slate-700 border-slate-600 text-gray-300"
                placeholder="Email from database"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
          </div>

          {/* Change Password Section */}
          <div>
            <Label className="text-white text-sm">Change password</Label>
            <Button
              onClick={handleResetPasswordWrapper}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg"
            >
              Reset Password
            </Button>
          </div>
            {/* Delete Profile Button */}
                            <Button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                            Delete Profile
                            </Button>
          {/* Confirm Changes Button */}
          <div className="pt-4">
            <Button
              onClick={handleSaveWrapper}
              disabled={loading || !isFormValid()}
              className={`w-full font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${loading || !isFormValid() ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-black"}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  Saving...
                </>
              ) : !isFormValid() ? (
                <>
                  <Lock className="w-4 h-4" />
                  Complete Required Fields
                </>
              ) : (
                "Confirm Changes"
              )}
            </Button>
            {!isFormValid() && (
              <p className="text-red-500 text-xs mt-2 text-center">
                Please fill all required fields correctly to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelectWrapper}
        currentImage={profileImage || undefined}
      />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onClose={() => setIsResetPasswordModalOpen(false)}
                onConfirm={handlePasswordReset}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={() => router.push("/")}
              title="Delete Profile"
              description="Are you sure you want to delete your profile? This action cannot be undone. Please enter your password to confirm."
              confirmText="Delete Profile"
              cancelText="Cancel"
              variant="danger"
              requirePassword={true}
            />
        </div>
    );
}
