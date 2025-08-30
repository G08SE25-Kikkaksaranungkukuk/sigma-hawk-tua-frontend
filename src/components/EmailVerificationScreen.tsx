import { Mail, ArrowLeft, Sparkles, CheckCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface EmailVerificationScreenProps {
  email: string;
  onBack: () => void;
  onResendEmail: () => void;
}

export function EmailVerificationScreen({ email, onBack, onResendEmail }: EmailVerificationScreenProps) {
  return (
    <div className="min-h-screen bg-black p-4 bg-floating-shapes">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-500/20 rounded-full float"></div>
        <div className="absolute top-60 right-16 w-12 h-12 bg-orange-400/30 rounded-full float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-orange-600/20 rounded-full float-delayed-2"></div>
        <Sparkles className="absolute top-32 right-32 text-orange-500/30 w-6 h-6 float" />
        <CheckCircle className="absolute bottom-32 left-32 text-orange-400/30 w-5 h-5 float-delayed" />
        <Clock className="absolute top-1/2 right-10 text-orange-300/30 w-4 h-4 float-delayed-2" />
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
          <h1 className="text-xl font-semibold text-white">Email Verification</h1>
        </div>

        <Card className="card-hover shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-sm bounce-in">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center pulse-soft">
              <Mail className="w-10 h-10 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email! 📧</CardTitle>
            <p className="text-black/80">We've sent you something special</p>
          </CardHeader>
          <CardContent className="text-center space-y-6 p-6">
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-xl border border-orange-500/30">
              <p className="text-orange-300 font-medium">
                📬 We've sent a verification link to:
              </p>
              <p className="font-bold text-orange-400 text-lg mt-2 break-all">
                {email}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-orange-200">
                <Clock className="w-5 h-5 text-orange-500" />
                <p className="text-sm">Usually arrives within 2-3 minutes</p>
              </div>
              
              <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-4">
                <p className="text-sm text-orange-200">
                  <span className="font-semibold text-orange-400">💡 Pro tip:</span> Check your spam folder if you don't see it!
                </p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Button
                onClick={onResendEmail}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black rounded-xl font-semibold btn-hover-lift border-0 orange-glow"
              >
                📤 Resend Email
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-orange-400/70">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-orange-400" />
                  <span>Reliable</span>
                </div>
              </div>
            </div>

            {/* Fun animation section */}
            <div className="pt-4">
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-xs text-orange-400/70 mt-2">Waiting for you to verify...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}