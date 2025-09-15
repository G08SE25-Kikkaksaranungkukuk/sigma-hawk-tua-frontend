"use client";
import { SuccessModal } from "@/components/shared/SuccessModal";

interface SignupSuccessProps {
  isOpen: boolean;
}

export default function SignupSuccess({ isOpen }: SignupSuccessProps) {
  return (
    <SuccessModal
      isOpen={isOpen}
      actionType="signup"
      autoCloseDuration={0}
    />
  );
}
