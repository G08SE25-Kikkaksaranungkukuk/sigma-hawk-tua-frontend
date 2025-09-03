"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "../../components/schemas";

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

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: (data: SignUpFormData) => void;
}

/** UI choices (ชื่อ array เปลี่ยนเป็น interestsList กันชนกับ state) */
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
  const [open, setOpen] = useState(false);

  // local UI state
  
  
  const [interestsError, setInterestsError] = useState("");
  const [travelStylesError, setTravelStylesError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [sexError, setSexError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // extra fields not in RHF schema (ถ้าสคีมาของคุณมี ก็ปรับไปใช้ register ได้)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState(""); // string "1995-05-15"
  const [sex, setSex] = useState<"" | "male" | "female" | "other">("");
  
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);



 const toggleInterest = (id: string) => {
  setSelectedInterests(prev => {
    const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
    if (next.length > 0) setInterestsError("");
    return next;
  });
};

  const toggleTravelStyle = (id: string) => {
  setSelectedTravelStyles(prev => {
    const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
    if (next.length > 0) setTravelStylesError("");
    return next;
  });
};

  /** เรียก backend ตอน submit */
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      setLoading(true);

      // สร้าง data สำหรับ validate ตาม schema
      const data = {
        first_name: firstName,
        last_name: lastName,
        birth_date: date ? date.toISOString().slice(0, 10) : "",
        sex,
        interests: selectedInterests,
        travel_styles: selectedTravelStyles,
        phone,
        email,
        password,
        confirmPassword,
        consent,
        };

      // validate ด้วย zod
      const result = signUpSchema.safeParse(data);

      if (!result.success) {
        // รวม error message ทุกฟิลด์
        const errorList = result.error.issues.map(e => e.message);
        alert("❌ Validation error:\n" + errorList.join("\n"));
        // สามารถ set error state เพื่อแสดง error ใน UI ได้ตามต้องการ
        return;
      }

      // payload ตามตัวอย่างที่ให้มา
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        birth_date: date ? date.toISOString().slice(0, 10) : "", // ส่งเป็น "YYYY-MM-DD"
        sex,
        interests: selectedInterests|| "",
        travel_styles: selectedTravelStyles,
      };

      const res = await axios.post("http://localhost:8080/auth/register", payload);
      alert("✅ User created: " + JSON.stringify(res.data));
      
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Unknown error";
      alert("❌ Error: " + msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes">
      {/* decorations */}
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
          <a href="/">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 p-2 hover:bg-orange-500/10 rounded-full text-orange-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </a>
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
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your first name"
                />
                {firstNameError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {firstNameError}</p>
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
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your last name"
                />
                {lastNameError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {lastNameError}</p>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-orange-300 font-semibold">
                  🎂 Birth Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      type="button"
                      className="h-12 justify-between w-full border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-gray-200"
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
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {birthDateError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {birthDateError}</p>
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
                </div>
                {sexError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {sexError}</p>
                )}

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

                  {interestsError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {interestsError}</p>
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
                {travelStylesError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {travelStylesError}</p>
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
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl 
                              bg-gray-800/50 text-white placeholder:text-gray-400"
                    placeholder="Enter your phone number"
                  />
                  {phoneError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {phoneError}</p>
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl 
                              bg-gray-800/50 text-white placeholder:text-gray-400"
                    placeholder="Enter your email address"
                  />
                  {emailError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {emailError}</p>
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl 
                              bg-gray-800/50 text-white placeholder:text-gray-400"
                    placeholder="Create a strong password"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {passwordError}</p>
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Confirm your password"
                />
                {confirmPasswordError && (
                  <p className="text-sm text-red-400 flex items-center gap-1">⚠️ {confirmPasswordError}</p>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-3 bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(!!checked)}
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
              

              {/* You can add your own consent error handling here if needed */}
              <Button
                type="submit"
                disabled={loading}
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
                    <div className="text-orange-200 text-sm max-h-64 overflow-y-auto whitespace-pre-line">{termsOfService}</div>
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
                    <div className="text-orange-200 text-sm max-h-64 overflow-y-auto whitespace-pre-line">{privacyPolicy}</div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
