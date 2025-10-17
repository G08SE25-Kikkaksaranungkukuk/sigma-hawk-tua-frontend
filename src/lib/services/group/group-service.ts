import { UserData, GroupResponse, CreateGroupRequest, Interest, ItineraryRequest, Itinerary, ItineraryResponse } from "@/lib/types";
import axios, {AxiosResponse} from "axios";
import { apiClient } from "@/lib/api";
import { create } from "domain";
import { get } from "http";

// Group service implementation
export const groupService = {

  async getUserGroups(): Promise<GroupResponse[]> {
    const responseGroup = await apiClient.get<GroupResponse[], GroupResponse[]>('/api/v1/group/my/groups', { withCredentials: true });
    
    // Get detailed information for each group
    const groupDetailsPromises = responseGroup.map(group => 
      this.getGroupDetails(group.group_id.toString())
    );
    
    const groupDetails = await Promise.all(groupDetailsPromises);
    return groupDetails;
  },
  
  getGroupDetails: async (groupId: string): Promise<GroupResponse> => {
    const groupResponse = await apiClient.get<GroupResponse, GroupResponse>(`/api/v1/group/${groupId}`, { withCredentials: true });
    return groupResponse;
  },

  getGroupProfile: async (groupId: string): Promise<{ data: any | Blob }> => {
    const response = await apiClient.get(`/api/v1/group/${groupId}/profile`, { 
      responseType: 'blob' // Handle both JSON and binary responses
    });
    return response;
  },
  
  getCurrentUser: async (): Promise<UserData> => {
    const response = await apiClient.get<UserData, UserData>(`/api/v1/auth/whoami`, { withCredentials: true });
    return response;
  },

  leaveGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/group/${groupId}/leave`, {
      withCredentials: true,
    });
  },
  
  joinGroup: async (groupId: string): Promise<void> => {
    await apiClient.put(`/api/v1/group/${groupId}/member`, {}, { withCredentials: true });
  },

  getInterests: async (): Promise<Interest[]> => {
    try {
      const response = await apiClient.get<Interest[], Interest[]>('/api/v1/user/interests/all');
      return response
    } catch (error) {
      console.error('Failed to fetch interests from API:', error);
      return [];
    }
  },
  
  createGroup: async (createGroupRequest: CreateGroupRequest): Promise<GroupResponse> => {
    // Create FormData to handle file upload
    const formData = new FormData();
    
    // Append text fields
    formData.append('group_name', createGroupRequest.group_name);
    if (createGroupRequest.description) {
      formData.append('description', createGroupRequest.description);
    }
    if (createGroupRequest.max_members) {
      formData.append('max_members', createGroupRequest.max_members.toString());
    }
    
    // Append interest fields as JSON string or individual entries
    if (createGroupRequest.interest_fields && createGroupRequest.interest_fields.length > 0) {
      createGroupRequest.interest_fields.forEach((interest, index) => {
        formData.append(`interest_fields[${index}]`, interest);
      });
    }
    
    // Append file if provided
    if (createGroupRequest.profile) {
      formData.append('profile', createGroupRequest.profile);
    }
    
    const response = await apiClient.post<GroupResponse, GroupResponse>('/api/v1/group', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  getMemberProfile: async (userEmail: string): Promise<{ data: any | Blob }> => {
    const response = await apiClient.get(`/api/v1/user/${userEmail}/profile_pic`, { responseType: 'blob' });
    return response;
  },
  
  contactHost: async (groupId: string, message: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Contacting host for group ${groupId}:`, message);
  },

  removeMember: async (groupId: string, userId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/group/${groupId}/member`, {
      data: { user_id: userId },
      withCredentials: true
    });
  },

  transferOwnership: async (groupId: string, userId: number): Promise<void> => {
    await apiClient.patch(`/api/v1/group/${groupId}/owner`, {
      user_id: userId
    }, {
      withCredentials: true
    });
  },

  updateGroup: async (groupId: string, updateData: FormData): Promise<GroupResponse> => {
    const response = await apiClient.patch<GroupResponse, GroupResponse>(
      `/api/v1/group/${groupId}`,
      updateData,
      {
        withCredentials: true
      }
    );
    return response;
  },

  getItineraries: async (groupId: string): Promise<ItineraryResponse[]> => {
    const response = await apiClient.get<ItineraryResponse[], ItineraryResponse[]>(`/api/v2/groups/${groupId}/itineraries`, {
      withCredentials: true,
    });
    return response;
  },

  updateItinerary: async (groupId: string, itinerary: ItineraryResponse): Promise<ItineraryResponse> => {
    const response = await apiClient.patch<ItineraryResponse, ItineraryResponse>(`/api/v2/groups/${groupId}/itineraries/${itinerary.itinerary_id}`, itinerary, {
      withCredentials: true,
    });
    return response;
  },

  createItinerary: async (createItineraryRequest: ItineraryRequest): Promise<ItineraryResponse> => {
    const response = await apiClient.post<ItineraryResponse, ItineraryResponse>(`/api/v2/itineraries`, createItineraryRequest, {
      withCredentials: true,
    });
    return response;
  },

  assignItineraryToGroup: async (groupId: string, itinerary_id: number): Promise<void> => {
    await apiClient.post(`/api/v2/groups/${groupId}/itineraries/assign`, { itinerary_id: itinerary_id }, {
      withCredentials: true,
    });
  },

  deleteItinerary: async (groupId: string, itineraryId: number): Promise<void> => {
    await apiClient.delete(`/api/v2/groups/${groupId}/itineraries/${itineraryId}`, {
      withCredentials: true,
    });
  }
};
