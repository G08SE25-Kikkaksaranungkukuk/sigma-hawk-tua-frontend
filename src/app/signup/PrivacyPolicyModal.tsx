import React from "react";
import { X } from "lucide-react";
import { privacyPolicy } from "./privacyPolicy";

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}


import { useRef, useState, useEffect } from "react";

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps & { onScrolledToBottom: () => void; scrolledToBottom: boolean }> = ({ isOpen, onClose, onScrolledToBottom, scrolledToBottom }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        setHasScrolled(false);
    }, [isOpen]);

    const handleScroll = () => {
        const el = contentRef.current;
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            if (!hasScrolled) {
                setHasScrolled(true);
                onScrolledToBottom();
            }
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 max-w-lg w-full relative shadow-2xl">
                <button
                    className="absolute top-3 right-3 text-orange-400 hover:text-orange-600"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-orange-400 mb-2">
                    Privacy Policy (PDPA)
                </h2>
                <div
                    ref={contentRef}
                    className="text-orange-200 text-sm max-h-64 overflow-y-auto whitespace-pre-line"
                    onScroll={handleScroll}
                >
                    {privacyPolicy}
                </div>
                {!scrolledToBottom && (
                    <div className="text-xs text-orange-400 mt-2 text-center">Scroll to the bottom to enable agreement</div>
                )}
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;
