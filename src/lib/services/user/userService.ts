"use client";

// User service for handling user-related API calls
import { UserProfile, UpdateUserProfile } from "../../types/user";
import { baseAPIUrl } from "../../config";
import { tokenService } from "./tokenService";
const axios = require("axios");

class UserService {
    private baseUrl = baseAPIUrl;

    // Get current authenticated user data
    // New Flow: getEmailFromToken() -> tokenService.refreshToken() ->
    //          tokenService.getAuthToken() -> tokenService.decodeTokenData() ->
    //          axios call to backend with email
    async getCurrentUser(): Promise<UserProfile> {
        try {
            // 1. Get email from token using new flow
            const email = (await tokenService.getEmailFromToken()).trim();
            console.log("Email extracted from token:", email);
            // 2. Use email to get user data from backend using axios
            const response = await axios.get(`${this.baseUrl}/user/`, {
                params: {
                    email: email,
                },
                headers: {
                    Authorization: `Bearer ${tokenService.getAuthToken()}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (response.status !== 200) {
                throw new Error(
                    `Failed to fetch user data: ${response.statusText}`
                );
            }
            console.log(
                "User data fetched successfully:",
                response.data.data.user
            );
            return response.data.data.user;
            // return this.transformUserData(response.data.data.user);
        } catch (error) {
            console.error("Error in getCurrentUser:", error);
            throw new Error("Failed to fetch current user data");
        }
    }

    // Fetch user profile data from database
    async getUserProfile(email?: string): Promise<UserProfile> {
        try {
            const token = tokenService.getAuthToken();
            if (!token) throw new Error("No authentication token found");
            if (!email) {
                throw new Error("No email provided");
            }
            const response = await axios.get(`${this.baseUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    email: email,
                },
                withCredentials: true,
            });
            if (response.status !== 200) {
                throw new Error(
                    `Failed to fetch user profile: ${response.statusText}`
                );
            }
            const userData = response.data.data.user;
            return userData;
            // return this.transformUserData(userData);
        } catch (error) {
            throw new Error("Failed to fetch user profile");
        }
    }

    // Update user profile (excluding email)
    async updateUserProfile(profileData: any): Promise<UserProfile> {
        try {
            const token = tokenService.getAuthToken();
            if (!token) throw new Error("No authentication token found");
            console.log("Updating user profile with data:", profileData);
            const response = await axios.patch(
                `${this.baseUrl}/user`,
                { profileData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            if (response.status !== 200)
                throw new Error(
                    `Failed to update user profile: ${response.statusText}`
                );
            const updatedUser = response.data.data.user;
            return updatedUser;
            // return this.transformUserData(updatedUser);
        } catch {
            throw new Error("Failed to update user profile");
        }
    }
    // Public method to refresh authentication token
    async refreshAuthToken(): Promise<boolean> {
        return await tokenService.refreshToken();
    }
}

export const userService = new UserService();
