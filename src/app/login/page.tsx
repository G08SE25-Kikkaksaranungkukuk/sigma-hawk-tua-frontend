"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../utils/schemas";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LoginSuccess from "./loginSuccess";
import { ArrowLeft, Loader2, Lock, Mail, Heart, Sparkles } from "lucide-react";
import axios from "axios";
import "aos/dist/aos.css";
import { useFormValidation } from "../utils/validation";
import { useEffect } from "react";
import AOS from "aos";

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (data: LoginFormData) => void;
  onForgotPassword: () => void;
}



export default function LoginScreen({ onBack, onLogin, onForgotPassword }: LoginScreenProps) {
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  // Error States
  const [errorMsg, setErrorMsg] = useState("");
  // UI States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Validation Hook
  const { validateLoginForm, clearError, getError } = useFormValidation();
  const router = useRouter();
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    AOS.init(); // เริ่มต้นการทำงานของ AOS
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onLogin(data);
  };

  // Submit Handler
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // สร้าง form data object สำหรับ validation
    const formData = {
      email: email,
      password: password,
    };

    // Validate ด้วย Zod ก่อน submit
    if (!validateLoginForm(formData)) {
      return;
    }

    try {
      setIsLoading(true);

      // เตรียม payload สำหรับ backend
      const payload = {
        email: email.trim(),
        password: password,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post("/api/auth/login", payload);

      console.log("Login successful:", response.data);
      
      // Show success popup
      setShowSuccessModal(true);

      // Redirect after delay
      setTimeout(() => {
        router.push("/home");
      }, 2000);

    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setErrorMsg("Invalid email or password. Please try again.");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes" >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-14 h-14 bg-orange-500/20 rounded-full float"></div>
        <div className="absolute top-60 right-16 w-10 h-10 bg-orange-400/30 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-18 h-18 bg-orange-600/20 rounded-full float-delayed-2"></div>
        <Heart className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 float" />
        <Sparkles className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 float-delayed" />
        <Lock className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 float-delayed-2" />
      </div>

      <div className="max-w-md mx-auto relative z-10" data-aos="zoom-in-up">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4 slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 p-2 hover:bg-orange-500/10 rounded-full text-orange-400"
          >
            <a href="/"><ArrowLeft className="w-5 h-5" /></a>
          </Button>
          <h1 className="text-xl font-semibold text-white">Welcome Back</h1>
        </div>

        <Card className="card-hover shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm bounce-in">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center pulse-soft">
              <Heart className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back! 👋</CardTitle>
            <p className="text-black/80 pb-4">Ready for your next adventure?</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={login} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-300 font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
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
                <Label htmlFor="password" className="text-orange-300 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  className="h-12 border-2 border-orange-500/30 focus:border-orange-500 rounded-xl bg-gray-800/50 text-white placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
                {getError("password") && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    ⚠️ {getError("password")}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-orange-400 hover:text-orange-300 hover:underline font-medium transition-colors"
                >
                  🔐 Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="text-red-500 text-center font-semibold mb-2">
                  {errorMsg}
                </div>
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
                    Signing you in...
                  </>
                ) : (
                  <>
                    ✨ Sign In & Explore
                  </>
                )}
              </Button>

              {/* Motivational section */}
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-xl text-center border-2 border-orange-500/30">
                <p className="text-sm text-orange-200">
                  <span className="font-semibold text-orange-400">🌍 Ready to explore?</span>
                </p>
                <p className="text-xs text-orange-300/70 mt-1">
                  Your travel companions are waiting!
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Fun stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 slide-up">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-500/20">
            <p className="text-lg font-bold text-orange-400">50K+</p>
            <p className="text-xs text-orange-300/70">Travelers</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-500/20">
            <p className="text-lg font-bold text-orange-500">120+</p>
            <p className="text-xs text-orange-300/70">Countries</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-3 text-center border border-orange-500/20">
            <p className="text-lg font-bold text-orange-600">1M+</p>
            <p className="text-xs text-orange-300/70">Matches</p>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      <LoginSuccess isOpen={showSuccessModal} />
    </div>
  );
}



// export default function LoginPage() {
//   const router = useRouter();

//   return (
//     <LoginScreen
//       onBack={() => router.back()}
//       onLogin={(data) => {
//         router.push("/");
//       }}
//       onForgotPassword={() => router.push("/forgot-password")}
//     />
//   );
// }