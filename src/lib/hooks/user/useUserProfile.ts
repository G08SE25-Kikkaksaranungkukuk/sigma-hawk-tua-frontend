import { useState, useEffect } from 'react';
import { userService } from '../../services/user';
import { UserProfile, UpdateUserProfile } from '../../types/user';

export interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  userEmail: string;
  loading: boolean;
  error: string | null;
  updateProfile: (profileData: UpdateUserProfile) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

/**
 * Custom hook for managing user profile data
 * Handles fetching, updating, and state management for user profiles
 */
export function useUserProfile(userId?: string): UseUserProfileReturn {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await userService.getUserProfile(userId);
      setUserProfile(profile);
      setUserEmail(profile.email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user profile';
      setError(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile (excluding email)
  const updateProfile = async (profileData: UpdateUserProfile): Promise<boolean> => {
    try {
      if (!userId) {
        setError('No user ID available for update');
        return false;
      }
      
      setError(null);
      const updatedProfile = await userService.updateUserProfile(userId, profileData);
      setUserProfile(updatedProfile);
      
      // Refresh authentication tokens to update cookies with new user data
      try {
        await userService.refreshAuthToken();
        console.log('Auth tokens refreshed successfully after profile update');
      } catch (refreshError) {
        console.warn('Failed to refresh auth tokens after profile update:', refreshError);
        // Don't fail the whole operation if token refresh fails
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
      return false;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  // Fetch profile on component mount or userId change
  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  return {
    userProfile,
    userEmail,
    loading,
    error,
    updateProfile,
    refreshProfile
  };
}
