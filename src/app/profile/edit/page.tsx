"use client";

// Group imports logically: external libraries, hooks, components, and utilities
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Camera,
    Save,
    Heart,
    Star,
    Sparkles,
    ArrowLeft,
    Lock,
    CheckCircle2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ImageCropModal } from "../../../components/ImageCropModal";
import ResetPasswordModal from "../../../components/editprofile/ResetPasswordModal";
import ConfirmationDialog from "../../../components/editprofile/ConfirmationDialog";
import { PopupCard } from "../../../components/ui/popup-card";
import { useUserProfile } from "../../../lib/hooks";
import { AnimatePresence, motion } from 'framer-motion';
import {
    interestOptions,
    travel_style_options,
} from "@/components/editprofile/constants";
import {
    getColorClasses,
    formatPhoneNumber,
} from "@/components/editprofile/helpers";
import { validateForm, isFormValid } from "@/components/editprofile/validation";

// Success Modal Component
interface UpdateProfileSuccessProps {
  isOpen: boolean;
}

function UpdateProfileSuccess({ isOpen }: UpdateProfileSuccessProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            className="flex items-center justify-center p-6 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 30, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30, 
                mass: 0.8,
                duration: 0.5
              }}
              className="w-full max-w-xl mx-4"
            >
              <PopupCard className="w-full bg-slate-900/98 border-2 border-orange-500/50 shadow-2xl backdrop-blur-md ring-1 ring-orange-500/20">
                <div className="p-10 flex flex-col items-center gap-8 text-center">
                  {/* Success Icon with animation */}
                  <motion.div 
                    className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="space-y-4 max-w-md">
                    <motion.h2 
                      className="text-3xl font-bold text-orange-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Profile Updated Successfully! 🎉
                    </motion.h2>
                    <motion.p 
                      className="text-gray-300 text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your profile has been updated! Redirecting you back to the home page...
                    </motion.p>
                  </div>

                  {/* Progress indicator */}
                  <motion.div 
                    className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Component definition
