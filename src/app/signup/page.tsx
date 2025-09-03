"use client";
import React, { useState } from "react";
import { signUpSchema, type SignUpFormData } from "../utils/schemas";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Loader2, Sparkles, Users, MapPin, X, ChevronDown } from "lucide-react";
import { termsOfService } from "./termsOfService";
import { privacyPolicy } from "./privacyPolicy";
import axios from "axios";
import { useFormValidation } from "../utils/validation";

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: (data: any) => void;
}

const interestsList = [
  { id: "SEA", label: "🌊 Sea", color: "bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30" },
  { id: "MOUNTAIN", label: "⛰️ Mountain", color: "bg-orange-600/20 border-orange-600/50 text-orange-300 hover:bg-orange-600/30" },
  { id: "NATURE", label: "🌿 Nature", color: "bg-orange-400/20 border-orange-400/50 text-orange-300 hover:bg-orange-400/30" },
  { id: "ADVENTURE", label: "🏔️ Adventure", color: "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30" },
  { id: "BEACH", label: "🏖️ Beach", color: "bg-orange-300/20 border-orange-300/50 text-orange-300 hover:bg-orange-300/30" },
  { id: "CITY", label: "🏙️ City", color: "bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30" },
];

const travelStyles = [
  { id: "BUDGET", label: "💰 Budget", color: "text-orange-400" },
  { id: "COMFORT", label: "🛏️ Comfort", color: "text-orange-300" },
  { id: "LUXURY", label: "💎 Luxury", color: "text-orange-500" },
  { id: "BACKPACK", label: "🎒 Backpack", color: "text-orange-400" },
];

