export interface UserInfo {
  user_id: number;
  first_name: string;
  middle_name: string | null | "";
  last_name: string;
  birth_date: string;               
  sex: "male" | "female" | string; 
  phone: string;
  profile_url: string | null;
  social_credit: number;
  interests: string[];
  travel_styles: string[];
  email: string;
  role: "USER" | "ADMIN" | string;
  iat: number;
  exp: number;
}

export interface GroupInfo {
  id: string;
  title: string;
  destination: string;
  dates: string;
  timezone: string;
  description: string;
  privacy: 'Private' | 'Public';
  maxSize: number;
  currentSize: number;
  pace: string;
  languages: string[];
  interests: string[] | { label: string; emoji: string; color: string }[];
  requirements: string[];
  rules: string[];
  itinerary: { day: string; plan: string }[];
  hostNote: string;
  members: 
    | { id: string; name: string; role: string; avatar: string }[] // Legacy format
    | { user_id: number; first_name: string; last_name: string; email: string }[]; // New Member format
  // Additional GroupData fields
  group_id?: number;
  group_name?: string;
  group_leader_id?: number;
  max_members?: number;
  created_at?: string;
  updated_at?: string;
}