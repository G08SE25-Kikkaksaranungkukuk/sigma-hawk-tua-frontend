"use client"

import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/lib/hooks/user"
import React from "react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ArrowLeft,
    Loader2,
    Shield,
    AlertTriangle,
    Flag,
    Check,
} from "lucide-react"
import { apiClient } from "@/lib/api"

// Report Schema
const reportSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    reason: z.string().min(1, "Please select a reason"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be less than 500 characters"),
})

type ReportSchema = z.infer<typeof reportSchema>

const reportReasons = [
    {
        id: "BUG",
        label: "� Bug/Error",
        description: "Application crashes, errors, or unexpected behavior",
    },
    {
        id: "PERFORMANCE",
        label: "⚡ Performance Issue",
        description: "Slow loading, lag, or system performance problems",
    },
    {
        id: "UI_UX",
        label: "🎨 UI/UX Problem",
        description: "Design issues, layout problems, or usability concerns",
    },
    {
        id: "DATA_LOSS",
        label: "💾 Data Loss",
        description: "Missing data, sync issues, or data corruption",
    },
    {
        id: "LOGIN_AUTH",
        label: "� Login/Authentication",
        description: "Cannot login, logout issues, or authentication problems",
    },
    {
        id: "NETWORK",
        label: "📡 Network/Connectivity",
        description: "Connection errors, timeout, or network-related issues",
    },
    {
        id: "FEATURE_REQUEST",
        label: "✨ Feature Request",
        description: "Suggestions for new features or improvements",
    },
    {
        id: "OTHER",
        label: "❓ Other",
        description: "Other technical issues not listed above",
    },
]

// Success Modal Component
function ReportSuccess({ isOpen }: { isOpen: boolean }) {
    if (!isOpen) return null

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
                        Thank you for your report. Our team will review it and
                        take appropriate action if necessary.
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
    )
}

export default function ReportCreatePage() {
    const router = useRouter()
    const [formData, setFormData] = useState<ReportSchema>({
        title: "",
        reason: "",
        description: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const {
        currentUser,
        loading: userLoading,
        error: userError,
    } = useCurrentUser()

    // Show loading state while fetching user data
    if (userLoading) {
        return (
            <div className="flex items-center justify-center bg-black min-h-screen">
                <div className="text-orange-400 text-lg">Loading...</div>
            </div>
        )
    }

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Validate the form data
            reportSchema.parse(formData)
            console.log("Form submitted:", formData)
            setErrors({})

            // Submit to API
            setLoading(true)
            await apiClient.post(
                "/api/v2/reports",
                {
                    title: formData.title,
                    reason: formData.reason,
                    description: formData.description,
                },
                { withCredentials: true }
            )

            setShowSuccessModal(true)

            // Redirect after delay
            setTimeout(() => {
                router.push("/home")
            }, 2000)
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errorMessages: Record<string, string> = {}
                err.issues.forEach((error) => {
                    const field = error.path[0] as string
                    errorMessages[field] = error.message
                })
                setErrors(errorMessages)
            } else {
                console.error("Report submission error:", err)
                alert("Failed to submit report. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

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
                        <p className="text-black/80">
                            Help us maintain a safe community
                        </p>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Report Title *
                                </Label>
                                <Input
                                    name="title"
                                    type="text"
                                    placeholder="Brief title for the report"
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange("title", e.target.value)
                                    }
                                    className={`bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 ${
                                        errors.title ? "border-red-500" : ""
                                    }`}
                                    maxLength={100}
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Reason Selection */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Reason *
                                </Label>
                                <Select
                                    value={formData.reason}
                                    onValueChange={(value) =>
                                        handleChange("reason", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`pb-7 pt-7 bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20 ${
                                            errors.reason
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    >
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
                                                    <div className="font-medium text-left">
                                                        {reasonItem.label}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {reasonItem.description}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.reason && (
                                    <p className="text-red-400 text-sm flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.reason}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-orange-300 font-medium">
                                    Description *
                                </Label>
                                <Textarea
                                    name="description"
                                    placeholder="Please provide details about the incident..."
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className={`bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 min-h-[120px] resize-none ${
                                        errors.description
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.description ? (
                                        <p className="text-red-400 text-sm flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors.description}
                                        </p>
                                    ) : (
                                        <div></div>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        {formData.description.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
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
                                    📋 All reports are reviewed by our
                                    moderation team. False reports may result in
                                    account penalties.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Success Modal */}
            <ReportSuccess isOpen={showSuccessModal} />
        </div>
    )
}
