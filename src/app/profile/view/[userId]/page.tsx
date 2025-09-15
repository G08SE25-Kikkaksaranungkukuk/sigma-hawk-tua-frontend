"use client";
import React from "react";

// Travel styles for display mapping

type Interest = {
  id: number;
  label: string;
  emoji: string;
  color: string;
};
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
  const [interestsList, setInterestsList] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    // Fetch interests list
    fetch('/api/interest/all')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch interests');
        return res.json();
      })
      .then((data) => {
        if (data?.data?.interests) {
          setInterestsList(data.data.interests);
        }
      })
      .catch(() => setInterestsList([]));
  }, []);

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
            // Fallback image if user has no profile picture
            src={userData.profile_url || "https://pa1.aminoapps.com/8247/daa9f0f0e937149584e265bc2bac555bfc8afdfbr1-640-598_hq.gif"}
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
              <div className="flex flex-wrap gap-3 mt-2">
                {userData.userInterests.length > 0 ? (
                  userData.userInterests.map((id: number | string, idx: number) => {
                    const interest = interestsList.find((i) => i.id === id || i.id === Number(id));
                    return (
                      <span
                        key={id + '-' + idx}
                        style={{
                          background: interest ? interest.color + '33' : '#23272a',
                          borderColor: interest ? interest.color : '#fb923c33',
                          color: interest ? '#fff' : '#fb923c',
                        }}
                        className={`px-4 py-2 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow hover:scale-105 hover:shadow-lg`}
                      >
                        {interest?.emoji ? `${interest.emoji} ` : ''}
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