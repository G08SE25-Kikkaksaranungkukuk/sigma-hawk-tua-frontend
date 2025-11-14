import { useState, useEffect, useRef } from "react"
import { userService } from "../../services/user"
import { UserProfile, UpdateUserProfile } from "../../types/user"

export interface UseUserProfileReturn {
    userProfile: UserProfile | null
    userEmail: string
    loading: boolean
    error: string | null
    updateProfile: (profileData: UpdateUserProfile) => Promise<boolean>
    refreshProfile: () => Promise<void>
    getUserTravelHistory : () => Promise<void>
}

/**
 * Custom hook for managing user profile data
 * Handles fetching, updating, and state management for user profiles
 */
export function useUserProfile(userId?: string): UseUserProfileReturn {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [userEmail, setUserEmail] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const hasFetched = useRef(false)

    // Store the actual user ID being used
    // If no userId provided, use "current-user" to fetch current user's profile
    // Otherwise use the provided userId for viewing other user's profiles
    const actualUserId = userId || "current-user"

    // Fetch user profile data
    const fetchUserProfile = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            const profile = await userService.getUserProfile(id)
            setUserProfile(profile)
            setUserEmail(profile.email)
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch user profile"
            setError(errorMessage)
            console.error("Error fetching user profile:", err)
        } finally {
            setLoading(false)
        }
    }

    // Update user profile (excluding email)
    const updateProfile = async (
        profileData: UpdateUserProfile
    ): Promise<boolean> => {
        try {
            setError(null)
            const updatedProfile = await userService.updateUserProfile(
                actualUserId,
                profileData
            )
            setUserProfile(updatedProfile)
            return true
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update profile"
            setError(errorMessage)
            console.error("Error updating profile:", err)
            return false
        }
    }

    // Get User travel history
    const getUserTravelHistory = async (): Promise<any> => {
        try {
            setError(null)
            const updatedProfile = await userService.getTravelHistory()
            return true
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to get travel history"
            setError(errorMessage)
            console.error("Failed to get travel history:", err)
            return false
        }
    }

    // Refresh profile data
    const refreshProfile = async () => {
        hasFetched.current = false
        await fetchUserProfile(actualUserId)
    }

    // Fetch profile on component mount or userId change
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true
            fetchUserProfile(actualUserId)
        }
    }, [actualUserId])

    return {
        userProfile,
        userEmail,
        loading,
        error,
        updateProfile,
        refreshProfile,
        getUserTravelHistory
    }
}
