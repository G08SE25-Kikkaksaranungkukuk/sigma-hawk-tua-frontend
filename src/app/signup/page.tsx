"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "../../components/schemas";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Loader2, Sparkles, Users, MapPin } from "lucide-react";

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: (data: SignUpFormData) => void;
}

const interests = [
  { id: "nature", label: "🌿 Nature", color: "bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30" },
  { id: "food", label: "🍜 Food", color: "bg-orange-600/20 border-orange-600/50 text-orange-300 hover:bg-orange-600/30" },
  { id: "culture", label: "🏛️ Culture", color: "bg-orange-400/20 border-orange-400/50 text-orange-300 hover:bg-orange-400/30" },
  { id: "adventure", label: "🏔️ Adventure", color: "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30" },
  { id: "beach", label: "🏖️ Beach", color: "bg-orange-300/20 border-orange-300/50 text-orange-300 hover:bg-orange-300/30" },
  { id: "city", label: "🏙️ City", color: "bg-gray-500/20 border-gray-500/50 text-gray-300 hover:bg-gray-500/30" },
];

const travelStyles = [
  { id: "budget", label: "💰 Budget", color: "text-orange-400" },
  { id: "comfort", label: "🛏️ Comfort", color: "text-orange-300" },
  { id: "luxury", label: "💎 Luxury", color: "text-orange-500" },
  { id: "backpack", label: "🎒 Backpack", color: "text-orange-400" },
];

export default function SignUpScreen({ onBack, onSignUp }: SignUpScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      interests: [],
      travelStyle: [],
      consent: false,
    },
  });

  const watchGender = watch("gender");

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onSignUp(data);
  };

  const toggleInterest = (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];

    setSelectedInterests(newInterests);
    setValue("interests", newInterests, { shouldValidate: true });
  };

  const toggleTravelStyle = (styleId: string) => {
    const newStyles = selectedTravelStyles.includes(styleId)
      ? selectedTravelStyles.filter(id => id !== styleId)
      : [...selectedTravelStyles, styleId];

    setSelectedTravelStyles(newStyles);
    setValue("travelStyle", newStyles, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-12 h-12 bg-orange-500/20 rounded-full float"></div>
        <div className="absolute top-60 right-16 w-8 h-8 bg-orange-400/30 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-orange-600/20 rounded-full float-delayed-2"></div>
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
            <CardTitle className="text-2xl font-bold">Join TravelMatch! ✨</CardTitle>
            <p className="text-black/80">Start your adventure today</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-orange-300 font-semibold">👤 Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.name.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-orange-300 font-semibold">🎂 Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
                {errors.age && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.age.message}
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
                    { value: "other", label: "🌟 Other", color: "from-orange-600 to-orange-700" }
                  ].map((gender) => (
                    <button
                      key={gender.value}
                      type="button"
                      onClick={() => setValue("gender", gender.value as any, { shouldValidate: true })}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all chip-bounce ${watchGender === gender.value
                          ? `bg-gradient-to-r ${gender.color} text-black border-transparent shadow-lg orange-glow`
                          : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10"
                        }`}
                    >
                      {gender.label}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-orange-300 font-semibold">🎯 Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-3 py-2 rounded-full border-2 text-sm font-medium transition-all chip-bounce ${selectedInterests.includes(interest.id)
                          ? `${interest.color} shadow-md scale-105 orange-glow`
                          : "bg-gray-800/50 text-orange-300 border-orange-500/30 hover:border-orange-500"
                        }`}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.interests.message}
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
                {errors.travelStyle && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.travelStyle.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-orange-300 font-semibold">📱 Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-300 font-semibold">📧 Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-300 font-semibold">🔒 Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-orange-300 font-semibold">🔐 Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-3 bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                <Checkbox
                  id="consent"
                  checked={watch("consent")}
                  onCheckedChange={(checked) => setValue("consent", !!checked, { shouldValidate: true })}
                  className="mt-1 border-2 border-orange-500/50"
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-orange-200">
                  ✅ I agree to the <span className="text-orange-400 font-semibold">Terms of Service</span> and <span className="text-orange-400 font-semibold">Privacy Policy</span> (PDPA)
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  ⚠️ {errors.consent.message}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black rounded-xl font-semibold text-lg shadow-xl btn-hover-lift border-0 orange-glow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Adventure...
                  </>
                ) : (
                  <>
                    🚀 Create My Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}