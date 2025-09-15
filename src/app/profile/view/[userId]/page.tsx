"use client";
import React from "react";

// Example interests and travel styles for display mapping
const interestsList = [
  { id: "SEA", label: "🌊 Sea", color: "bg-blue-500/20 text-blue-300" },
  { id: "MOUNTAIN", label: "⛰️ Mountain", color: "bg-green-500/20 text-green-300" },
  { id: "FOOD_STREET", label: "🍴 Food Street", color: "bg-rose-500/20 text-rose-300" },
  { id: "FESTIVAL", label: "🎉 Festival", color: "bg-red-500/20 text-red-300" },
  // ...add more as needed
];
const travelStylesList = [
  { id: "BUDGET", label: "💰 Budget", color: "text-orange-400" },
  { id: "BACKPACK", label: "🎒 Backpack", color: "text-orange-400" },
  // ...add more as needed
];

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const defaultUserData = {
  first_name: "",
  middle_name: null,
  last_name: "",
  birth_date: "",
  sex: "",
  phone: "",
  profile_url: null,
  social_credit: 0,
  userInterests: [],
  userTravelStyles: [],
};

export default function UserProfileView() {
  const params = useParams();
  const userId = params?.userId;
  const [userData, setUserData] = useState(defaultUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError("");
    fetch(`/api/profile?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        if (data?.data?.user) {
          setUserData({
            first_name: data.data.user.first_name || "",
            middle_name: data.data.user.middle_name,
            last_name: data.data.user.last_name || "",
            birth_date: data.data.user.birth_date || "",
            sex: data.data.user.sex || "",
            phone: data.data.user.phone || "",
            profile_url: data.data.user.profile_url,
            social_credit: data.data.user.social_credit || 0,
            userInterests: (data.data.user.userInterests || []).map((obj: any) => obj.interest_id || obj),
            userTravelStyles: (data.data.user.userTravelStyles || []).map((obj: any) => obj.travel_style_id || obj),
          });
        } else {
          setError("User not found");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const fullName = [userData.first_name, userData.middle_name, userData.last_name]
    .filter(Boolean)
    .join(" ");

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-orange-300 text-xl">Loading profile...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/80 border border-orange-500/20 rounded-xl shadow-2xl p-6 relative">
        <div className="flex flex-col items-center">
          <img
            src={userData.profile_url || "https://i.pravatar.cc/150?img=12"}
            alt={fullName}
            className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-lg mb-3"
          />
          <h2 className="text-2xl font-bold text-orange-300 mb-1">{fullName}</h2>
          {/* Display Phone Number */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-200 font-semibold">📱 Phone:</span>
            <span className="text-orange-200">{userData.phone}</span>
          </div>
          <div className="w-full space-y-3">
            <div>
              <span className="text-orange-300 font-semibold">🎯 Interests</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.userInterests.length > 0 ? (
                  userData.userInterests.map((id, idx) => {
                    const interest = interestsList.find((i) => i.id === id);
                    return (
                      <span
                        key={id + '-' + idx}
                        className={`px-3 py-2 rounded-full border-2 text-sm font-medium ${interest?.color ?? ""} border-orange-500/30`}
                      >
                        {interest?.label ?? id}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">No interests specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">🧳 Travel Styles</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.userTravelStyles.length > 0 ? (
                  userData.userTravelStyles.map((id, idx) => {
                    const style = travelStylesList.find((s) => s.id === id);
                    return (
                      <span
                        key={id + '-' + idx}
                        className={`px-3 py-2 rounded-full border-2 text-sm font-medium bg-gray-800/50 border-orange-500/30 ${style?.color ?? ""}`}
                      >
                        {style?.label ?? id}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">No travel styles specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">⭐ Social Credit</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 font-bold text-lg">{userData.social_credit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}