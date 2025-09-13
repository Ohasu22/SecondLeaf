import { useState } from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import OTPModal from "../components/OTPModal";
import { ArrowLeft, Leaf, CheckCircle } from "lucide-react";

export default function LoginPage({ onSuccess }) {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    setError("");

    // Simulate authentication check
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('secondleaf_users') || '[]');
      const user = users.find((u) => 
        (u.email === formData.emailOrUsername || u.username === formData.emailOrUsername) && 
        u.password === formData.password
      );

      setIsLoading(false);

      if (user) {
        setShowOTPModal(true);
        console.log('Login attempt for:', formData.emailOrUsername);
      } else {
        setError("Invalid email/username or password");
      }
    }, 1000);
  };

  const handleOTPVerify = (otp) => {
    console.log('OTP verified:', otp);
    setShowOTPModal(false);
    setIsVerified(true);
    
    // Set current user in localStorage
    const users = JSON.parse(localStorage.getItem('secondleaf_users') || '[]');
    const user = users.find((u) => 
      u.email === formData.emailOrUsername || u.username === formData.emailOrUsername
    );
    
    if (user) {
      localStorage.setItem('secondleaf_current_user', JSON.stringify(user));
    }
    
    // Call success callback after short delay to show success state
    setTimeout(() => {
      onSuccess?.();
    }, 1500);
  };

  const isFormValid = () => {
    return formData.emailOrUsername.trim() !== '' && 
           formData.password.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-3">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {isVerified ? "Welcome Back!" : "Sign In to SecondLeaf"}
            </CardTitle>
            <CardDescription>
              {isVerified 
                ? "Login successful! Redirecting you to the marketplace..."
                : "Access your account to continue your sustainable shopping journey"
              }
            </CardDescription>
          </CardHeader>

          {!isVerified ? (
            <>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emailOrUsername">Email or Username *</Label>
                    <Input
                      id="emailOrUsername"
                      type="text"
                      value={formData.emailOrUsername}
                      onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                      placeholder="Enter your email or username"
                      required
                      data-testid="input-email-username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      required
                      data-testid="input-password"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!isFormValid() || isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup">
                      <span className="text-primary hover:underline cursor-pointer" data-testid="link-signup">
                        Create one here
                      </span>
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </>
          ) : (
            <CardContent className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Successfully signed in! Taking you to the marketplace...
              </p>
            </CardContent>
          )}
        </Card>

        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
          title="Verify Your Identity"
          description="Please enter the verification code to complete your login"
        />
      </div>
    </div>
  );
}