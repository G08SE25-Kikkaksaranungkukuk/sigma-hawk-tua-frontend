import type { GroupInfo } from "@/components/schemas";

// Sample data for development - move to API/database in production
export const SAMPLE_GROUP_DATA: GroupInfo = {
  title: "Bangkok → Chiang Mai Lantern Trip",
  destination: "Chiang Mai, Thailand",
  dates: "12–16 Nov 2025 • 4 nights",
  timezone: "GMT+7",
  description:
    "We're catching the Yi Peng lantern festival, cafe hopping, and a one‑day trek. Looking for easy‑going travelers who like food, photos, and night markets.",
  privacy: "Private",
  maxSize: 8,
  currentSize: 5,
  pace: "Balanced",
  languages: ["English", "ไทย"],
  interests: ["Food tour", "Temples", "Street photo", "Hiking", "Night market"],
  requirements: ["ID/passport required for flights", "Comfortable with shared rooms", "Respect local culture"],
  rules: ["No smoking in rooms", "Split bills with app", "Quiet hours 22:30–07:00"],
  itinerary: [
    { day: "Day 1", plan: "Fly BKK → CNX | Nimman dinner" },
    { day: "Day 2", plan: "Old City temples + cafe crawl" },
    { day: "Day 3", plan: "Doi Suthep + Hmong village" },
    { day: "Day 4", plan: "Yi Peng Lantern Festival" },
  ],
  hostNote: "We prioritize friendly vibes over strict schedules ✨",
  members: [
    { id: "u1", name: "Mild", role: "Host" },
    { id: "u2", name: "Ken", role: "Co‑host" },
    { id: "u3", name: "Bea", role: "Member" },
    { id: "u4", name: "Poom", role: "Member" },
    { id: "u5", name: "Nui", role: "Member" },
  ],
};

// Mock API service for future implementation
export const groupService = {
  getGroup: async (groupId: string): Promise<GroupInfo> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would be a real API call
    // return fetch(`/api/groups/${groupId}`).then(res => res.json());
    
    return SAMPLE_GROUP_DATA;
  },
  
  joinGroup: async (groupId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would be a real API call
    // return fetch(`/api/groups/${groupId}/join`, { method: 'POST' });
    
    console.log(`Joining group ${groupId}`);
  },
  
  contactHost: async (groupId: string, message: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Contacting host for group ${groupId}:`, message);
  }
};
