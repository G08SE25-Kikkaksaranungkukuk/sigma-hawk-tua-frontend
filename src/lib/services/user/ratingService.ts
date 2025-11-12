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
    async getUserRating(userId: string): Promise<Rating | null> {
        try {
            const token = await tokenService.getAuthToken();
            //console.log("Auth token:", token);
            //console.log("Fetching rating for user ID:", userId);

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.get(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            console.log("Rating response data:", response);

            // If the backend didn't return average scores (null/undefined),
            // return null so callers can detect "no ratings".
            if (response == null || response.average_scores == null) {
                return null;
            }

            return {
                trust_score: response.average_scores.trust,
                engagement_score: response.average_scores.engagement,
                experience_score: response.average_scores.experience,
                total_score: response.average_scores.total,
            };
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
    async updateUserRating(userId: string, rating: any): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.put(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
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
    async submitUserRating(userId: string, ratingData: Partial<Rating>): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken();

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response: any = await apiClient.post(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
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

    async getRatingByRater(userId: string, raterId: number): Promise<Rating | null> {
        try {
            const token = await tokenService.getAuthToken();
            if (!token) throw new Error("No authentication token found");

            const response: any = await apiClient.get(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            // response should contain { average_scores: {...}, ratings: [ ... ] }
            console.log("Ratings response data:", response);
            const ratings = Array.isArray(response.ratings) ? response.ratings : [];
            console.log("All ratings fetched:", ratings);
            console.log("Searching for rating by rater ID:", raterId);
            
            const found = ratings.find((r: any) => Number(r.rater_id) === Number(raterId));
            console.log("Found rating by rater:", found);
            if (!found) return null;

            return {
                trust_score: found.trust_score,
                engagement_score: found.engagement_score,
                experience_score: found.experience_score,
                total_score: found.total_score,
            };
        } catch (err) {
            console.error("Error fetching rating by rater:", err);
            throw err;
        }
    }
}

export const ratingService = new RatingService();