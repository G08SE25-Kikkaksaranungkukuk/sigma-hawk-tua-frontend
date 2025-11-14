import { apiClient } from "@/lib/api"
import { Rating } from "@/lib/types/user"
import { tokenService } from "./tokenService"

class RatingService {
    private baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL

    /**
     * Helper method to decode JWT token payload
     * @param token - JWT token string
     * @returns Decoded payload object
     */
    private decodeJwtPayload(token: string): any {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error("Invalid JWT token format")
        }
        
        try {
            return JSON.parse(
                atob(parts[1].replaceAll(/-/g, '+').replaceAll(/_/g, '/'))
            )
        } catch (error) {
            throw new Error("Failed to decode JWT token payload")
        }
    }

    /**
     * Helper method to convert email to user ID if needed
     * @param userIdentifier - User ID or email or "current-user"
     * @returns User ID string
     */
    private async getUserIdFromIdentifier(userIdentifier: string): Promise<string> {
        let userId = userIdentifier
        console.log(`Resolving user identifier: ${userIdentifier}`)
        // Handle "current-user" case
        if (!userIdentifier.includes("@")) {
            return userId
        }
        
        const userIdToEmailMap = sessionStorage.getItem("userIdToEmailMap")
        const emailMap = userIdToEmailMap ? JSON.parse(userIdToEmailMap) : {}

        // Find user ID by email (reverse lookup)
        const foundUserId = Object.keys(emailMap).find(
            (id) => emailMap[id] === userIdentifier
        )

        if (foundUserId) {
            return foundUserId
        }

        // If not in session storage, extract from current user's token
        const token = await tokenService.getAuthToken()
        if (!token) {
            throw new Error(`No authentication token found to resolve email: ${userIdentifier}`)
        }
        try {
            const payload = this.decodeJwtPayload(token)
            userId = payload.user_id?.toString()
        } catch (error) {
            throw new Error(`Failed to resolve email ${userIdentifier}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
        
        return userId
    }

    /**
     * Get user rating by user ID or email
     * @param userIdentifier - The ID or email of the user to fetch rating for
     * @returns Promise<Rating> - User's rating scores
     */
    async getUserRating(userIdentifier: string): Promise<Rating | null> {
        try {
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }
            const userId = await this.getUserIdFromIdentifier(userIdentifier)

            const response: any = await apiClient.get(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )

            // If the backend didn't return average scores (null/undefined),
            // return null so callers can detect "no ratings".
            if (response?.average_scores == null) {
                return null
            }

            return {
                trust_score: response.average_scores.trust,
                engagement_score: response.average_scores.engagement,
                experience_score: response.average_scores.experience,
                total_score: response.average_scores.total,
            }
        } catch (error) {
            console.error("Error fetching user rating:", error)
            throw new Error("Failed to fetch user rating")
        }
    }

    /**
     * Update user rating
     * @param userIdentifier - The ID or email of the user to rate
     * @param rating - Rating object with trust_score, engagement_score, and experience_score
     * @returns Promise<Rating> - Updated rating
     */
    async updateUserRating(
        userIdentifier: string,
        rating: any
    ): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }

            const userId = await this.getUserIdFromIdentifier(userIdentifier)

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
            )

            return response.data || response
        } catch (error) {
            console.error("Error updating user rating:", error)
            throw new Error("Failed to update user rating")
        }
    }

    /**
     * Submit a new rating for a user
     * @param userIdentifier - The ID or email of the user to rate
     * @param ratingData - Partial rating data (can include one or more score fields)
     * @returns Promise<Rating> - Created/updated rating
     */
    async submitUserRating(
        userIdentifier: string,
        ratingData: Partial<Rating>
    ): Promise<Rating> {
        try {
            const token = await tokenService.getAuthToken()

            if (!token) {
                throw new Error("No authentication token found")
            }

            const userId = await this.getUserIdFromIdentifier(userIdentifier)

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
            )

            return response.data || response
        } catch (error) {
            console.error("Error submitting user rating:", error)
            throw new Error("Failed to submit user rating")
        }
    }

    async getRatingByRater(
        userIdentifier: string,
        raterId: number
    ): Promise<Rating | null> {
        try {
            const token = await tokenService.getAuthToken()
            if (!token) throw new Error("No authentication token found")

            const userId = await this.getUserIdFromIdentifier(userIdentifier)

            const response: any = await apiClient.get(
                `${this.baseUrl}api/v1/rating/user/${userId}/rating`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )

            // response should contain { average_scores: {...}, ratings: [ ... ] }
            const ratings = Array.isArray(response.ratings)
                ? response.ratings
                : []
            console.log("All ratings fetched:", ratings)
            console.log("Searching for rating by rater ID:", raterId)

            const found = ratings.find(
                (r: any) => Number(r.rater_id) === Number(raterId)
            )
            console.log("Found rating by rater:", found)
            if (!found) return null

            return {
                trust_score: found.trust_score,
                engagement_score: found.engagement_score,
                experience_score: found.experience_score,
                total_score: found.total_score,
            }
        } catch (err) {
            console.error("Error fetching rating by rater:", err)
            throw err
        }
    }
}

export const ratingService = new RatingService()
