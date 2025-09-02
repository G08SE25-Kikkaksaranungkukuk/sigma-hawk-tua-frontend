"use client";
import { useState } from "react";
import { PopupCard } from "@/components/ui/popup-card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Member {
  id: number;
  name: string;
  isOwner: boolean;
}

interface Props {
  isOpen: boolean;
  members: Member[];
  onTransfer: (id: number) => void;
  onClose: () => void;
}

export default function TransferOwnershipModal({
  isOpen,
  members,
  onTransfer,
  onClose,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
              <PopupCard className="max-w-xl w-full bg-navy-900 border border-orange-500/20 p-8 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-orange-300/70">
                    Transfer Group Ownership
                  </h2>
                  <ul className="space-y-3">
                    {members
                      .filter((m) => !m.isOwner)
                      .map((m) => (
                        <li key={m.id}>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="transfer"
                              checked={selectedId === m.id}
                              onChange={() => setSelectedId(m.id)}
                            />
                            <span className="text-gray-200">{m.name}</span>
                          </label>
                        </li>
                      ))}
                  </ul>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-black px-6"
                    disabled={selectedId === null}
                    onClick={() => selectedId && onTransfer(selectedId)}
                  >
                    Confirm Transfer
                  </Button>
                </div>
              </PopupCard>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}