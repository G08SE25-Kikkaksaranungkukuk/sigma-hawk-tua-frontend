// User service for handling user-related API calls
// This service will be used to fetch user data from the database
import { UserProfile, UpdateUserProfile } from "../../types/user"
import { tokenService } from "./tokenService"
import { apiClient } from "@/lib/api"
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
        const profileImageUrl = backendData.profile_url
            ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${backendData.profile_url}?t=${Date.now()}`
            : null

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
                // If command is a user_id, we need to get the email from session storage
                // This is stored when we navigate from components that have both user_id and email
                const userIdToEmailMap =
                    sessionStorage.getItem("userIdToEmailMap")
                const emailMap = userIdToEmailMap
                    ? JSON.parse(userIdToEmailMap)
                    : {}
                userEmail = emailMap[command] || ""

                if (!userEmail) {
                    throw new Error(
                        `Unable to find email for user ID: ${command}. Please navigate from a page with user information.`
                    )
                }
            } else {
                // Otherwise treat it as email (for backwards compatibility)
                userEmail = command
            }

            console.log("Determined userEmail for profile fetch:", userEmail)

            if (!userEmail) {
                throw new Error("Unable to get user email")
            }

            const response = await apiClient.post<UserProfile, UserProfile>(
                `${this.baseUrl}api/v1/user/`,
                { email: userEmail },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
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

                console.log("Uploading profile image with fetch...")

                // Use fetch instead of apiClient for file upload to avoid Content-Type conflicts
                const response_img = await fetch(
                    `${this.baseUrl}api/v1/user/profile_pic`,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // Don't set Content-Type - let browser set it with boundary
                        },
                        credentials: "include",
                    }
                )

                if (!response_img.ok) {
                    throw new Error(`Upload failed: ${response_img.statusText}`)
                }

                const uploadResult = await response_img.json()
                console.log("Profile image upload response:", uploadResult)
            }
            const response = await apiClient.patch(
                `${this.baseUrl}api/v1/user/`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            console.log("Update profile response data:", response)
            return this.transformUserData(response)
        } catch (error) {
            console.error("Error updating user profile:", error)
            throw new Error("Failed to update user profile")
        }
    }
}

export const userService = new UserService()
