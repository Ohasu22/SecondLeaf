import { useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Mail, Clock } from "lucide-react";

export default function OTPModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email = "",
  title = "Verify Your Email",
  description = "We've sent a 6-digit code to your email address. Please enter it below to continue."
}) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsLoading(false);
      onVerify(otp);
      setOtp("");
    }, 1000);
  };

  const handleResend = () => {
    setTimeLeft(60);
    console.log('Resending OTP...');
    // Simulate resending
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-otp">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
            {email && (
              <span className="block mt-1 font-medium">
                Sent to: {email}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="otp" className="text-sm font-medium">
              Enter 6-digit code
            </Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              data-testid="input-otp"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="flex-1"
              data-testid="button-verify"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                Resend in {timeLeft}s
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResend}
                className="text-sm"
                data-testid="button-resend"
              >
                Resend Code
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}