"use client";
import { PopupCard } from "@/components/ui/popup-card";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface LoginSuccessProps {
  isOpen: boolean;
}

export default function LoginSuccess({ isOpen }: LoginSuccessProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="min-h-screen bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.6 }}
            >
              <PopupCard className="max-w-md w-full bg-gray-900/95 border-2 border-orange-500/30 p-6 text-white">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                      Login Successful!
                    </h2>
                    <p className="text-gray-300">
                      Welcome back! Redirecting you to the home page...
                    </p>
                  </div>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
