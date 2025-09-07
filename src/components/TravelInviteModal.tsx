"use client";
import { useState } from "react";
import { PopupCard } from "./ui/popup-card"; // Made new UI in ./ui
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TravelInviteModalProps {
  isOpen: boolean;
  inviteLink : string;
  onClose: () => void;
}

export default function TravelInviteModal({ isOpen, onClose , inviteLink }: TravelInviteModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

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
              <PopupCard className="max-w-2xl w-full bg-navy-900 border border-orange-500/20 p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-6">
                  <h1 className="text-3xl font-bold text-orange-300/70">
                    Invite your fellow travelers now!
                  </h1>

                  <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-2xl border-4 border-orange-500/40">
                    <div className="flex-1 px-4 py-2 text-gray-400 text-left truncate">
                      {inviteLink}
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      className={`px-6 py-2 rounded-2 font-semibold transition-all ${
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-black"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  {/* Still deciding if invite link should expire or not, so this is a placeholder text for it. */}
                  <p className="text-gray-400">Your invite link expires in 3 days.</p>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
