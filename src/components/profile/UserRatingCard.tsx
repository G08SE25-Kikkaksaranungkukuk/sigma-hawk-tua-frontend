"use client";

import React, { useState, useEffect } from "react";
import { Star, TrendingUp, Award, Users } from "lucide-react";
import { ratingService } from "@/lib/services/user/ratingService";
import { Rating } from "@/lib/types/user";

interface UserRatingCardProps {
    userId: number;
    isOwnProfile?: boolean;
}

export default function UserRatingCard({ userId, isOwnProfile = false }: UserRatingCardProps) {
    const [rating, setRating] = useState<Rating | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRating, setIsRating] = useState(false);
    const [hoverRatings, setHoverRatings] = useState<Partial<Rating>>({});
    const [tempRatings, setTempRatings] = useState<Partial<Rating>>({});

    useEffect(() => {
        fetchRating();
    }, [userId]);

    const fetchRating = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ratingService.getUserRating(userId);
            setRating(data);
        } catch (err: any) {
            console.error("Error fetching rating:", err);
            setError(err.message || "Failed to load rating");
            // Set default values if fetch fails
            setRating({
                trust_score: 0,
                engagement_score: 0,
                experience_score: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async () => {
        if (!tempRatings || Object.keys(tempRatings).length === 0) {
            return;
        }

        setIsRating(true);
        setError(null);
        try {
            const updatedRating = await ratingService.submitUserRating(userId, tempRatings);
            setRating(updatedRating);
            setTempRatings({});
            alert("Rating submitted successfully!");
        } catch (err: any) {
            console.error("Error submitting rating:", err);
            setError(err.message || "Failed to submit rating");
            alert("Failed to submit rating. Please try again.");
        } finally {
            setIsRating(false);
        }
    };

    const renderStars = (
        score: number,
        maxScore: number = 5,
        scoreKey: keyof Rating,
        isInteractive: boolean = false
    ) => {
        const normalizedScore = Math.min(Math.max(score, 0), maxScore);
        const displayScore = hoverRatings[scoreKey] ?? normalizedScore;

        return (
            <div className="flex items-center gap-1">
                {[...Array(maxScore)].map((_, idx) => {
                    const starValue = idx + 1;
                    const isFilled = starValue <= displayScore;

                    return (
                        <Star
                            key={idx}
                            className={`w-5 h-5 transition-all ${
                                isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
                            } ${isInteractive && !isOwnProfile ? "cursor-pointer hover:scale-110" : ""}`}
                            onMouseEnter={() => {
                                if (isInteractive && !isOwnProfile) {
                                    setHoverRatings({ ...hoverRatings, [scoreKey]: starValue });
                                }
                            }}
                            onMouseLeave={() => {
                                if (isInteractive && !isOwnProfile) {
                                    setHoverRatings({ ...hoverRatings, [scoreKey]: undefined });
                                }
                            }}
                            onClick={() => {
                                if (isInteractive && !isOwnProfile) {
                                    setTempRatings({ ...tempRatings, [scoreKey]: starValue });
                                }
                            }}
                        />
                    );
                })}
                <span className="ml-2 text-orange-300 font-semibold">
                    {displayScore.toFixed(1)} / {maxScore}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-gray-800/60 rounded-lg p-4 border border-orange-500/10">
                <div className="text-orange-300 text-center">Loading ratings...</div>
            </div>
        );
    }

    if (error && !rating) {
        return (
            <div className="bg-gray-800/60 rounded-lg p-4 border border-orange-500/10">
                <div className="text-red-400 text-center">{error}</div>
            </div>
        );
    }

    const averageScore = rating
        ? ((rating.trust_score + rating.engagement_score + rating.experience_score) / 3).toFixed(1)
        : "0.0";

    return (
        <div className="bg-gray-800/60 rounded-lg p-4 border border-orange-500/20 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-orange-300 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    User Rating
                </h3>
                <div className="text-right">
                    <div className="text-sm text-orange-200">Average</div>
                    <div className="text-2xl font-bold text-yellow-400">{averageScore}</div>
                </div>
            </div>

            {rating && (
                <div className="space-y-3">
                    {/* Trust Score */}
                    <div className="bg-gray-900/40 rounded-lg p-3 border border-orange-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-orange-300" />
                            <span className="text-orange-200 font-semibold">Trust Score</span>
                        </div>
                        {renderStars(
                            tempRatings.trust_score ?? rating.trust_score,
                            5,
                            "trust_score",
                            !isOwnProfile
                        )}
                    </div>

                    {/* Engagement Score */}
                    <div className="bg-gray-900/40 rounded-lg p-3 border border-orange-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-orange-300" />
                            <span className="text-orange-200 font-semibold">Engagement Score</span>
                        </div>
                        {renderStars(
                            tempRatings.engagement_score ?? rating.engagement_score,
                            5,
                            "engagement_score",
                            !isOwnProfile
                        )}
                    </div>

                    {/* Experience Score */}
                    <div className="bg-gray-900/40 rounded-lg p-3 border border-orange-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-orange-300" />
                            <span className="text-orange-200 font-semibold">Experience Score</span>
                        </div>
                        {renderStars(
                            tempRatings.experience_score ?? rating.experience_score,
                            5,
                            "experience_score",
                            !isOwnProfile
                        )}
                    </div>
                </div>
            )}

            {!isOwnProfile && Object.keys(tempRatings).length > 0 && (
                <button
                    onClick={handleRatingSubmit}
                    disabled={isRating}
                    className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                    {isRating ? "Submitting..." : "Submit Rating"}
                </button>
            )}

            {isOwnProfile && (
                <div className="text-sm text-orange-200/70 text-center italic">
                    This is your profile. You cannot rate yourself.
                </div>
            )}

            {error && (
                <div className="text-sm text-red-400 text-center">{error}</div>
            )}
        </div>
    );
}
