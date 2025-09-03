// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { UserProfile, UpdateUserProfile } from '../../types/user';

class UserService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  /**
   * Fetch user profile data from database
   * This will replace the hardcoded email with actual database data
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      // TODO: Replace with actual API call to backend
      // const response = await fetch(`${this.baseUrl}/users/${userId}`);
      // const userData = await response.json();
      // return userData;

      // For now, return mock data with the example email
      return {
        id: userId,
        name: "",
        email: "example@hotmail.com", // This will come from database
        phoneNumber: "",
        interests: [],
        profileImage: undefined
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Update user profile (excluding email)
   * Email updates should be handled through a separate secure process
   */
  async updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      // TODO: Replace with actual API call to backend
      // const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileData),
      // });
      // const updatedUser = await response.json();
      // return updatedUser;

      // For now, return mock updated data
      console.log('Updating user profile:', profileData);
      return {
        id: userId,
        email: "example@hotmail.com", // Email remains unchanged
        ...profileData
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Get user email (read-only)
   * Email is fetched separately as it's read-only in the edit profile context
   */
  async getUserEmail(userId: string): Promise<string> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${this.baseUrl}/users/${userId}/email`);
      // const { email } = await response.json();
      // return email;

      // For now, return the example email
      return "example@hotmail.com";
    } catch (error) {
      console.error('Error fetching user email:', error);
      throw new Error('Failed to fetch user email');
    }
  }
}

export const userService = new UserService();
