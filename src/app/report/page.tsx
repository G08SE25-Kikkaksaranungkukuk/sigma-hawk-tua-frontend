"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/user";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowLeft,
    Loader2,
    Shield,
    AlertTriangle,
    Flag,
    Check,
} from "lucide-react";
import { apiClient } from "@/lib/api";

const reportReasons = [
    { id: "HARASSMENT", label: "🚫 Harassment", description: "Bullying, threats, or intimidation" },
    { id: "INAPPROPRIATE_CONTENT", label: "⚠️ Inappropriate Content", description: "Offensive or unsuitable material" },
    { id: "SPAM", label: "📧 Spam", description: "Repetitive or unwanted messages" },
    { id: "FAKE_PROFILE", label: "🎭 Fake Profile", description: "False identity or impersonation" },
    { id: "SCAM", label: "💰 Scam", description: "Fraudulent or deceptive behavior" },
    { id: "VIOLENCE", label: "⚔️ Violence", description: "Threats or promotion of violence" },
    { id: "OTHER", label: "❓ Other", description: "Other violations not listed above" },
];

// Success Modal Component
function ReportSuccess({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            
            <div className="relative z-50 max-w-md w-full mx-auto">
                <div className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-8 h-8 text-green-400" />
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Report Submitted
                    </h2>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Thank you for your report. Our team will review it and take appropriate action if necessary.
                    </p>

                    {/* Loading Animation */}
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    </div>
                    
                    <p className="text-sm text-orange-300 mt-4">
                        Redirecting to home page...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ReportCreatePage() {
    const router = useRouter();
    const [reportId, setReportId] = React.useState<string>("");
    const [userId, setUserId] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("User Harassment Report");
    const [reason, setReason] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("Detailed description of the incident...");
    const [loading, setLoading] = React.useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    
    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser();

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="flex items-center justify-center bg-black min-h-screen">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        );
    }

    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            await apiClient.post(
                "/api/v2/reports",
                {
                    title,
                    reason,
                    description,
                },
                { withCredentials: true }
            );
            
            setShowSuccessModal(true);
            
            // Redirect after delay
            setTimeout(() => {
                router.push("/home");
            }, 2000);
        } catch (error) {
            console.error("Report submission error:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-12 h-12 bg-orange-500/20 rounded-full animate-pulse" />
                <div className="absolute top-60 right-16 w-8 h-8 bg-orange-400/30 rounded-full animate-pulse delay-75" />
                <div className="absolute bottom-40 left-20 w-16 h-16 bg-orange-600/20 rounded-full animate-pulse delay-150" />
                <Shield className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 animate-pulse" />
                <AlertTriangle className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 animate-pulse delay-75" />
                <Flag className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 animate-pulse delay-150" />
            </div>

            <div className="max-w-md mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center mb-6 pt-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/home")}
                        className="mr-3 text-white hover:bg-orange-500/20"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold text-white">
                        Submit Report
                    </h1>
                </div>

                <Card className="shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
                        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Shield className="w-6 h-6" />
                            Report User
                        </CardTitle>
                        <p className="text-black/80">Help us maintain a safe community</p>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form className="space-y-6">
                           
                            {/* Title Input */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Report Title *
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Brief title for the report"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                                    maxLength={100}
                                />
                            </div>

                            {/* Reason Selection */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Reason *
                                </Label>
                                <Select value={reason} onValueChange={(value) => setReason(value)}>
                                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600">
                                        {reportReasons.map((reasonItem) => (
                                            <SelectItem 
                                                key={reasonItem.id} 
                                                value={reasonItem.id}
                                                className="text-white hover:bg-gray-700 focus:bg-gray-700"
                                            >
                                                <div>
                                                    <div className="font-medium">{reasonItem.label}</div>
                                                    <div className="text-sm text-gray-400">{reasonItem.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Description *
                                </Label>
                                <Textarea
                                    placeholder="Please provide details about the incident..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 min-h-[120px] resize-none"
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center">
                                    <div></div>
                                    <span className="text-xs text-gray-400">
                                        {description.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="button"
                                onClick={handleFormSubmit}
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting Report...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Flag className="w-4 h-4" />
                                        Submit Report
                                    </div>
                                )}
                            </Button>

                            {/* Info Note */}
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
                                <p className="text-orange-200 text-sm">
                                    📋 All reports are reviewed by our moderation team. False reports may result in account penalties.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Success Modal */}
            <ReportSuccess isOpen={showSuccessModal} />
        </div>
    );
}