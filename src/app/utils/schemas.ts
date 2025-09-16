import { z } from "zod";

export const signUpSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name is required and must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name is required and must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  birth_date: z
    .string()
    .min(1, "Birth date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid birth date")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // Haven't had birthday this year yet
      }
      
      return age >= 18;
    }, "You must be at least 18 years old"),
  sex: z
    .string()
    .min(1, "Please select your gender")
    .refine((val) => ["male", "female", "other"].includes(val), {
      message: "Please select a valid gender",
    }),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one interest")
    .max(5, "Please select no more than 5 interests"),
  travel_styles: z
    .array(z.string())
    .min(1, "Please select at least one travel style")
    .max(3, "Please select no more than 3 travel styles"),
  phone: z
    .string()
    .min(10, { message: "Phone number must be exactly 10 digits" })
    .max(10, { message: "Phone number must be exactly 10 digits" })
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password is required and must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^\&*\)\(+=._-])/, 
      "Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
  consent: z
    .boolean()
    .refine(val => val === true, "You must agree to the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password is required and must be at least 8 characters")
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;