import { z } from "zod";

// ให้ตรงกับโครงสร้างใน page.tsx (เช่นชื่อ state, field, และ array)
export const signUpSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be less than 50 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be less than 50 characters"),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid birth date (YYYY-MM-DD)"),
  sex: z.string().refine((val) => ["male", "female", "other"].includes(val), {
    message: "Please select a gender",
  }),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  travel_styles: z.array(z.string()).min(1, "Please select at least one travel style"),
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

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;