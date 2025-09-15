"use client";
import { SuccessModal } from "@/components/shared/SuccessModal";

interface LoginSuccessProps {
  isOpen: boolean;
}

export default function LoginSuccess({ isOpen }: LoginSuccessProps) {
  return (
    <SuccessModal
      isOpen={isOpen}
      actionType="login"
      autoCloseDuration={0}
    />
  );
}
