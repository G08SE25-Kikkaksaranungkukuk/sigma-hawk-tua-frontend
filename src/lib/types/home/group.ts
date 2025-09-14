// Backend validation enum values

export interface Group {
  id: string;
  title: string;
  description: string;
  memberCount: number;
  destination?: string;
  imageUrl?: string;
  isJoined?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGroupRequest {
  group_name: string;
  description?: string;
  destination?: string;
  max_members?: number;
  profile?: File;
  profile_url?: string;  // For preview purposes
  start_date?: Date; 
  end_date?: Date;    
  interest_fields?: string[];  // Use the specific enum type
}

export interface SearchGroupsParams {
  query?: string;
  destination?: string;
  limit?: number;
  offset?: number;
}

export interface GroupResponse {
  group_id: number
  group_name: string
  group_leader_id: number
  description: string
  max_members: number
  created_at: string
  updated_at: string
}

export interface GroupData {
  group_id: number
  group_name: string
  group_leader_id: number
  interests: Interest[]
  description: string
  members: Member[]
  max_members: number
  created_at: string
  updated_at: string
}

export interface Interest {
  key: string  
  label: string
  emoji: string
  color: string
}

export interface Member {
  user_id: number
  first_name: string
  last_name: string
  email: string
  birth_date?: Date
}