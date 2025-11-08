// User-related type definitions
export interface UserProfile {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber: string;
    interests: string[];
    travelStyle?: string[];
    profileImage?: string;
    social_credit?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserProfile {
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    interests: string[];
    travelStyle?: string[];
    profileImage?: File;
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

export interface UserData {
    user_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    birth_date: string;
    sex: "male" | "female" | string;
    phone: string;
    profile_url: string | null;
    social_credit: number;
    interests: string[];
    travel_styles: string[];
    email: string;
    role: string;
    iat: number; // issued-at timestamp
    exp: number; // expiry timestamp
}

export interface Rating {
    trust_score : number;
    engagement_score : number;
    experience_score : number;
}
