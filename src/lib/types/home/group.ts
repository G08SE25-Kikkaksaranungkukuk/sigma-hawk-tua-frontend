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
  title: string;
  description: string;
  destination?: string;
  imageUrl?: string;
}

export interface SearchGroupsParams {
  query?: string;
  destination?: string;
  limit?: number;
  offset?: number;
}
