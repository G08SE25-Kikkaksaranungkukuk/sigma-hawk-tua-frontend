// User-related type definitions
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  interests: string[];
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfile {
  name: string;
  phoneNumber: string;
  interests: string[];
  profileImage?: string;
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
