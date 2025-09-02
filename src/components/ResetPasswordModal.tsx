"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (passwordData: { oldPassword: string; newPassword: string; confirmPassword: string }) => void;
}

export default function ResetPasswordModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: ResetPasswordModalProps) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  };

  const isNewPasswordValid = () => {
    const passwordValidation = validatePassword(formData.newPassword);
    return formData.newPassword && 
           passwordValidation.isValid && 
           formData.newPassword !== formData.oldPassword;
  };

  const isConfirmPasswordValid = () => {
    return formData.confirmPassword && 
           formData.newPassword && 
           formData.confirmPassword === formData.newPassword &&
           isNewPasswordValid();
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        const missingRequirements = [];
        if (!passwordValidation.minLength) missingRequirements.push("at least 8 characters");
        if (!passwordValidation.hasUppercase) missingRequirements.push("1 uppercase letter");
        if (!passwordValidation.hasLowercase) missingRequirements.push("1 lowercase letter");
        if (!passwordValidation.hasNumber) missingRequirements.push("1 number");
        if (!passwordValidation.hasSpecialChar) missingRequirements.push("1 special character");
        
        newErrors.newPassword = `Password must contain: ${missingRequirements.join(", ")}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.oldPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = "New password must be different from old password";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md relative border border-slate-600"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
              <p className="text-gray-400 text-sm">Enter your current password and choose a new one</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Old Password Field */}
              <div>
                <Label htmlFor="oldPassword" className="text-orange-500 text-sm font-medium">
                  Old Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showPasswords.oldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-orange-500 text-white pr-10 focus:border-orange-400 focus:ring-orange-400"
                    placeholder="Enter your old password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <Label htmlFor="newPassword" className={`text-sm font-medium ${
                  isNewPasswordValid() ? 'text-green-400' : 'text-orange-500'
                }`}>
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.newPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-orange-500 text-white pr-10 focus:border-orange-400 focus:ring-orange-400"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-400">Password requirements:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {!validatePassword(formData.newPassword).minLength && (
                        <span className="text-red-400">
                          ✓ At least 8 characters
                        </span>
                      )}
                      {!validatePassword(formData.newPassword).hasUppercase && (
                        <span className="text-red-400">
                          ✓ 1 uppercase letter
                        </span>
                      )}
                      {!validatePassword(formData.newPassword).hasLowercase && (
                        <span className="text-red-400">
                          ✓ 1 lowercase letter
                        </span>
                      )}
                      {!validatePassword(formData.newPassword).hasNumber && (
                        <span className="text-red-400">
                          ✓ 1 number
                        </span>
                      )}
                      {!validatePassword(formData.newPassword).hasSpecialChar && (
                        <span className="text-red-400 col-span-2">
                          ✓ 1 special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                        </span>
                      )}
                      {!(formData.newPassword !== formData.oldPassword && formData.oldPassword) && (
                        <span className="text-red-400 col-span-2">
                          ✓ Different from old password
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {errors.newPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className={`text-sm font-medium ${
                  isConfirmPasswordValid() ? 'text-green-400' : 'text-orange-500'
                }`}>
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-slate-700 border-orange-500 text-white pr-10 focus:border-orange-400 focus:ring-orange-400"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-semibold"
              >
                Confirm Change
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
