import { useState } from "react";
import { signUpSchema, loginSchema, reportSchema } from "./schemas";

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Zod Validation Function
  const validateSignUpForm = (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    birth_date: string;
    sex: string;
    interests: string[];
    travel_styles: string[];
    consent: boolean;
  }): boolean => {
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      // แปลง Zod errors เป็น error object
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      
      setErrors(newErrors);
      console.log("Validation errors:", newErrors);
      return false;
    }

    // ถ้า validation ผ่าน clear errors
    setErrors({});
    return true;
  };

  const validateLoginForm = (formData: {
    email: string;
    password: string;
  }): boolean => {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      // แปลง Zod errors เป็น error object
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      
      setErrors(newErrors);
      console.log("Validation errors:", newErrors);
      return false;
    }

    // ถ้า validation ผ่าน clear errors
    setErrors({});
    return true;
  };

  // Clear individual error
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  // Helper function to get error message
  const getError = (fieldName: string): string => {
    return errors[fieldName] || "";
  };

  const validateReportForm = (formData: {
    title: string;
    reason: string;
    description: string;
  }): boolean => {
    const result = reportSchema.safeParse(formData);

    if (!result.success) {
      // แปลง Zod errors เป็น error object
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      
      setErrors(newErrors);
      console.log("Report validation errors:", newErrors);
      return false;
    }

    // ถ้า validation ผ่าน clear errors
    setErrors({});
    return true;
  };

  return {
    errors,
    validateSignUpForm,
    validateLoginForm,
    validateReportForm,
    clearError,
    getError,
  };
};
