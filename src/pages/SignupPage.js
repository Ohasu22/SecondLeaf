import { useState } from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import OTPModal from "../components/OTPModal";
import { ArrowLeft, Leaf, CheckCircle } from "lucide-react";

export default function SignupPage({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
    contactNumber: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOTPModal(true);
      console.log('Signup submitted:', formData);
    }, 1000);
  };

  const handleOTPVerify = (otp) => {
    console.log('OTP verified:', otp);
    setShowOTPModal(false);
    setIsVerified(true);
    
    // Store user data in localStorage - todo: remove mock functionality
    const users = JSON.parse(localStorage.getItem('secondleaf_users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150`
    };
    users.push(newUser);
    localStorage.setItem('secondleaf_users', JSON.stringify(users));
    localStorage.setItem('secondleaf_current_user', JSON.stringify(newUser));
    
    // Call success callback after short delay to show success state
    setTimeout(() => {
      onSuccess?.();
    }, 1500);
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.username.trim() !== '' &&
           formData.password.length >= 8 &&
           formData.dateOfBirth !== '' &&
           formData.contactNumber.trim() !== '';
  };

  const isAdult = () => {
    if (!formData.dateOfBirth) return false;
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
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
              {isVerified ? "Welcome to SecondLeaf!" : "Join SecondLeaf"}
            </CardTitle>
            <CardDescription>
              {isVerified 
                ? "Your account has been created successfully"
                : "Create your account to start buying and selling sustainably"
              }
            </CardDescription>
          </CardHeader>

          {!isVerified ? (
            <>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                      data-testid="input-fullname"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="johndoe"
                      required
                      data-testid="input-username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      minLength={8}
                      data-testid="input-password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      required
                      data-testid="input-dob"
                    />
                    {formData.dateOfBirth && !isAdult() && (
                      <p className="text-sm text-destructive mt-1">
                        You must be 18 or older to create an account
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      data-testid="input-contact"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!isFormValid() || !isAdult() || isLoading}
                    data-testid="button-signup"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login">
                      <span className="text-primary hover:underline cursor-pointer" data-testid="link-login">
                        Sign in here
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
                You're all set! Redirecting you to the marketplace...
              </p>
            </CardContent>
          )}
        </Card>

        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
          title="Verify Your Account"
          description="We've sent a verification code to your email address"
        />
      </div>
    </div>
  );
}