import { apiClient } from "@/lib/api";
import { Rating } from "@/lib/types/user";
import { tokenService } from "./tokenService";

class RatingService {
    private baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

    /**
     * Get user rating by user ID
     * @param userId - The ID of the user to fetch rating for
     * @returns Promise<Rating> - User's rating scores
     */
    async getUserRating(userId: number): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken();
            
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.get(
                `${this.baseUrl}api/v1/user/${userId}/rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            return response.data || response;
        } catch (error) {
            console.error("Error fetching user rating:", error);
            throw new Error("Failed to fetch user rating");
        }
    }

    /**
     * Update user rating
     * @param userId - The ID of the user to rate
     * @param rating - Rating object with trust_score, engagement_score, and experience_score
     * @returns Promise<Rating> - Updated rating
     */
    async updateUserRating(userId: number, rating: Rating): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken();
            
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.put(
                `${this.baseUrl}api/v1/user/${userId}/rating`,
                rating,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            return response.data || response;
        } catch (error) {
            console.error("Error updating user rating:", error);
            throw new Error("Failed to update user rating");
        }
    }

    /**
     * Submit a new rating for a user
     * @param userId - The ID of the user to rate
     * @param ratingData - Partial rating data (can include one or more score fields)
     * @returns Promise<Rating> - Created/updated rating
     */
    async submitUserRating(userId: number, ratingData: Partial<Rating>): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken();
            
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.post(
                `${this.baseUrl}api/v1/user/${userId}/rating`,
                ratingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            return response.data || response;
        } catch (error) {
            console.error("Error submitting user rating:", error);
            throw new Error("Failed to submit user rating");
        }
    }
}

export const ratingService = new RatingService();