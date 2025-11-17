// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { tree } from "next/dist/build/templates/app-page"
import { UserProfile, UpdateUserProfile } from "../../types/user"
import { tokenService } from "./tokenService"
import { apiClient } from "@/lib/api"
import { Group } from "next/dist/shared/lib/router/utils/route-regex"
class UserService {
    private baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL

    /*
    Get current authenticated user data
    This fetches the currently logged-in user's basic information for nav bar display
  */
    async getCurrentUser(): Promise<UserProfile> {
        try {
            // Get token from cookies or localStorage (fallback)
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }

            // Decode JWT token to get user data
            const userDataFromToken = await tokenService.decodeTokenData(token)

            if (userDataFromToken) {
                return userDataFromToken
            }

            throw new Error("Unable to retrieve user data")
        } catch (error) {
            throw new Error("Failed to fetch current user data")
        }
    }

    /*
    Transform backend user data to frontend UserProfile format
  */
    private transformUserData(backendData: any): UserProfile {
        // Return null for profileImage if user doesn't have one
        // This allows UI to display first character of user's name as fallback
        let profileImageUrl = null;
        if (backendData.profile_url) {
            // Remove leading slash from profile_url if it exists
            const cleanPath = backendData.profile_url.startsWith('/') 
                ? backendData.profile_url.substring(1) 
                : backendData.profile_url;
            
            // Use file server URL for profile images
            const fileServerUrl = process.env.NEXT_PUBLIC_FILE_API_URL || 'https://thamroidufs.duckdns.org';
            profileImageUrl = `${fileServerUrl}/${cleanPath}?t=${Date.now()}`;
        }

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
        }
    }

    /*
    Fetch user profile data from database
  */
    async getUserProfile(command: string): Promise<UserProfile> {
        console.log("getUserProfile called with command:", command)
        let user: UserProfile | null = null
        let userEmail: string = ""

        try {
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }

            user = await tokenService.decodeTokenData(token)

            if (command === "current-user" || command === "") {
                // Use current user's email for current user requests
                userEmail = user ? user.email : ""
            } else if (/^\d+$/.test(command)) {
                // If command is a user_id, fetch by user ID
                console.log("Fetching user by ID:", command)
                const response = await apiClient.get<UserProfile, UserProfile>(
                    `${this.baseUrl}/api/v1/user/id/${command}`
                )
                console.log("User profile response data:", response)
                return this.transformUserData(response)
            } else {
                // Otherwise treat it as email (for backwards compatibility)
                userEmail = command
            }

            console.log("Determined userEmail for profile fetch:", userEmail)

            if (!userEmail) {
                throw new Error("Unable to get user email")
            }

            const response = await apiClient.post<UserProfile, UserProfile>(
                `${this.baseUrl}/api/v1/user/`,
                { email: userEmail }
            )

            console.log("User profile response data:", response)
            const userData = response
            return this.transformUserData(userData)
        } catch (error) {
            console.error("Error fetching user profile:", error)
            throw new Error("Failed to fetch user profile")
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
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }

            const user = await tokenService.decodeTokenData(token)

            if (!user || !user.email) {
                throw new Error("Unable to get user email from token")
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
            }

            const profileImageFile = profileData.profileImage
            if (profileImageFile) {
                console.log("File object details:", {
                    name: profileImageFile.name,
                    size: profileImageFile.size,
                    type: profileImageFile.type,
                    lastModified: profileImageFile.lastModified,
                })

                // Create FormData object for multipart upload
                const formData = new FormData()
                formData.append("profile", profileImageFile)
                // formData.append("email", user.email);

                console.log("Uploading profile image with apiClient...")

                // Get token to verify it exists
                const token = await tokenService.getAuthToken()
                console.log("Token exists:", !!token, "Token preview:", token?.substring(0, 20) + "...")

                // Use apiClient - it will automatically add Authorization header
                // Don't set Content-Type - axios will set it with proper boundary for multipart/form-data
                const response_img = await apiClient.post(
                    `${this.baseUrl}/api/v1/user/profile_pic`,
                    formData,
                    {
                        headers: {
                            // Don't set Content-Type - let axios handle it for FormData
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                )

                console.log("Profile image upload response:", response_img)
            }
            const response = await apiClient.patch(
                `${this.baseUrl}/api/v1/user/`,
                payload
            )
            console.log("Update profile response data:", response)
            return this.transformUserData(response)
        } catch (error) {
            console.error("Error updating user profile:", error)
            throw new Error("Failed to update user profile")
        }
    }

    async getTravelHistory() : Promise<Group[]> {
         try {
            const response = await apiClient.get(
                `${this.baseUrl}/api/v2/travel/me`
            )
            return response['data']
        } catch (error) {
            console.error("Error fetching travel history:", error)
            throw new Error("Failed to fetch travel history")
        }
    }
}

export const userService = new UserService()
