"use client";

import React, { useState, useEffect } from "react";
import { Star, TrendingUp, Award, Users } from "lucide-react";
import { ratingService } from "@/lib/services/user/ratingService";
import { Rating } from "@/lib/types/user";
import { groupService } from "@/lib/services/group/group-service";

interface UserRatingCardProps {
    readonly userId: string;
    readonly isOwnProfile?: boolean;
    readonly onRatingUpdated?: () => void | Promise<void>;

}

export default function UserRatingCard({ userId, isOwnProfile = false, onRatingUpdated }: UserRatingCardProps) {
    const [rating, setRating] = useState<Rating | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRating, setIsRating] = useState(false);
    const [hasExistingReview, setHasExistingReview] = useState<boolean | null>(null);
    const [hoverRatings, setHoverRatings] = useState<Partial<Rating>>({});
    const [tempRatings, setTempRatings] = useState<Partial<Rating>>({});

    // whether the user has changed any score (used to enable the submit button)
    const hasChanges = Object.keys(tempRatings).length > 0;

    useEffect(() => {
        fetchRating();
    }, [userId]);

    const fetchRating = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentUser = await groupService.getCurrentUser();
            console.log("Current user data:", currentUser);
            console.log("Current user ID:", currentUser.user_id);
            const data = await ratingService.getRatingByRater(userId, currentUser.user_id);
            console.log("Fetched rating data:", data);
            // If the current user hasn't rated this profile yet, service
            // returns null. Prefill tempRatings with 5s (preview) and mark
            // that there's no existing review. Otherwise use the returned data.
            if (data === null) {
                setTempRatings({
                    trust_score: 5,
                    engagement_score: 5,
                    experience_score: 5,
                });
                setRating({
                    trust_score: 0,
                    engagement_score: 0,
                    experience_score: 0,
                    total_score: 0,
                });
                setHasExistingReview(false);
            } else {
                setRating(data);
                setHasExistingReview(true);
            }
        } catch (err: any) {
            console.error("Error fetching rating:", err);
            setError(err.message || "Failed to load rating");
            // Set default values if fetch fails
            setRating({
                trust_score: 0,
                engagement_score: 0,
                experience_score: 0,
                total_score: 0
            });
            setHasExistingReview(null);
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
            console.log("Submitting rating:", tempRatings);
            let updatedRating: any;
            // If user had no existing review, create one; otherwise update.
            if (hasExistingReview === false) {
                updatedRating = await ratingService.submitUserRating(userId, tempRatings as any);
            } else {
                updatedRating = await ratingService.updateUserRating(userId, tempRatings);
            }
            setRating(updatedRating);
            setTempRatings({});
            // Notify parent so it can refresh aggregate scores
            if (typeof onRatingUpdated === "function") {
                try {
                    await onRatingUpdated()
                } catch (e) {
                    console.error("onRatingUpdated callback failed:", e)
                }
            }
            // show a small confirmation
            //alert("Rating submitted successfully!");
        } catch (err: any) {
            console.error("Error submitting rating:", err);
            setError(err.message || "Failed to submit rating");
        } finally {
            setIsRating(false);
        }
    };

    // Clicking a star will only set a temporary rating; actual submit happens when the Submit button is clicked.

    const renderStars = (
        score: number,
        maxScore: number = 5,
        scoreKey: keyof Rating,
        isInteractive: boolean = false
    ) => {
        const normalizedScore = Math.min(Math.max(score, 0), maxScore);
        const displayScore = hoverRatings[scoreKey] ?? normalizedScore;

        const calcStarValueFromEvent = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            return relativeX < rect.width / 2 ? starValue - 0.5 : starValue;
        };

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
            if (!(isInteractive && !isOwnProfile)) return;
            const value = calcStarValueFromEvent(e, starValue);
            setHoverRatings(prev => ({ ...prev, [scoreKey]: value }));
        };

        const handleMouseLeave = () => {
            if (isInteractive && !isOwnProfile) {
                setHoverRatings(prev => ({ ...prev, [scoreKey]: undefined }));
            }
        };

        const handleClick = (e: React.MouseEvent<HTMLDivElement>, starValue: number) => {
            if (!(isInteractive && !isOwnProfile)) return;
            const value = calcStarValueFromEvent(e, starValue);
            setTempRatings(prev => ({ ...prev, [scoreKey]: value }));
        };

        return (
            <div className="flex items-center gap-1">
                {[...Array(maxScore)].map((_, idx) => {
                    const starValue = idx + 1;
                    const full = displayScore >= starValue;
                    const half = !full && displayScore >= starValue - 0.5;

                    return (
                        <div
                            key={idx}
                            className={`relative inline-block w-5 h-5 ${isInteractive && !isOwnProfile ? 'cursor-pointer' : ''}`}
                            onMouseMove={(e) => handleMouseMove(e, starValue)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleClick(e, starValue)}
                            // Accessibility: non-native interactive element — provide role,
                            // keyboard support and tab focus when interactive.
                            role={isInteractive && !isOwnProfile ? 'button' : undefined}
                            tabIndex={isInteractive && !isOwnProfile ? 0 : -1}
                            aria-label={isInteractive && !isOwnProfile ? `Set ${String(scoreKey)} to ${starValue} stars` : undefined}
                            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                if (!(isInteractive && !isOwnProfile)) return;
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    // For keyboard we select the full star (no half-step)
                                    setTempRatings(prev => ({ ...prev, [scoreKey]: starValue }));
                                }
                            }}
                        >
                            <Star className={`w-5 h-5 ${full || half ? 'text-yellow-400' : 'text-gray-500'}`} />
                            {full && (
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute left-0 top-0" />
                            )}
                            {half && !full && (
                                <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', overflow: 'hidden' }}>
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                </div>
                            )}
                        </div>
                    );
                })}
                <span className="ml-2 text-orange-300 font-semibold">
                    {displayScore.toFixed(2)} / {maxScore}
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
        ? ((rating.trust_score + rating.engagement_score + rating.experience_score) / 3).toFixed(2)
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

            {!isOwnProfile && (
                <button
                    onClick={handleRatingSubmit}
                    disabled={isRating || !hasChanges}
                    className={`w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg transition-colors duration-200 ${
                        !isRating && hasChanges ? 'hover:bg-orange-600' : ''
                    } ${isRating || !hasChanges ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isRating ? 'Submitting...' : 'Submit Rating'}
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
