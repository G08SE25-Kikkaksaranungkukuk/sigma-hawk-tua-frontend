"use client";

// Token service for handling authentication token operations
class TokenService {
    // Get authentication token from cookies or localStorage
    getAuthToken(): string | null {
        if (typeof document !== "undefined") {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((cookie) =>
                cookie.trim().startsWith("accessToken=")
            );
            if (tokenCookie) return tokenCookie.split("=")[1];
        }
        if (typeof window !== "undefined") {
            const token =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token") ||
                localStorage.getItem("authToken");
            return token || null;
        }
        return null;
    }

    // Refresh authentication token
    async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Decode JWT token and extract email
    decodeTokenData(token: string): { email: string } | null {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) return null;
            const payload = JSON.parse(atob(parts[1]));

            const email = payload.email || payload.sub || null;
            if (!email) return null;

            return { email };
        } catch {
            return null;
        }
    }

    // Get email from token - main function for the new flow
    async getEmailFromToken(): Promise<string> {
        try {
            // 1. Refresh token first
            await this.refreshToken();

            // 2. Get auth token
            const token = this.getAuthToken();
            if (!token) throw new Error("No authentication token found");

            // 3. Decode token and extract email
            const tokenData = this.decodeTokenData(token);
            if (!tokenData || !tokenData.email) {
                throw new Error("Unable to extract email from token");
            }

            return tokenData.email;
        } catch (error) {
            throw new Error("Failed to get email from token");
        }
    }
}

export const tokenService = new TokenService();
