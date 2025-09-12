// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { email } from "zod";
import { UserProfile, UpdateUserProfile } from "../../types/user";
import { tokenService } from "./tokenService";
import axios from "axios";
class UserService {
    private baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    /*
    Get current authenticated user data
    This fetches the currently logged-in user's basic information for nav bar display
  */
    async getCurrentUser(): Promise<UserProfile> {
        try {
            // Get token from cookies or localStorage (fallback)
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            // Decode JWT token to get user data
            const userDataFromToken = await tokenService.decodeTokenData(token);

            if (userDataFromToken) {
                return userDataFromToken;
            }

            throw new Error("Unable to retrieve user data");
        } catch (error) {
            throw new Error("Failed to fetch current user data");
        }
    }

    /*
    Transform backend user data to frontend UserProfile format
  */
    private transformUserData(backendData: any): UserProfile {
        return {
            id: backendData.user_id?.toString() || backendData.id?.toString(),
            firstName: backendData.first_name || "",
            lastName: backendData.last_name || "",
            middleName: backendData.middle_name || "",
            email: backendData.email || "",
            phoneNumber: backendData.phone || "",
            interests:
                backendData.interests?.map(
                    (interest: any) =>
                        interest.name || interest.interest_name || interest
                ) || [],
            travelStyle:
                backendData.travel_styles?.map(
                    (style: any) => style.name || style.style_name || style
                ) || [],
            profileImage: backendData.profile_url || undefined,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at,
        };
    }

    /*
    Fetch user profile data from database
  */
    async getUserProfile(userId: string): Promise<UserProfile> {
        try {
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const user = await tokenService.decodeTokenData(token);

            if (!user || !user.email) {
                throw new Error("Unable to get user email from token");
            }

            const response = await axios.post(
                `${this.baseUrl}user/`,
                { email: user.email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status !== 200) {
                throw new Error(
                    `Failed to fetch user profile: ${response.statusText}`
                );
            }

            const userData = response.data.user;
            return this.transformUserData(userData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }

    /*
    Update user profile (excluding email)
    Email updates should be handled through a separate secure process
  */
    async updateUserProfile(
        userId: string,
        profileData: UpdateUserProfile
    ): Promise<UserProfile> {
        try {
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${this.baseUrl}/users/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to update user profile: ${response.statusText}`
                );
            }

            const updatedUser = await response.json();
            return this.transformUserData(updatedUser);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new Error("Failed to update user profile");
        }
    }

    /*
    Get user email (read-only)
    Email is fetched separately as it's read-only in the edit profile context
  */
    async getUserEmail(userId: string): Promise<string> {
        try {
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(
                `${this.baseUrl}/users/${userId}/email`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch user email: ${response.statusText}`
                );
            }

            const { email } = await response.json();
            return email;
        } catch (error) {
            console.error("Error fetching user email:", error);
            throw new Error("Failed to fetch user email");
        }
    }
}

export const userService = new UserService();
