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

// Example formData (replace with actual state/props in real usage)
const formData = {
  firstName: "Jane",
  lastName: "Doe",
  middleName: "A.",
  phoneNumber: "+66 1234 5678",
  email: "jane.doe@email.com",
  interests: ["SEA", "FESTIVAL"],
  travelStyle: ["BUDGET", "BACKPACK"],
  scoreRating: 4.7,
  reviews: [
    {
      reviewer: "John Smith",
      comment: "Jane is a wonderful travel companion! Very friendly and organized.",
      rating: 5,
    },
    {
      reviewer: "Alice Lee",
      comment: "Had a great time exploring with Jane. Highly recommended!",
      rating: 4.5,
    },
  ],
};

export default function UserProfileView() {
  const fullName = [formData.firstName, formData.middleName, formData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/80 border border-orange-500/20 rounded-xl shadow-2xl p-6 relative">
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/150?img=12"
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
                {formData.interests.map((id) => {
                  const interest = interestsList.find((i) => i.id === id);
                  return (
                    <span
                      key={id}
                      className={`px-3 py-2 rounded-full border-2 text-sm font-medium ${interest?.color ?? ""} border-orange-500/30`}
                    >
                      {interest?.label ?? id}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">🧳 Travel Styles</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.travelStyle.map((id) => {
                  const style = travelStylesList.find((s) => s.id === id);
                  return (
                    <span
                      key={id}
                      className={`px-3 py-2 rounded-full border-2 text-sm font-medium bg-gray-800/50 border-orange-500/30 ${style?.color ?? ""}`}
                    >
                      {style?.label ?? id}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">⭐ Score Rating</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 font-bold text-lg">{formData.scoreRating}</span>
                <span className="text-yellow-400">{"★".repeat(Math.round(formData.scoreRating))}</span>
              </div>
            </div>
            <div>
              <span className="text-orange-300 font-semibold">📝 User Reviews</span>
              <div className="space-y-2 mt-2">
                {formData.reviews.map((review, idx) => (
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