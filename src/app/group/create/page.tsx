"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/components/ui/utils";
import { CreateGroupRequest, GroupData } from "@/lib/types"
import { apiClient } from "@/lib/api";
import { PopupCard } from "@/components/ui/popup-card";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const INTERESTS = [
  "SEA",
  "MOUNTAIN",
  "WATERFALL",
  "NATIONAL_PARK",
  "ISLAND",
  "TEMPLE",
  "SHOPPING_MALL",
  "MARKET",
  "CAFE",
  "HISTORICAL",
  "AMUSEMENT_PARK",
  "ZOO",
  "FESTIVAL",
  "MUSEUM",
  "FOOD_STREET",
  "BEACH_BAR",
  "THEATRE"
] as const;

// Helper function to format interest labels
const formatInterestLabel = (interest: string) => {
  return interest.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Success Modal Component
interface GroupCreateSuccessProps {
  isOpen: boolean;
}

function GroupCreateSuccess({ isOpen }: GroupCreateSuccessProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="min-h-screen bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.6 }}
            >
              <PopupCard className="max-w-md w-full bg-gray-900/95 border-2 border-orange-500/30 p-6 text-white">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                      Group Created Successfully! 🎉
                    </h2>
                    <p className="text-gray-300">
                      Your travel group has been created! Redirecting you to the group page...
                    </p>
                  </div>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    group_name: "Bangkok → Chiang Mai Lantern Trip",
    description:
      "We’re catching the Yi Peng lantern festival, cafe hopping, and a one-day trek. Looking for easy-going travelers who like food, photos, and night markets.",
    destination: "Chiang Mai, Thailand",
    startDate: "2025-11-12",
    endDate: "2025-11-16",
    tags: ["TEMPLE", "CAFE", "FESTIVAL", "MARKET"] as string[],
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleTagToggle = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(interest)
        ? prev.tags.filter(tag => tag !== interest)
        : [...prev.tags, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Map form data to CreateGroupRequest
      const createGroupRequest: CreateGroupRequest = {
        group_name: form.group_name,
        interest_fields: form.tags
      };

      // Make API call to POST /group
      const response = await apiClient.post<GroupData>('/group', createGroupRequest, {
        withCredentials: true
      });

      console.log("Group created successfully:", response.data);
      
      // Show success popup
      setShowSuccessModal(true);

      // Get the group ID from response and redirect after delay
      const groupId = response.data?.group_id;
      setTimeout(() => {
        if (groupId) {
          router.push(`/group/${groupId}/info`);
        } else {
          router.push('/home'); // Fallback to home if no group ID
        }
      }, 2000);

    } catch (error) {
      console.error("Failed to create group:", error);
      // You can add error handling here (e.g., show error message)
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-6 md:p-10" style={{ background: brand.bg }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview section */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl shadow-xl overflow-hidden p-6 flex flex-col gap-4"
            style={{
              background: brand.card,
              border: `1px solid ${brand.border}`,
            }}
          >
            <span
              className="text-sm font-semibold px-3 py-1 rounded-full w-fit"
              style={{ backgroundColor: brand.accent, color: brand.bg }}
            >
              Preview
            </span>

            <h2 className="text-xl font-bold" style={{ color: brand.fg }}>
              {form.group_name || "Group Title"}
            </h2>
            <p className="text-sm" style={{ color: brand.sub }}>
              {form.destination} • {form.startDate} → {form.endDate}
            </p>

            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: brand.bg,
                    border: `1px solid ${brand.border}`,
                    color: brand.sub,
                  }}
                >
                  {formatInterestLabel(tag)}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: brand.fg }}>
              {form.description}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2" style={{ color: brand.fg }}>
                Itinerary
              </h3>
              <ul className="text-sm space-y-2" style={{ color: brand.sub }}>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: brand.accent }}></span>
                  Day 1: Fly BKK → CNX, Nimman dinner
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: brand.accent }}></span>
                  Day 2: Old City temples + cafe crawl
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: brand.accent }}></span>
                  Day 3: Doi Suthep + Hmong village
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: brand.accent }}></span>
                  Day 4: Yi Peng Lantern Festival
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className="lg:col-span-1">
          <div
            className="rounded-2xl shadow-xl overflow-hidden p-8"
            style={{
              background: brand.card,
              border: `1px solid ${brand.border}`,
            }}
          >
            <h1 className="text-2xl font-bold mb-6" style={{ color: brand.accent }}>
              Create New Group
            </h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: brand.sub }}>
                  Group Title
                </label>
                <input
                  type="text"
                  name="group_name"
                  value={form.group_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: brand.bg,
                    border: `1px solid ${brand.border}`,
                    color: brand.fg,
                  }}
                  placeholder="Enter group title..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: brand.sub }}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none resize-none transition-colors focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: brand.bg,
                    border: `1px solid ${brand.border}`,
                    color: brand.fg,
                  }}
                  placeholder="Describe your trip..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: brand.sub }}>
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: brand.bg,
                    border: `1px solid ${brand.border}`,
                    color: brand.fg,
                  }}
                  placeholder="Where are you going?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: brand.sub }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: brand.bg,
                      border: `1px solid ${brand.border}`,
                      color: brand.fg,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: brand.sub }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-opacity-50"
                    style={{
                      backgroundColor: brand.bg,
                      border: `1px solid ${brand.border}`,
                      color: brand.fg,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium" style={{ color: brand.sub }}>
                  Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INTERESTS.map((interest) => {
                    const isSelected = form.tags.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleTagToggle(interest)}
                        className="px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{
                          backgroundColor: isSelected ? brand.accent : brand.bg,
                          color: isSelected ? brand.bg : brand.sub,
                          border: `1px solid ${isSelected ? brand.accent : brand.border}`,
                        }}
                      >
                        {formatInterestLabel(interest)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: brand.sub }}>
                  Upload Image
                </label>
                <div
                  className="w-full px-4 py-6 rounded-lg border-2 border-dashed text-center transition-colors hover:border-opacity-60"
                  style={{
                    backgroundColor: brand.bg,
                    borderColor: brand.border,
                    color: brand.sub,
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.accent }}>
                      <span className="text-white text-lg">+</span>
                    </div>
                    <span className="text-sm">
                      {form.image ? form.image.name : "Click to upload image"}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: brand.accent,
                  color: brand.bg,
                }}
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      <GroupCreateSuccess isOpen={showSuccessModal} />
    </div>
  );
}
