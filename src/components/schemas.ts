import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  middleName: z.string().max(50, "Middle name must be less than 50 characters").optional(),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Age must be realistic"),
  gender: z.string().refine((val) => ["male", "female", "other"].includes(val), {
    message: "Please select a gender",
  }),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  travelStyle: z.array(z.string()).min(1, "Please select at least one travel style"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
  consent: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

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


export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;