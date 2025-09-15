// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { UserProfile, UpdateUserProfile } from "../../types/user";
import { tokenService } from "./tokenService";
import { apiClient } from "@/lib/api";
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
        // Construct full profile image URL if profile_url exists
        const profileImageUrl = backendData.profile_url
            ? `http://localhost:6969/${backendData.profile_url}`
            : undefined;

        return {
            firstName: backendData.first_name || "",
            lastName: backendData.last_name || "",
            middleName: backendData.middle_name || "",
            email: backendData.email || "",
            phoneNumber: backendData.phone || "",
            interests:
                backendData.userInterests?.map(
                    (userInterest: any) => userInterest.interest.key
                ) || [],
            travelStyle:
                backendData.userTravelStyles?.map(
                    (userTravelStyle: any) => userTravelStyle.travel_style.key
                ) || [],
            profileImage: profileImageUrl,
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

            const response = await apiClient.post<UserProfile, UserProfile>(
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

            console.log("User profile response data:", response);
            const userData = response;
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

            const user = await tokenService.decodeTokenData(token);

            if (!user || !user.email) {
                throw new Error("Unable to get user email from token");
            }

            const payload = {
                email: user.email,
                data: {
                    first_name: profileData.firstName,
                    last_name: profileData.lastName,
                    middle_name: profileData.middleName,
                    phone: profileData.phoneNumber.replace(/[-\s]/g, ""),
                    interests: profileData.interests,
                    travel_styles: profileData.travelStyle,
                },
            };

            const response = await apiClient.patch(
                `${this.baseUrl}user/`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log("Update profile response data:", response);
            return this.transformUserData(response);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new Error("Failed to update user profile");
        }
    }
    
}

export const userService = new UserService();
