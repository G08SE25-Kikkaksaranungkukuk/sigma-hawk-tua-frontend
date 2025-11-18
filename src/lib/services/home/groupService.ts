import { Group, CreateGroupRequest, SearchGroupsParams, GroupData } from '@/lib/types';
import { apiClient } from '@/lib/api';

// Mock API service - replace with actual API calls
class GroupService {
  private apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  async getUserGroups(): Promise<GroupData[]> {
    const response = await apiClient.get<GroupData[], GroupData[]>('/api/v1/group/my/groups', { withCredentials: true });
    console.log("response:", response);
    return response;
  }
}

export const groupService = new GroupService();