export default function SignUpScreen({ onBack, onSignUp }: SignUpScreenProps) {
  // Validation Hook
  const { validateForm, clearError, getError } = useFormValidation();

  // UI States
  const [open, setOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [sex, setSex] = useState<"" | "male" | "female" | "other">("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  // Toggle functions
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      // Clear error เมื่อมีการเลือกแล้ว
      if (next.length > 0) {
        clearError("interests");
      }
      return next;
    });
  };

  const toggleTravelStyle = (id: string) => {
    setSelectedTravelStyles(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      // Clear error เมื่อมีการเลือกแล้ว
      if (next.length > 0) {
        clearError("travel_styles");
      }
      return next;
    });
  };

  // Submit Handler
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // สร้าง form data object สำหรับ validation
    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      phone: phone,
      birth_date: date ? date.toISOString().slice(0, 10) : "",
      sex: sex,
      interests: selectedInterests,
      travel_styles: selectedTravelStyles,
      consent: consent,
    };

    // Validate ด้วย Zod ก่อน submit
    if (!validateForm(formData)) {
      return;
    }

    try {
      setLoading(true);

      // เตรียม payload สำหรับ backend
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password: password,
        phone: phone.replace(/[-\s]/g, ""), // ลบช่องว่างและ dash
        birth_date: date ? date.toISOString().slice(0, 10) : "",
        sex: sex,
        interests: selectedInterests,
        travel_styles: selectedTravelStyles,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post("http://localhost:8080/auth/register", payload);
      
      console.log("Response:", response.data);
      // เรียก callback function
      onSignUp(response.data);

    } catch (err: any) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes">
      {/* Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-12 h-12 bg-orange-500/20 rounded-full float" />
        <div className="absolute top-60 right-16 w-8 h-8 bg-orange-400/30 rounded-full float-delayed" />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-orange-600/20 rounded-full float-delayed-2" />
        <Sparkles className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 float" />
        <Users className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 float-delayed" />
        <MapPin className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 float-delayed-2" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4 slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 p-2 hover:bg-orange-500/10 rounded-full text-orange-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Create Account</h1>
        </div>

        <Card className="card-hover shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm bounce-in">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Join TravelMatch!</CardTitle>
            <p className="text-black/80 text-center pb-2">Start your adventure today</p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={createUser} className="space-y-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-orange-300 font-semibold">
                  👤 First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError("first_name");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("first_name") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Enter your first name"
                />
                {getError("first_name") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("first_name")}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-orange-300 font-semibold">
                  👥 Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError("last_name");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("last_name") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Enter your last name"
                />
                {getError("last_name") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("last_name")}
                  </p>
                )}
              </div>

          

              {/* Birth Date */}
              <div className="space-y-2">
                <Label className="text-orange-300 font-semibold">🎂 Birth Date</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={`h-12 justify-between w-full border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-gray-200 ${
                        getError("birth_date") ? "border-red-500" : "border-orange-500/30"
                      }`}
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDown />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date ?? undefined}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        setDate(d ?? null);
                        setOpen(false);
                        clearError("birth_date");
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {getError("birth_date") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("birth_date")}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label className="text-orange-300 font-semibold">⚡ Gender</Label>
                <div className="flex gap-2">
                  {[
                    { value: "male", label: "👨 Male", color: "from-orange-500 to-orange-600" },
                    { value: "female", label: "👩 Female", color: "from-orange-400 to-orange-500" },
                    { value: "other", label: "🌟 Other", color: "from-orange-600 to-orange-700" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => {
                        setSex(g.value as "male" | "female" | "other");
                        clearError("sex");
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all chip-bounce ${
                        sex === g.value
                          ? `bg-gradient-to-r ${g.color} text-black border-transparent shadow-lg orange-glow`
                          : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                {getError("sex") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("sex")}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-orange-300 font-semibold">🎯 Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${
                        selectedInterests.includes(interest.id)
                          ? `${interest.color} shadow-md scale-105 orange-glow`
                          : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500"
                      }`}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
                {getError("interests") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("interests")}
                  </p>
                )}
              </div>

              {/* Travel Style */}
              <div className="space-y-3">
                <Label className="text-orange-300 font-semibold">🎨 Travel Style</Label>
                <div className="space-y-3 bg-gray-800/30 p-4 rounded-xl border border-orange-500/20">
                  {travelStyles.map((style) => (
                    <div key={style.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={style.id}
                        checked={selectedTravelStyles.includes(style.id)}
                        onCheckedChange={() => toggleTravelStyle(style.id)}
                        className="border-2 border-orange-500/50"
                      />
                      <Label htmlFor={style.id} className={`text-sm font-medium ${style.color}`}>
                        {style.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {getError("travel_styles") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("travel_styles")}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-orange-300 font-semibold">
                  📱 Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("phone") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Enter your phone number"
                />
                {getError("phone") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("phone")}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-300 font-semibold">
                  📧 Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("email") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Enter your email address"
                />
                {getError("email") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("email")}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-300 font-semibold">
                  🔒 Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("password") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Create a strong password"
                />
                {getError("password") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("password")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-orange-300 font-semibold">
                  🔐 Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  className={`h-12 border-2 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400 ${
                    getError("confirmPassword") ? "border-red-500" : "border-orange-500/30"
                  }`}
                  placeholder="Confirm your password"
                />
                {getError("confirmPassword") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("confirmPassword")}
                  </p>
                )}
              </div>

              {/* Consent */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3 bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => {
                      setConsent(!!checked);
                      clearError("consent");
                    }}
                    className="mt-1 border-2 border-orange-500/50"
                  />
                  <div className="text-sm leading-relaxed text-orange-200">
                    ✅ I agree to the{" "}
                    <span className="text-orange-400 font-semibold cursor-pointer underline" onClick={() => setShowTermsModal(true)}>
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-orange-400 font-semibold cursor-pointer underline" onClick={() => setShowPrivacyModal(true)}>
                      Privacy Policy
                    </span>{" "}
                    (PDPA)
                  </div>
                </div>
                {getError("consent") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("consent")}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !consent}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black rounded-xl font-semibold text-lg shadow-xl btn-hover-lift border-0 orange-glow"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Adventure...
                  </>
                ) : (
                  <>🚀 Create My Account</>
                )}
              </Button>
            </form>

            {/* Terms Modal */}
            {showTermsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 max-w-lg w-full relative shadow-2xl">
                  <button
                    className="absolute top-3 right-3 text-orange-400 hover:text-orange-600"
                    onClick={() => setShowTermsModal(false)}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold text-orange-400 mb-2">Terms of Service</h2>
                  <div className="text-orange-200 text-sm max-h-64 overflow-y-auto whitespace-pre-line">
                    {termsOfService}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Modal */}
            {showPrivacyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 max-w-lg w-full relative shadow-2xl">
                  <button
                    className="absolute top-3 right-3 text-orange-400 hover:text-orange-600"
                    onClick={() => setShowPrivacyModal(false)}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-bold text-orange-400 mb-2">Privacy Policy (PDPA)</h2>
                  <div className="text-orange-200 text-sm max-h-64 overflow-y-auto whitespace-pre-line">
                    {privacyPolicy}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}