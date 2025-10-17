import { Interest } from "./interest"

export interface SearchGroupsParams {
  query?: string;
  destination?: string;
  limit?: number;
  offset?: number;
}

export interface CreateGroupRequest {
  group_name: string;
  description: string;
  destination: string;
  max_members: number;
  profile?: File;
  profile_url?: string;  // For preview purposes
  start_date?: Date; 
  end_date?: Date;    
  interest_fields: string[];  // Use the specific enum type
}

export interface UpdateGroupRequest {
  group_name: string;
  description?: string;
  max_members: number;
  profile?: File;
  interest_fields: string[];
}

export interface ItineraryRequest {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  place_links: string[];
}

export interface Itinerary {
  itinerary_id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  place_links: string[];
}

// Alias for backwards compatibility
export type ItineraryResponse = Itinerary;

export interface Place {
  place_id: number;
  name: string;
  description?: string;
  place_type?: string;
  latitude?: number;
  longitude?: number;
  picture_url?: string;
  phone_num?: string;
  social_media?: string;
  address?: string;
  rating?: number;
}

export interface GroupResponse {
  group_id: number
  group_name: string
  group_leader_id: number
  description: string
  profile_url?: string | null
  max_members: number
  created_at: string
  updated_at: string
  leader: Member
  members: Member[]
  interests: Interest[]
}

export interface Member {
  user_id: number
  first_name: string
  last_name: string
  profile_url?: string | null
  email: string
  birth_date?: Date
}