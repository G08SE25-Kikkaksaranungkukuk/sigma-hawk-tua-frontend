import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "../../services/user";
import { UserProfile } from "../../types/user";
export interface UseCurrentUserReturn {
    currentUser: UserProfile | null;
    loading: boolean;
    error: string | null;
    refreshCurrentUser: () => Promise<void>;
    isAuthenticated: boolean;
}

/**
 * Custom hook for managing current authenticated user data
 * This hook fetches and manages the currently logged-in user's basic information
 * primarily for displaying in navigation components like AppHeader
 */
export function useCurrentUser(): UseCurrentUserReturn {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch current user data
    const fetchCurrentUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = await userService.getCurrentUser();
            console.log("Fetched current user data:", userData);
            setCurrentUser(userData);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch current user";
            setError(errorMessage);
            console.error("Error fetching current user:", err);

            // Set null user data on error
            setCurrentUser(null);

            // If authentication failed, redirect to login
            if (
                errorMessage.includes("Authentication failed") ||
                errorMessage.includes("No authentication token found")
            ) {
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // Refresh current user data
    const refreshCurrentUser = async () => {
        await fetchCurrentUser();
    };

    // Fetch user data on component mount
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return {
        currentUser,
        loading,
        error,
        refreshCurrentUser,
        isAuthenticated: !!currentUser && !error,
    };
}
