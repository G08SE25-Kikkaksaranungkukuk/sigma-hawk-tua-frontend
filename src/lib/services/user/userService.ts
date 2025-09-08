"use client";

// User service for handling user-related API calls
import { UserProfile, UpdateUserProfile } from '../../types/user';
import { baseAPIUrl } from '../../config';

class UserService {
  private baseUrl = baseAPIUrl;

  // Get current authenticated user data
  async getCurrentUser(): Promise<UserProfile> {
    try {
      await this.refreshToken();
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const userDataFromToken = this.decodeTokenData(token);
      if (userDataFromToken) return userDataFromToken;
      throw new Error('Unable to retrieve user data');
    } catch {
      throw new Error('Failed to fetch current user data');
    }
  }

  // Decode JWT token to extract user data
  private decodeTokenData(token: string): UserProfile | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return {
        id: payload.userId?.toString() || payload.id?.toString() || payload.sub || 'current-user',
        firstName: payload.firstName || payload.first_name || 'User',
        lastName: payload.lastName || payload.last_name || 'Logged In',
        middleName: payload.middleName || payload.middle_name || '',
        email: payload.email || 'user@example.com',
        phoneNumber: payload.phone || payload.phoneNumber || '',
        interests: payload.interests || [],
        travelStyle: payload.travel_styles?.map((style: any) => style.name || style.style_name || style) || payload.travelStyle || [],
        profileImage: payload.profileImage || payload.profile_url || undefined
      };
    } catch {
      return null;
    }
  }

  // Get authentication token from cookies or localStorage
  private getAuthToken(): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      if (tokenCookie) return tokenCookie.split('=')[1];
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
      return token || null;
    }
    return null;
  }

  // Refresh authentication token
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Public method to refresh authentication token
  async refreshAuthToken(): Promise<boolean> {
    return this.refreshToken();
  }

  // Transform backend user data to frontend UserProfile format
  private transformUserData(backendData: any): UserProfile {
    return {
      id: backendData.user_id?.toString() || backendData.id?.toString(),
      firstName: backendData.first_name || '',
      lastName: backendData.last_name || '',
      middleName: backendData.middle_name || '',
      email: backendData.email || '',
      phoneNumber: backendData.phone || '',
      interests: backendData.interests?.map((interest: any) => interest.name || interest.interest_name || interest) || [],
      travelStyle: backendData.travel_styles?.map((style: any) => style.name || style.style_name || style) || [],
      profileImage: backendData.profile_url || undefined,
      createdAt: backendData.created_at,
      updatedAt: backendData.updated_at,
    };
  }

  // Fetch user profile data from database
  async getUserProfile(userId?: string): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      if (!userId) {
        const userDataFromToken = this.decodeTokenData(token);
        if (userDataFromToken) return userDataFromToken;
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
        if (response.status === 404) {
          const userDataFromToken = this.decodeTokenData(token);
          if (userDataFromToken) return userDataFromToken;
        }
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }
      const userData = await response.json();
      return this.transformUserData(userData);
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  // Update user profile (excluding email)
  async updateUserProfile(userId: string, profileData: UpdateUserProfile): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${this.baseUrl}/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      if (!response.ok) throw new Error(`Failed to update user profile: ${response.statusText}`);
      const updatedUser = await response.json();
      return this.transformUserData(updatedUser);
    } catch {
      throw new Error('Failed to update user profile');
    }
  }

  // Get user email (read-only)
  async getUserEmail(userId: string): Promise<string> {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${this.baseUrl}/api/user/${userId}/email`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Failed to fetch user email: ${response.statusText}`);
      const { email } = await response.json();
      return email;
    } catch {
      throw new Error('Failed to fetch user email');
    }
  }
}

export const userService = new UserService();
