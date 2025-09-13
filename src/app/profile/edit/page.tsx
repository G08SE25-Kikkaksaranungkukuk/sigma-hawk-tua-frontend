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
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import ProfilePictureModal from "../../../components/editprofile/ProfilePictureModal";
import ResetPasswordModal from "../../../components/editprofile/ResetPasswordModal";
import ConfirmationDialog from "../../../components/editprofile/ConfirmationDialog";
import { useUserProfile } from "../../../lib/hooks";
import { interestOptions } from "@/components/editprofile/constants";
import {
    getColorClasses,
    formatPhoneNumber,
} from "@/components/editprofile/helpers";
import { validateForm, isFormValid } from "@/components/editprofile/validation";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                profileImage: profileImage || undefined,
            });

            if (success) {
                try {
                    console.log("Payload for backend:", formData);
                    await updateProfile(formData);
                    console.log("Profile updated successfully");

                    // Refresh current user data for home page
                    await refreshProfile();
                    console.log("Home page user data refreshed");
                } catch (error) {
                    console.error("Error updating profile:", error);
                }
                // Navigate to home page after successful update
                router.push("/home");
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
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setProfileImage(null);
        }
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
                                    interest.id
                                );
                                const colorClasses = getColorClasses(
                                    interest.color,
                                    isSelected
                                );
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() =>
                                            handleInterestToggle(interest.id)
                                        }
                                        className={`px-4 py-3 mx-1 my-1 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 w-fit shadow-md backdrop-blur-sm ${colorClasses}`}
                                    >
                                        {interest.label}
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
                            {[
                                {
                                    id: "BUDGET",
                                    label: "💰 Budget",
                                    color: "orange",
                                },
                                {
                                    id: "COMFORT",
                                    label: "🛏️ Comfort",
                                    color: "blue",
                                },
                                {
                                    id: "LUXURY",
                                    label: "💎 Luxury",
                                    color: "purple",
                                },
                                {
                                    id: "BACKPACK",
                                    label: "🎒 Backpack",
                                    color: "green",
                                },
                            ].map((style) => {
                                const isChecked = formData.travelStyle.includes(
                                    style.id
                                );
                                return (
                                    <div
                                        key={style.id}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`travel-${style.id}`}
                                                checked={isChecked}
                                                onChange={() =>
                                                    handleTravelStyleToggle(
                                                        style.id
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div
                                                onClick={() =>
                                                    handleTravelStyleToggle(
                                                        style.id
                                                    )
                                                }
                                                className={`w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                                    isChecked
                                                        ? "bg-orange-500 border-orange-500"
                                                        : "bg-transparent border-orange-400/60 hover:border-orange-300"
                                                }`}
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
                                            htmlFor={`travel-${style.id}`}
                                            className="text-orange-300 text-sm cursor-pointer select-none hover:text-orange-200 transition-colors"
                                        >
                                            {style.label}
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
        </div>
    );
}