export default function EditProfilePage() {
    const router = useRouter();

    // State declarations
    const {
        userProfile,
        userEmail,
        loading,
        error,
        updateProfile,
        refreshProfile,
    } = useUserProfile();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        phoneNumber: "",
        interests: [] as string[],
        travelStyle: [] as string[],
    });

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageForCrop, setSelectedImageForCrop] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
        useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [validationErrors, setValidationErrors] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        interests: "",
        travelStyle: "",
    });

    // Update form data when user profile is loaded
    useEffect(() => {
        if (userProfile) {
            setFormData({
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                middleName: userProfile.middleName || "",
                phoneNumber: formatPhoneNumber(userProfile.phoneNumber), // Format phone number from backend
                interests: userProfile.interests,
                travelStyle: userProfile.travelStyle || [],
            });
            setProfileImage(userProfile.profileImage || null);
        }
    }, [userProfile]);

    // Check if form is valid
    const isFormValidLocal = () => {
        return (
            formData.firstName.trim() !== "" &&
            formData.lastName.trim() !== "" &&
            formData.phoneNumber.trim() !== "" &&
            /^0\d{2}-\d{3}-\d{4}$/.test(formData.phoneNumber) &&
            formData.interests.length > 0 &&
            formData.travelStyle.length > 0
        );
    };

    // Utility functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special handling for phone number formatting
        if (name === "phoneNumber") {
            const formattedValue = formatPhoneNumber(value);

            setFormData((prev) => ({
                ...prev,
                [name]: formattedValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear validation error for this field
        setValidationErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleInterestToggle = (interestId: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter((i) => i !== interestId)
                : [...prev.interests, interestId],
        }));

        // Clear validation error for interests
        setValidationErrors((prev) => ({
            ...prev,
            interests: "",
        }));
    };

    const handleTravelStyleToggle = (styleId: string) => {
        setFormData((prev) => ({
            ...prev,
            travelStyle: prev.travelStyle.includes(styleId)
                ? prev.travelStyle.filter((s) => s !== styleId)
                : [...prev.travelStyle, styleId],
        }));

        // Clear validation error for travel style
        setValidationErrors((prev) => ({
            ...prev,
            travelStyle: "",
        }));
    };

    const handleSave = async () => {
        if (loading) return;

        // Validate form before saving
        if (!validateForm(formData, setValidationErrors)) {
            return;
        }

        try {
            const success = await updateProfile({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                middleName: formData.middleName.trim() || undefined,
                phoneNumber: formData.phoneNumber,
                interests: formData.interests,
                travelStyle: formData.travelStyle,
                profileImage: profileImageFile || undefined,
            });

            if (success) {
                try {
                    console.log("Payload for backend:", formData);
                    await updateProfile(formData);
                    console.log("Profile updated successfully");

                    // Refresh current user data for home page
                    await refreshProfile();
                    console.log("Home page user data refreshed");
                    
                    // Set a flag to trigger header refresh
                    localStorage.setItem('profileUpdated', 'true');
                } catch (error) {
                    console.error("Error updating profile:", error);
                }
                
                // Show success modal
                setShowSuccessModal(true);

                // Redirect after a short delay
                setTimeout(() => {
                    router.push("/home?profileUpdated=true");
                }, 2000);
            } else {
                console.log("Failed to update profile");
                // You can add error handling here
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleResetPassword = () => {
        setIsResetPasswordModalOpen(true);
    };

    const handlePasswordReset = (passwordData: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        console.log("Password reset data:", passwordData);
        // Here you would typically call an API to reset the password
        // For now, we'll just log the data
    };

    const handleImageSelect = (imageFile: File | null) => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setSelectedImageForCrop(imageUrl);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setProfileImageFile(null);
            setProfileImage(null);
        }
    };

    const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
        setProfileImage(croppedImageUrl);
        setProfileImageFile(croppedFile);
        setIsModalOpen(false);
    };

    const handleImageButtonClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            handleImageSelect(file || null);
        };
        input.click();
    };

    // JSX structure
    return (
        <div
            className="min-h-screen bg-black relative overflow-hidden"
            suppressHydrationWarning={true}
        >
            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="text-white mt-2">Loading profile...</p>
                    </div>
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg z-40">
                    {error}
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
                            onClick={() => router.push("/home")}
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

            {/* Main content */}
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
                            onClick={handleImageButtonClick}
                            className="absolute bottom-4 right-4 bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
                            title="Change profile picture"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="px-6 py-6 space-y-6">
                    {/* Name Fields */}
                    <div className="space-y-4">
                        {/* First Name Field */}
                        <div>
                            <Label
                                htmlFor="firstName"
                                className="text-orange-500 text-sm flex items-center gap-2"
                            >
                                <span className="text-orange-500">👤</span>{" "}
                                First Name{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`mt-1 bg-slate-800 border-slate-700 text-white ${
                                    validationErrors.firstName
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter your first name"
                            />
                            {validationErrors.firstName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {validationErrors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <Label
                                htmlFor="lastName"
                                className="text-orange-500 text-sm flex items-center gap-2"
                            >
                                <span className="text-orange-500">👤</span> Last
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`mt-1 bg-slate-800 border-slate-700 text-white ${
                                    validationErrors.lastName
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter your last name"
                            />
                            {validationErrors.lastName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {validationErrors.lastName}
                                </p>
                            )}
                        </div>

                        {/* Middle Name Field (Optional) */}
                        <div>
                            <Label
                                htmlFor="middleName"
                                className="text-orange-500 text-sm flex items-center gap-2"
                            >
                                <span className="text-orange-500">👤</span>{" "}
                                Middle Name{" "}
                                <span className="text-gray-400 text-xs">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                id="middleName"
                                name="middleName"
                                type="text"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                className="mt-1 bg-slate-800 border-slate-700 text-white"
                                placeholder="Enter your middle name (optional)"
                            />
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div>
                        <Label className="text-orange-500 text-sm flex items-center gap-2">
                            <span className="text-orange-500">❤️</span>{" "}
                            Interests <span className="text-red-500">*</span>
                        </Label>
                        <div className="my-3">
                            {interestOptions.map((interest) => {
                                const isSelected = formData.interests.includes(
                                    interest.key
                                );
                                const colorClasses = getColorClasses(
                                    interest.color,
                                    isSelected
                                );

                                // Create inline styles for selected state using hex color
                                const selectedStyle = isSelected
                                    ? {
                                          backgroundColor: `${interest.color}20`, // 20 for 12.5% opacity
                                          borderColor: interest.color,
                                          color: interest.color,
                                      }
                                    : {};

                                return (
                                    <button
                                        key={interest.key}
                                        onClick={() =>
                                            handleInterestToggle(interest.key)
                                        }
                                        className={`px-4 py-3 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 w-fit shadow-md backdrop-blur-sm ${colorClasses}`}
                                        style={selectedStyle}
                                    >
                                        {interest.emoji} {interest.label}
                                    </button>
                                );
                            })}
                        </div>
                        {validationErrors.interests && (
                            <p className="text-red-500 text-xs mt-1">
                                {validationErrors.interests}
                            </p>
                        )}
                    </div>

                    {/* Travel Style Section */}
                    <div>
                        <Label className="text-orange-500 text-sm flex items-center gap-2">
                            <span className="text-orange-500">🧳</span> Travel
                            Style <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-3 space-y-3">
                            {travel_style_options.map((style) => {
                                const isChecked = formData.travelStyle.includes(
                                    style.key
                                );

                                // Create inline styles for selected state using hex color
                                const checkboxStyle = isChecked
                                    ? {
                                          backgroundColor: style.color,
                                          borderColor: style.color,
                                      }
                                    : {
                                          backgroundColor: "transparent",
                                          borderColor: "#fb923c60",
                                      };

                                const labelStyle = isChecked
                                    ? {
                                          color: style.color,
                                      }
                                    : {};

                                return (
                                    <div
                                        key={style.key}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`travel-${style.key}`}
                                                checked={isChecked}
                                                onChange={() =>
                                                    handleTravelStyleToggle(
                                                        style.key
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div
                                                onClick={() =>
                                                    handleTravelStyleToggle(
                                                        style.key
                                                    )
                                                }
                                                className="w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center hover:border-orange-300"
                                                style={checkboxStyle}
                                            >
                                                {isChecked && (
                                                    <svg
                                                        className="w-3 h-3 text-black"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <label
                                            htmlFor={`travel-${style.key}`}
                                            className="text-orange-300 text-sm cursor-pointer select-none hover:text-orange-200 transition-colors"
                                            style={labelStyle}
                                        >
                                            {style.emoji} {style.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        {validationErrors.travelStyle && (
                            <p className="text-red-500 text-xs mt-1">
                                {validationErrors.travelStyle}
                            </p>
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div>
                        <Label
                            htmlFor="phoneNumber"
                            className="text-orange-500 text-sm flex items-center gap-2"
                        >
                            <span className="text-orange-500">📱</span> Phone
                            Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`mt-1 bg-slate-800 border-slate-700 text-white ${
                                validationErrors.phoneNumber
                                    ? "border-red-500"
                                    : ""
                            }`}
                            placeholder="0xx-xxx-xxxx"
                            maxLength={12}
                        />
                        {validationErrors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">
                                {validationErrors.phoneNumber}
                            </p>
                        )}
                        <p className="text-gray-400 text-xs mt-1">
                            Format: 0xx-xxx-xxxx
                        </p>
                    </div>

                    {/* Email Field - Read Only */}
                    <div>
                        <Label
                            htmlFor="email"
                            className="text-orange-500 text-sm flex items-center gap-2"
                        >
                            <span className="text-orange-500">📧</span> Email
                            <Lock className="w-3 h-3 text-gray-400" />
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={userEmail || "example@hotmail.com"}
                                readOnly
                                className="mt-1 bg-slate-700 border-slate-600 text-gray-300"
                                placeholder="Email from database"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Email cannot be changed here
                        </p>
                    </div>

                    {/* Change Password Section */}
                    <div>
                        <Label className="text-white text-sm">
                            Change password
                        </Label>
                        <Button
                            onClick={handleResetPassword}
                            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg"
                        >
                            Reset Password
                        </Button>
                    </div>
                    {/* Delete Profile Button */}
                    <Button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                        Delete Account
                    </Button>
                    {/* Confirm Changes Button */}
                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading || !isFormValidLocal()}
                            className={`w-full font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                                loading || !isFormValidLocal()
                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600 text-black"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                    Saving...
                                </>
                            ) : !isFormValidLocal() ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Complete Required Fields
                                </>
                            ) : (
                                "Confirm Changes"
                            )}
                        </Button>
                        {!isFormValidLocal() && (
                            <p className="text-red-500 text-xs mt-2 text-center">
                                Please fill all required fields correctly to
                                continue
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Crop Modal */}
            <ImageCropModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={selectedImageForCrop}
                onCropComplete={handleCropComplete}
                fileName="profile-image.jpg"
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
                title="Delete Account"
                description="Are you sure you want to delete your Account? This action cannot be undone. All of your data will be permanently removed. Please enter your password to confirm."
                confirmText="Delete Account"
                cancelText="Cancel"
                variant="danger"
                requirePassword={true}
            />

            {/* Success Modal */}
            <UpdateProfileSuccess isOpen={showSuccessModal} />
        </div>
    );
}
