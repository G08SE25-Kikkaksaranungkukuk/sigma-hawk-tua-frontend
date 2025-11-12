"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ConciergeBellIcon } from "lucide-react"
import { userService } from "@/lib/services/user"
import { ratingService } from "@/lib/services/user/ratingService"
import { tokenService } from "@/lib/services/user/tokenService"
import UserRatingCard from "@/components/profile/UserRatingCard"
import {
    interestOptions,
    travel_style_options,
} from "@/components/editprofile/constants"
import { group } from "console"
import { groupService } from "@/lib/services/group/group-service"

export default function UserProfileView({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const router = useRouter()
    const [formData, setFormData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewedUserId, setViewedUserId] = useState<string | null>(null)
    const [isOwnProfile, setIsOwnProfile] = useState(false)

    // Resolve the userId from the incoming params (params is a Promise in client components)
    // We can't `await` at top-level in a client component, so resolve inside an effect.
    const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const p = (await params) as { userId: string };
                let id = p.userId;

                if (id === "current-user") {
                    // replace with the logged-in user's email
                    const currentUser = await userService.getCurrentUser();
                    id = currentUser?.email ?? id;
                }

                if (mounted) setResolvedUserId(id);
            } catch (err) {
                console.error("Failed to resolve userId from params:", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [params]);

    const userEmail = resolvedUserId ? decodeURIComponent(resolvedUserId) : null; // Decode the email from URL when available

    // Memoized fetch function the child can call after it updates ratings.
    const fetchUserAndProfile = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            if (!userEmail) {
                setLoading(false)
                return
            }

            const profile = await userService.getUserProfile(userEmail)

            // Get current user to check if it's their own profile
            const currentUser = await userService.getCurrentUser()
            const isOwn = currentUser.email === profile.email
            setIsOwnProfile(isOwn)

            // parse token payload safely to extract viewed id (if available)
            let viewedId: string | null = null
            const token = await tokenService.getAuthToken()
            if (token) {
                const parts = token.split(".")
                if (parts.length === 3) {
                    try {
                        const payload = JSON.parse(
                            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
                        )
                        viewedId = payload.email || null
                    } catch (e) {
                        viewedId = null
                    }
                }
            }
            setViewedUserId(viewedId)


            const rating = await ratingService.getUserRating(userEmail)

            setFormData({
                firstName: profile.firstName,
                lastName: profile.lastName,
                middleName: profile.middleName || "",
                phoneNumber: profile.phoneNumber,
                email: profile.email,
                profileImage: profile.profileImage,
                interests:
                    profile.interests?.map((interestKey: string) => {
                        const interest = interestOptions.find(
                            (opt) => opt.key === interestKey
                        )
                        return {
                            label: interest?.label || interestKey,
                            color: interest?.color || "#666666",
                            emoji: interest?.emoji || "",
                        }
                    }) || [],
                travelStyle:
                    profile.travelStyle?.map((styleKey: string) => {
                        const style = travel_style_options.find(
                            (opt) => opt.key === styleKey
                        )
                        return {
                            label: style?.label || styleKey,
                            color: style?.color || "#666666",
                            emoji: style?.emoji || "",
                        }
                    }) || [],
                // rating may be null when there are no average scores
                scoreRating: rating,
                reviews: [],
            })
            console.log("Fetched profile data:", profile)
            console.log("Fetched rating data:", rating)
            //console.log("Fetched rating data:", formData.scoreRating)
        } catch (err: any) {
            console.error("Error fetching user or profile:", err)
            setError("Failed to load user profile")
        } finally {
            setLoading(false)
        }
    }, [userEmail])

    useEffect(() => {
        if (userEmail) {
            void fetchUserAndProfile()
        }
    }, [userEmail, fetchUserAndProfile])

    if (loading) {
        return (
            <div className="text-orange-400 text-center mt-10">
                Loading profile...
            </div>
        )
    }
    if (error || !formData) {
        return (
            <div className="text-red-500 text-center mt-10">
                {error || "No profile data found."}
            </div>
        )
    }

    const fullName = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <div className="flex items-center justify-center p-4 min-h-[80vh] bg-black relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
                <div className="absolute top-40 right-20 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
                <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
                <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/25 rounded-full float"></div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-orange-500/15 rounded-full float-delayed"></div>
            </div>

            <div className="max-w-md w-full bg-gray-900/80 border border-orange-500/20 rounded-xl shadow-2xl p-6 relative z-10">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>
                <div className="flex flex-col items-center">
                    <img
                        src={
                            formData.profileImage ||
                            "https://i.pravatar.cc/150?img=12"
                        }
                        alt={fullName}
                        className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg mb-3"
                    />
                    <h2 className="text-2xl font-bold text-orange-300 mb-1">
                        {fullName}
                    </h2>
                    {/* Display Email */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-200 font-semibold">
                            📧 Email:
                        </span>
                        <span className="text-orange-200">
                            {formData.email}
                        </span>
                    </div>
                    {/* Display Phone Number */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-orange-200 font-semibold">
                            📱 Phone:
                        </span>
                        <span className="text-orange-200">
                            {formData.phoneNumber}
                        </span>
                    </div>
                    <div className="w-full space-y-3">
                        <div>
                            <span className="text-orange-300 font-semibold">
                                🎯 Interests
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.interests?.map(
                                    (interest: any, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-2 rounded-full border-2 text-sm font-medium border-orange-500/30"
                                            style={
                                                interest.color
                                                    ? { color: interest.color }
                                                    : {}
                                            }
                                        >
                                            {interest.emoji
                                                ? `${interest.emoji} `
                                                : ""}
                                            {interest.label}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-orange-300 font-semibold">
                                🧳 Travel Styles
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.travelStyle?.map(
                                    (style: any, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-2 rounded-full border-2 text-sm font-medium bg-gray-800/50 border-orange-500/30"
                                            style={
                                                style.color
                                                    ? { color: style.color }
                                                    : {}
                                            }
                                        >
                                            {style.emoji
                                                ? `${style.emoji} `
                                                : ""}
                                            {style.label}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-orange-300 font-semibold">
                                ⭐ Score Rating
                            </span>
                            <div className="flex items-center gap-2 mt-2">
                                {formData.scoreRating == null ? (
                                    <span className="text-orange-400 font-bold text-lg">No ratings</span>
                                ) : (
                                    <>
                                        <span className="text-orange-400 font-bold text-lg">
                                            {(
                                                0.2 * (formData.scoreRating.trust_score ?? 0) +
                                                0.3 * (formData.scoreRating.engagement_score ?? 0) +
                                                0.5 * (formData.scoreRating.experience_score ?? 0)
                                            ).toFixed(2)}
                                        </span>
                                        <span className="text-yellow-400">
                                            {"★".repeat(
                                                Math.min(
                                                    5,
                                                    Math.max(
                                                        0,
                                                        Math.ceil(
                                                            0.2 * (formData.scoreRating.trust_score ?? 0) +
                                                            0.3 * (formData.scoreRating.engagement_score ?? 0) +
                                                            0.5 * (formData.scoreRating.experience_score ?? 0)
                                                        )
                                                    )
                                                )
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* User Rating Card - show only when viewing another user's profile */}
                        {!isOwnProfile && viewedUserId && (
                            <UserRatingCard
                                userId={formData.email}
                                isOwnProfile={isOwnProfile}
                                onRatingUpdated={fetchUserAndProfile}
                            />
                        )}
                        

                    </div>
                </div>
            </div>
        </div>
    )
}
