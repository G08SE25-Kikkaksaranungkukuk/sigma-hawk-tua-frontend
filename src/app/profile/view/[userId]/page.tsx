"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { userService } from "@/lib/services/user";
import { tokenService } from "@/lib/services/user/tokenService";
import { interestOptions, travel_style_options } from "@/components/editprofile/constants";


export default function UserProfileView() {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await tokenService.getAuthToken();
        console.log("Fetching current user...");
        const profile = await userService.getUserProfile("");

        console.log("Profile image URL:", profile.profileImage);
        console.log("Profile data:", profile.interests);
        setFormData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          middleName: profile.middleName || "",
          phoneNumber: profile.phoneNumber,
          email: profile.email,
          profileImage: profile.profileImage,
          interests: profile.interests?.map((interestKey: string) => {
            const interest = interestOptions.find(opt => opt.key === interestKey);
            return {
              label: interest?.label || interestKey,
              color: interest?.color || "#666666",
              emoji: interest?.emoji || "",
            };
          }) || [],
          travelStyle: profile.travelStyle?.map((styleKey: string) => {
            const style = travel_style_options.find(opt => opt.key === styleKey);
            return {
              label: style?.label || styleKey,
              color: style?.color || "#666666",
              emoji: style?.emoji || "",
            };
          }) || [],
          scoreRating: profile.social_credit || 0,
          reviews: [], // Add mapping if reviews are available in backend
        });
      } catch (err: any) {
        console.error("Error fetching user or profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProfile();
  }, []);

  if (loading) {
    return <div className="text-orange-400 text-center mt-10">Loading profile...</div>;
  }
  if (error || !formData) {
    return <div className="text-red-500 text-center mt-10">{error || "No profile data found."}</div>;
  }


  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center justify-center p-4 min-h-[80vh]">
      <div className="max-w-md w-full bg-gray-900/80 border border-orange-500/20 rounded-xl shadow-2xl p-6 relative">
        <div className="flex flex-col items-center">
          <img
            src={formData.profileImage || "https://i.pravatar.cc/150?img=12"}
            alt={fullName}
            className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg mb-3"
          />
          <h2 className="text-2xl font-bold text-orange-300 mb-1">{fullName}</h2>
          {/* Display Email */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-200 font-semibold">📧 Email:</span>
            <span className="text-orange-200">{formData.email}</span>
          </div>
          {/* Display Phone Number */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-200 font-semibold">📱 Phone:</span>
            <span className="text-orange-200">{formData.phoneNumber}</span>
          </div>
          <div className="w-full space-y-3">
            <div>
              <span className="text-orange-300 font-semibold">🎯 Interests</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests?.map((interest: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-full border-2 text-sm font-medium border-orange-500/30"
                    style={interest.color ? { color: interest.color } : {}}
                  >
                    {interest.emoji ? `${interest.emoji} ` : ""}{interest.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">🧳 Travel Styles</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.travelStyle?.map((style: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-2 rounded-full border-2 text-sm font-medium bg-gray-800/50 border-orange-500/30"
                    style={style.color ? { color: style.color } : {}}
                  >
                    {style.emoji ? `${style.emoji} ` : ""}{style.label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">⭐ Score Rating</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 font-bold text-lg">{formData.scoreRating}</span>
                <span className="text-yellow-400">{"★".repeat(Math.round(formData.scoreRating || 0))}</span>
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">📝 User Reviews</span>
              <div className="space-y-2 mt-2">
                {formData.reviews?.map((review: any, idx: number) => (
                  <div key={idx} className="bg-gray-800/60 rounded-lg p-3 border border-orange-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-orange-200 font-semibold">{review.reviewer}</span>
                      <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(review.rating))}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}