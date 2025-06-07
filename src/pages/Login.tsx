import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useNotifications } from '@/context/NotificationContext';

// Define form validation schemas
const phoneFormSchema = z.object({
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number is too long." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  role: z.enum(["caregiver", "client", "admin", "tech", "doctor", "counselor"], {
    required_error: "Please select a user type.",
  }),
});

const signupPhoneFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number is too long." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  role: z.enum(["caregiver", "client"], {
    required_error: "Please select a user type.",
  }),
});

const signupFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number is too long." })
    .regex(/^\d+$/, { message: "Phone number must contain only digits." }),
  role: z.enum(["caregiver", "client"], {
    required_error: "Please select a user type.",
  }),
  location: z.string().optional(),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type SignupPhoneFormValues = z.infer<typeof signupPhoneFormSchema>;
type SignupFormValues = z.infer<typeof signupFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [verificationStep, setVerificationStep] = useState<'phone' | 'otp'>('phone');
  const [phoneData, setPhoneData] = useState({ phone: '', role: 'caregiver', name: '' });
  const [isNewUser, setIsNewUser] = useState(false);
  const [signupPhoneVerified, setSignupPhoneVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Create refs for OTP inputs
  const loginOtpInputRef = useRef<HTMLInputElement>(null);
  const signupOtpInputRef = useRef<HTMLInputElement>(null);

  // Effect to clear OTP input when switching to OTP step
  useEffect(() => {
    if (verificationStep === 'otp') {
      setOtpValue('');
      
      // Start resend timer
      startResendTimer();
      
      // Focus the appropriate OTP input
      setTimeout(() => {
        if (activeTab === 'login' && loginOtpInputRef.current) {
          loginOtpInputRef.current.focus();
          loginOtpInputRef.current.value = '';
        } else if (activeTab === 'signup' && signupOtpInputRef.current) {
          signupOtpInputRef.current.focus();
          signupOtpInputRef.current.value = '';
        }
      }, 100);
    }
    
    // Cleanup timer when component unmounts
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [verificationStep, activeTab]);
  
  // Start 30-second resend timer
  const startResendTimer = () => {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setResendTimer(30);
    
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Initialize phone form for login
  const loginPhoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
      role: "caregiver",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Initialize phone form for signup
  const signupPhoneForm = useForm<SignupPhoneFormValues>({
    resolver: zodResolver(signupPhoneFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "caregiver",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Initialize signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "caregiver",
      location: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Handle phone form submission for login
  const onLoginPhoneSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    
    try {
      // Validate phone number format
      if (!/^\d{10,15}$/.test(values.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number with 10-15 digits only.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would send an OTP to the user's phone
      // For demo purposes, we'll simulate sending an OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save phone and role for the next step
      setPhoneData({
        phone: values.phone,
        role: values.role,
        name: '',
      });
      
      // Check if user exists (in a real app, this would be a server check)
      const isExistingUser = Math.random() > 0.3; // Simulate random new/existing user
      setIsNewUser(!isExistingUser);
      
      // Reset OTP input before showing OTP step
      setOtpValue('');
      
      // Show OTP verification step
      setVerificationStep('otp');
      
      toast({
        title: "OTP Sent",
        description: "A 6-digit verification code has been sent to your phone.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Send OTP",
        description: error instanceof Error ? error.message : "Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone form submission for signup
  const onSignupPhoneSubmit = async (values: SignupPhoneFormValues) => {
    setIsLoading(true);
    
    try {
      // Validate phone number format
      if (!/^\d{10,15}$/.test(values.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number with 10-15 digits only.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would send an OTP to the user's phone
      // For demo purposes, we'll simulate sending an OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save phone, name and role for the next step
      setPhoneData({
        phone: values.phone,
        role: values.role,
        name: values.name,
      });
      
      // Reset OTP input before showing OTP step
      setOtpValue('');
      
      // Show OTP verification step
      setVerificationStep('otp');
      
      toast({
        title: "OTP Sent",
        description: "A 6-digit verification code has been sent to your phone.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Send OTP",
        description: error instanceof Error ? error.message : "Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate OTP format
      if (!/^\d{6}$/.test(otpValue)) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // In a real app, this would verify the OTP with the server
      // For demo purposes, any 6-digit code works
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === "login") {
        // If this is a new user, show the sign-up form
        if (isNewUser) {
          setActiveTab("signup");
          signupForm.setValue("phone", phoneData.phone);
          signupForm.setValue("role", phoneData.role as any);
          setVerificationStep('phone'); // Reset for next time
          setIsLoading(false);
          return;
        }
        
        // For existing users, log them in
        const user = await api.loginWithOtp(phoneData.phone, otpValue, phoneData.role);
        
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        
        // Generate mock notifications for this user
        generateNotifications(phoneData.role);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect to appropriate dashboard
        navigate(`/dashboard/${phoneData.role}`);
      } else {
        // For signup flow, mark phone as verified and show the full signup form
        setSignupPhoneVerified(true);
        setVerificationStep('phone');
        
        // Pre-fill the signup form with the verified phone and name
        signupForm.setValue("phone", phoneData.phone);
        signupForm.setValue("role", phoneData.role as any);
        signupForm.setValue("name", phoneData.name);
        
        toast({
          title: "Phone Verified",
          description: "Your phone number has been verified. Please complete your profile.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (values: SignupFormValues) => {
    if (!signupPhoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a user with phone number
      const user = {
        id: crypto.randomUUID(),
        name: values.name,
        role: values.role,
        phone: values.phone,
        location: values.location || "Mumbai, India",
      };
      
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      // Generate mock notifications for this user
      generateNotifications(values.role);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Shatam, ${values.name}!`,
      });
      
      // Redirect to appropriate dashboard
      navigate(`/dashboard/${values.role}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was a problem creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, any 6-digit OTP works
  const resendOtp = () => {
    setOtpValue('');
    startResendTimer();
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your phone.",
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVerificationStep('phone');
    setSignupPhoneVerified(false);
    setOtpValue('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Shatam</CardTitle>
          <CardDescription>
            {verificationStep === 'phone' 
              ? 'Enter your phone number to continue' 
              : 'Enter the verification code sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4 pt-4">
              {verificationStep === 'phone' ? (
                <Form {...loginPhoneForm}>
                  <form onSubmit={loginPhoneForm.handleSubmit(onLoginPhoneSubmit)} className="space-y-4">
                    <FormField
                      control={loginPhoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your 10-digit phone number" 
                              type="tel" 
                              inputMode="numeric" 
                              pattern="[0-9]*"
                              {...field} 
                              onChange={(e) => {
                                // Only allow digits
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginPhoneForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>User Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="caregiver" />
                                </FormControl>
                                <FormLabel className="font-normal">Caregiver</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="client" />
                                </FormControl>
                                <FormLabel className="font-normal">Client</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="admin" />
                                </FormControl>
                                <FormLabel className="font-normal">Admin</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="tech" />
                                </FormControl>
                                <FormLabel className="font-normal">Tech Team</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="doctor" />
                                </FormControl>
                                <FormLabel className="font-normal">Doctor</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="counselor" />
                                </FormControl>
                                <FormLabel className="font-normal">Counselor</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading || !loginPhoneForm.formState.isValid}>
                      {isLoading ? "Sending OTP..." : "Send Verification Code"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <form onSubmit={onOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium">Verification Code (OTP)</div>
                    <Input 
                      placeholder="Enter 6-digit code" 
                      maxLength={6}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      id="otp-input-login"
                      name="otp"
                      ref={loginOtpInputRef}
                      value={otpValue}
                      onChange={(e) => {
                        // Only allow digits and limit to 6
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtpValue(value);
                      }}
                    />
                    {otpValue && otpValue.length !== 6 && (
                      <p className="text-sm font-medium text-destructive">OTP must be exactly 6 digits</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground text-center mb-2">
                    OTP sent to: {phoneData.phone}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend OTP in {resendTimer} seconds
                      </p>
                    ) : (
                      <Button 
                        variant="link" 
                        type="button" 
                        onClick={resendOtp}
                        className="text-sm text-muted-foreground"
                      >
                        Didn't receive code? Resend
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      type="button" 
                      onClick={() => {
                        setVerificationStep('phone');
                        setOtpValue('');
                      }}
                      className="text-sm text-muted-foreground"
                    >
                      Use a different phone number
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
            
            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4 pt-4">
              {!signupPhoneVerified ? (
                verificationStep === 'phone' ? (
                  <Form {...signupPhoneForm}>
                    <form onSubmit={signupPhoneForm.handleSubmit(onSignupPhoneSubmit)} className="space-y-4">
                      <FormField
                        control={signupPhoneForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupPhoneForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your 10-digit phone number" 
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                {...field}
                                onChange={(e) => {
                                  // Only allow digits
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupPhoneForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>I am a:</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 gap-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="caregiver" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Caregiver</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="client" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Client</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading || !signupPhoneForm.formState.isValid}>
                        {isLoading ? "Sending OTP..." : "Verify Phone Number"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <form onSubmit={onOtpSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="font-medium">Verification Code (OTP)</div>
                      <Input 
                        placeholder="Enter 6-digit code" 
                        maxLength={6}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="otp-input-signup"
                        name="otp"
                        ref={signupOtpInputRef}
                        value={otpValue}
                        onChange={(e) => {
                          // Only allow digits and limit to 6
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpValue(value);
                        }}
                      />
                      {otpValue && otpValue.length !== 6 && (
                        <p className="text-sm font-medium text-destructive">OTP must be exactly 6 digits</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground text-center mb-2">
                      OTP sent to: {phoneData.phone}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                    </Button>
                    
                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Resend OTP in {resendTimer} seconds
                        </p>
                      ) : (
                        <Button 
                          variant="link" 
                          type="button" 
                          onClick={resendOtp}
                          className="text-sm text-muted-foreground"
                        >
                          Didn't receive code? Resend
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        variant="link" 
                        type="button" 
                        onClick={() => {
                          setVerificationStep('phone');
                          setOtpValue('');
                        }}
                        className="text-sm text-muted-foreground"
                      >
                        Use a different phone number
                      </Button>
                    </div>
                  </form>
                )
              ) : (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Verified)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>I am a:</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="caregiver" />
                                </FormControl>
                                <FormLabel className="font-normal">Caregiver</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="client" />
                                </FormControl>
                                <FormLabel className="font-normal">Client</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading || !signupForm.formState.isValid}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
