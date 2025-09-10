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
  interest_fields: string[];
}

export interface SearchGroupsParams {
  query?: string;
  destination?: string;
  limit?: number;
  offset?: number;
}

export interface GroupData {
  group_id: number
  group_name: string
  group_leader_id: number
  interest_fields: string[]
  members: Member[]
}

export interface Member {
  user_id: number
  first_name: string
  middle_name: any
  last_name: string
  sex: string
  profile_url: any
  interests: string[]
  travel_styles: string[]
  isOwner? : boolean
}