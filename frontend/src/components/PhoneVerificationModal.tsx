
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerified: () => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  onVerified
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [lastSentOtp, setLastSentOtp] = useState('');

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Phone number is required');
      return;
    }

    setIsResending(true);
    try {
      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setLastSentOtp(otpCode); // Store for demo purposes
      
      console.log('Attempting to send OTP to:', phoneNumber);
      
      // First, clean up any existing unverified OTP records for this phone number
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('phone_number', phoneNumber)
        .eq('verified', false);

      // Store OTP in database
      const { error } = await supabase
        .from('otp_verifications')
        .insert({
          phone_number: phoneNumber,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          verified: false
        });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create OTP record: ${error.message}`);
      }

      // In a real app, you would send SMS here
      console.log('OTP Code (for testing):', otpCode);
      toast.success(`OTP sent to ${phoneNumber}`);
      toast.info(`Demo OTP: ${otpCode} (Check console)`, { duration: 8000 });
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to send OTP: ${errorMessage}`);
    } finally {
      setIsResending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Phone number is missing');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('Verifying OTP:', otp, 'for phone:', phoneNumber);
      
      const { data, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('otp_code', otp)
        .gt('expires_at', new Date().toISOString())
        .eq('verified', false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Database error during verification:', error);
        throw new Error(`Verification failed: ${error.message}`);
      }

      console.log('OTP verification result:', data);

      if (data && data.length > 0) {
        // Mark as verified
        const { error: updateError } = await supabase
          .from('otp_verifications')
          .update({ verified: true })
          .eq('id', data[0].id);

        if (updateError) {
          console.error('Error marking OTP as verified:', updateError);
          throw new Error(`Failed to mark as verified: ${updateError.message}`);
        }

        toast.success('Phone number verified successfully!');
        onVerified();
        onClose();
        setOtp(''); // Clear OTP on success
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to verify OTP: ${errorMessage}`);
    } finally {
      setIsVerifying(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && phoneNumber && phoneNumber.trim() !== '') {
      setOtp(''); // Clear any previous OTP
      sendOTP();
    }
  }, [isOpen, phoneNumber]);

  const handleClose = () => {
    setOtp(''); // Clear OTP when closing
    onClose();
  };

  const fillDemoOtp = () => {
    if (lastSentOtp) {
      setOtp(lastSentOtp);
      toast.info('Demo OTP filled automatically');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Phone Number</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We've sent a verification code to {phoneNumber}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="otp">Enter 6-digit code</Label>
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={verifyOTP}
              disabled={isVerifying || otp.length !== 6}
              className="flex-1"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
            <Button
              variant="outline"
              onClick={sendOTP}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-500">
              For demo purposes, check the browser console for the OTP code.
            </div>
            {lastSentOtp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={fillDemoOtp}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Fill Demo OTP ({lastSentOtp})
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
