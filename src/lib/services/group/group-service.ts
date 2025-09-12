import { GroupData, UserData, GroupResponse, CreateGroupRequest, Interest } from "@/lib/types";
import {AxiosResponse} from "axios";
import { apiClient } from "@/lib/api";

// Sample data for development - move to API/database in production
export const SAMPLE_GROUP_DATA = {
  id: "g1",
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

// Group service implementation
export const groupService = {

  async getUserGroups(): Promise<GroupData[]> {
    const responseGroup = await apiClient.get<GroupResponse[], GroupResponse[]>('group/my/groups', { withCredentials: true });
    
    // Get detailed information for each group
    const groupDetailsPromises = responseGroup.map(group => 
      this.getGroupDetails(group.group_id.toString())
    );
    
    const groupDetails = await Promise.all(groupDetailsPromises);
    return groupDetails;
  },
  
  getGroupDetails: async (groupId: string): Promise<GroupData> => {
    const groupResponse = await apiClient.get<GroupData, GroupData>(`/group/${groupId}`, { withCredentials: true });
    return groupResponse;
  },
  
  getCurrentUser: async (): Promise<UserData> => {
    const response = await apiClient.get<UserData, UserData>(`/auth/whoami`, { withCredentials: true });
    return response;
  },
  
  joinGroup: async (groupId: string): Promise<void> => {
    await apiClient.put(`/group/${groupId}/member`, {}, { withCredentials: true });
  },

  getInterests: async (): Promise<Interest[]> => {
    try {
      const response = await apiClient.get<Interest[], Interest[]>('/user/interests/all');
      return response
    } catch (error) {
      console.error('Failed to fetch interests from API:', error);
      return [];
    }
  },
  
  createGroup: async (createGroupRequest: CreateGroupRequest): Promise<GroupData> => {
    const response = await apiClient.post<GroupData, GroupData>('/group', createGroupRequest, {
      withCredentials: true
    });
    return response;
  },
  
  contactHost: async (groupId: string, message: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Contacting host for group ${groupId}:`, message);
  }
};
