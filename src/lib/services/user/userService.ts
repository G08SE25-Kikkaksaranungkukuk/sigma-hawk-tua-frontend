"use client";

// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { UserProfile, UpdateUserProfile } from '../../types/user';
import { baseAPIUrl } from '../../config';

class UserService {
  private baseUrl = baseAPIUrl;

  /*
    Get current authenticated user data
    This fetches the currently logged-in user's basic information for nav bar display
  */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      // Get token from cookies or localStorage (fallback)
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Decode JWT token to get user data
      const userDataFromToken = this.decodeTokenData(token);

      if (userDataFromToken) {
        return userDataFromToken;
      }
      
      throw new Error('Unable to retrieve user data');
      
    } catch (error) {
      throw new Error('Failed to fetch current user data');
    }
  }

  /*
    Decode JWT token to extract user data (temporary solution)
  */
  private decodeTokenData(token: string): UserProfile | null {
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Extract user data from token payload
      return {
        id: payload.userId?.toString() || payload.id?.toString() || payload.sub || 'current-user',
        firstName: payload.firstName || payload.first_name || 'User',
        lastName: payload.lastName || payload.last_name || 'Logged In',
        middleName: payload.middleName || payload.middle_name || '',
        email: payload.email || 'user@example.com',
        phoneNumber: payload.phone || payload.phoneNumber || '',
        interests: payload.interests || [],
        travelStyle: payload.travel_styles?.map((style: any) => 
          style.name || style.style_name || style
        ) || payload.travelStyle || [],
        profileImage: payload.profileImage || payload.profile_url || undefined
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /*
    Get authentication token from cookies or localStorage
  */
  private getAuthToken(): string | null {
    // Try to get from cookies first (primary method)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('accessToken=')
      );
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        console.log('Found token in cookies:', token ? 'Token exists' : 'No token');
        return token;
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || 
                   localStorage.getItem('token') ||
                   localStorage.getItem('authToken');
      console.log('Found token in localStorage:', token ? 'Token exists' : 'No token');
      if (token) {
        // Debug: log token payload
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Token payload:', payload);
        } catch (e) {
          console.log('Token is not a valid JWT');
        }
      }
      return token;
    }

    return null;
  }

  /*
    Refresh authentication token
  */
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  /*
    Public method to refresh authentication token
  */
  async refreshAuthToken(): Promise<boolean> {
    return this.refreshToken();
  }

  /*
    Transform backend user data to frontend UserProfile format
  */
  private transformUserData(backendData: any): UserProfile {
    return {
      id: backendData.user_id?.toString() || backendData.id?.toString(),
      firstName: backendData.first_name || '',
      lastName: backendData.last_name || '',
      middleName: backendData.middle_name || '',
      email: backendData.email || '',
      phoneNumber: backendData.phone || '',
      interests: backendData.interests?.map((interest: any) => 
        interest.name || interest.interest_name || interest
      ) || [],
      travelStyle: backendData.travel_styles?.map((style: any) => 
        style.name || style.style_name || style
      ) || [],
      profileImage: backendData.profile_url || undefined,
      createdAt: backendData.created_at,
      updatedAt: backendData.updated_at,
    };
  }

  /*
    Fetch user profile data from database
  */
  async getUserProfile(userId?: string): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // If no userId provided, try to get current user data from token first
      if (!userId) {
        const userDataFromToken = this.decodeTokenData(token);
        if (userDataFromToken) {
          return userDataFromToken;
        }
        throw new Error('No user ID provided and unable to get from token');
      }

      const response = await fetch(`${this.baseUrl}/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        // If API call fails, try to get data from token as fallback
        if (response.status === 404) {
          const userDataFromToken = this.decodeTokenData(token);
          if (userDataFromToken) {
            return userDataFromToken;
          }
        }
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const userData = await response.json();
      return this.transformUserData(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /*
    Update user profile (excluding email)
    Email updates should be handled through a separate secure process
  */
  async updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      return this.transformUserData(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /*
    Get user email (read-only)
    Email is fetched separately as it's read-only in the edit profile context
  */
  async getUserEmail(userId: string): Promise<string> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/api/user/${userId}/email`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user email: ${response.statusText}`);
      }

      const { email } = await response.json();
      return email;
    } catch (error) {
      console.error('Error fetching user email:', error);
      throw new Error('Failed to fetch user email');
    }
  }
}

export const userService = new UserService();
