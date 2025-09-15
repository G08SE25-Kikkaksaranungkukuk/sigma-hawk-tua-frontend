import { UserProfile, UpdateUserProfile } from "../../types/user";

class TokenService {
    private baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    /*
    Decode JWT token to extract user data (temporary solution)
  */
    async decodeTokenData(token: string): Promise<UserProfile | null> {
        try {
            // JWT tokens have 3 parts separated by dots
            const parts = token.split(".");
            if (parts.length !== 3) {
                return null;
            }

            // Decode the payload (middle part)
            const payload = JSON.parse(b64DecodeUnicode(parts[1]));

            // Extract user data from token payload
            return {
                firstName: payload.firstName || payload.first_name || "User",
                lastName: payload.lastName || payload.last_name || "Logged In",
                middleName: payload.middleName || payload.middle_name || "",
                email: payload.email || "user@example.com",
                phoneNumber: payload.phone || payload.phoneNumber || "",
                interests: payload.interests || [],
                profileImage:
                    payload.profileImage || payload.profile_url || undefined,
            };
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    /*
    Get authentication token from cookies or localStorage
  */
    async getAuthToken(): Promise<string | null> {
        // Try to get from cookies first (primary method)
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((cookie) =>
                cookie.trim().startsWith("accessToken=")
            );
            if (tokenCookie) {
                const token = tokenCookie.split("=")[1];
                console.log(
                    "Found token in cookies:",
                    token ? "Token exists" : "No token"
                );
                return token;
            }
        }

        // Fallback to localStorage
        if (typeof window !== "undefined") {
            const token =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token") ||
                localStorage.getItem("authToken");
            console.log(
                "Found token in localStorage:",
                token ? "Token exists" : "No token"
            );
            if (token) {
                // Debug: log token payload
                try {
                    const payload = JSON.parse(
                        b64DecodeUnicode(token.split(".")[1])
                    );
                    console.log("Token payload:", payload);
                } catch (e) {
                    console.log("Token is not a valid JWT");
                }
            }
            return token;
        }

        return null;
    }

    /*
    Refresh authentication token
  */
    async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.ok;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }
    }
}

// Helper for base64url decoding (for JWT)
function b64DecodeUnicode(str: string) {
    // Add padding if needed
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return decodeURIComponent(
        Array.prototype.map
            .call(
                atob(str),
                (c: string) =>
                    "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
            )
            .join("")
    );
}

export const tokenService = new TokenService();
