import { ChangeEvent, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { userService } from "../../lib/services/user";

// Types for handler props
export interface EditProfileHandlersProps {
    formData: any;
    setFormData: Dispatch<SetStateAction<any>>;
    setValidationErrors: Dispatch<SetStateAction<any>>;
    setProfileImage: Dispatch<SetStateAction<string | null>>;
    loading: boolean;
    currentUserLoading: boolean;
    validateForm: () => boolean;
    currentUser: any;
    profileImage: string | null;
    refreshCurrentUser: () => Promise<void>;
    router: any;
}

export const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFormData: Dispatch<SetStateAction<any>>,
    setValidationErrors: Dispatch<SetStateAction<any>>
) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
        const digits = value.replace(/\D/g, "");
        let formattedValue = "";
        if (digits.length > 0) {
            if (digits.length <= 3) {
                formattedValue = digits;
            } else if (digits.length <= 6) {
                formattedValue = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
                formattedValue = `${digits.slice(0, 3)}-${digits.slice(
                    3,
                    6
                )}-${digits.slice(6, 10)}`;
            }
        }
        setFormData((prev: any) => ({ ...prev, [name]: formattedValue }));
    } else {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
    setValidationErrors((prev: any) => ({ ...prev, [name]: "" }));
};

export const handleInterestToggle = (
    interestId: string,
    setFormData: Dispatch<SetStateAction<any>>,
    setValidationErrors: Dispatch<SetStateAction<any>>
) => {
    setFormData((prev: any) => ({
        ...prev,
        interests: prev.interests.includes(interestId)
            ? prev.interests.filter((i: string) => i !== interestId)
            : [...prev.interests, interestId],
    }));
    setValidationErrors((prev: any) => ({ ...prev, interests: "" }));
};

export const handleTravelStyleToggle = (
    styleId: string,
    setFormData: Dispatch<SetStateAction<any>>,
    setValidationErrors: Dispatch<SetStateAction<any>>
) => {
    setFormData((prev: any) => ({
        ...prev,
        travelStyle: prev.travelStyle.includes(styleId)
            ? prev.travelStyle.filter((s: string) => s !== styleId)
            : [...prev.travelStyle, styleId],
    }));
    setValidationErrors((prev: any) => ({ ...prev, travelStyle: "" }));
};

export const handleSave = async (props: EditProfileHandlersProps) => {
    const {
        loading,
        currentUserLoading,
        validateForm,
        currentUser,
        formData,
        profileImage,
        setValidationErrors,
        refreshCurrentUser,
        router,
    } = props;
    if (loading || currentUserLoading) return;
    if (!validateForm()) return;
    try {
        const payload = {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            middle_name: formData.middleName.trim() || null,
            phone: formData.phoneNumber.replace(/[-\s]/g, ""),
            interests: formData.interests,
            travel_styles: formData.travelStyle,
            profile_url: profileImage || null,
        };

        // Use userService.updateProfile instead of direct axios call
        await userService.updateUserProfile(
            currentUser?.email || "current",
            payload
        );

        try {
            await userService.refreshAuthToken();
        } catch {}

        await refreshCurrentUser();
        router.push("/home");
    } catch (error) {
        setValidationErrors((prev: any) => ({
            ...prev,
            firstName: "Failed to update profile. Please try again.",
        }));
    }
};

export const handleResetPassword = (
    setIsResetPasswordModalOpen: Dispatch<SetStateAction<boolean>>
) => {
    setIsResetPasswordModalOpen(true);
};

export const handlePasswordReset = (passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    console.log("Password reset data:", passwordData);
};

export const handleBackClick = (router: any) => {
    router.push("/home");
};

export const handleImageSelect = (
    imageFile: File | null,
    setProfileImage: Dispatch<SetStateAction<string | null>>
) => {
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
