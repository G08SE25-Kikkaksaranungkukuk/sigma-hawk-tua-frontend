// User-related type definitions
export interface UserProfile {
    first_name: string;
    last_name: string;
    middle_name?: string;
    email: string;
    phone: string;
    interests: string[];
    travel_styles?: string[];
    profile_url?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserProfile {
    email: string;
    data: {
        first_name: string;
        last_name: string;
        middle_name?: string;
        phone: string;
        interests: string[];
        travel_style?: string[];
        profile_url?: string;
    };
}

export interface UserEmailInfo {
    email: string;
    isVerified: boolean;
    lastUpdated?: string;
}

export interface PasswordResetRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Interest option for the UI
export interface InterestOption {
    id: string;
    label: string;
    color: string;
}
