
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phoneNumber: '' 
  });
  
  // Phone verification state
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      onClose();
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateSignupData = () => {
    if (!signupData.name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!signupData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!signupData.password) {
      toast.error('Please enter a password');
      return false;
    }
    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!signupData.phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    
    // Basic phone number validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(signupData.phoneNumber.trim())) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupData()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Store signup data for after phone verification
      setPendingSignupData(signupData);
      setShowPhoneVerification(true);
      toast.info('Please verify your phone number to complete registration');
    } catch (error) {
      console.error('Signup preparation failed:', error);
      toast.error('Failed to prepare signup process');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerified = async () => {
    if (!pendingSignupData) {
      toast.error('Signup data is missing');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(
        pendingSignupData.email, 
        pendingSignupData.password, 
        pendingSignupData.name,
        pendingSignupData.phoneNumber
      );
      onClose();
      setSignupData({ name: '', email: '', password: '', phoneNumber: '' });
      setPendingSignupData(null);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerificationClose = () => {
    setShowPhoneVerification(false);
    setPendingSignupData(null);
    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
              Welcome to SwapEat
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    value={signupData.phoneNumber}
                    onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </DialogContent>
      </Dialog>

      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={handlePhoneVerificationClose}
        phoneNumber={pendingSignupData?.phoneNumber || ''}
        onVerified={handlePhoneVerified}
      />
    </>
  );
};