import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationContext';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react';

interface UserData {
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  location?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearAllNotifications } = useNotifications();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    smsNotifications: true,
    callNotifications: false,
    darkMode: false,
    language: 'english',
  });

  // Load user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        
        // Initialize form with user data
        setForm({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          location: parsedUser.location || '',
        });
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle settings changes
  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Handle language change
  const handleLanguageChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      language: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Update user data in state and localStorage
      if (userData) {
        const updatedUser = {
          ...userData,
          name: form.name,
          phone: form.phone,
          location: form.location,
        };
        
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile information has been updated successfully.',
        });
      }
    }, 1000);
  };

  // Handle settings update
  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Save settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      toast({
        title: 'Settings Updated',
        description: 'Your settings have been saved successfully.',
      });
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('user');
    clearAllNotifications();
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    
    // Redirect to login
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - User Info */}
        <div className="md:w-1/3">
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-3xl">{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription className="text-center capitalize">
                  {userData.role}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                {form.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="text-muted-foreground">Phone:</div>
                    <div>{form.phone}</div>
                  </div>
                )}
                {form.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="text-muted-foreground">Location:</div>
                    <div>{form.location}</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleFormChange}
                        placeholder="City, State"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSettingsUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates and alerts via SMS
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={settings.smsNotifications}
                          onCheckedChange={() => handleSettingChange('smsNotifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="call-notifications">Call Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive important alerts via phone call
                          </p>
                        </div>
                        <Switch
                          id="call-notifications"
                          checked={settings.callNotifications}
                          onCheckedChange={() => handleSettingChange('callNotifications')}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Application Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable dark mode for the application
                            </p>
                          </div>
                          <Switch
                            id="dark-mode"
                            checked={settings.darkMode}
                            onCheckedChange={() => handleSettingChange('darkMode')}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <select
                            id="language"
                            className="w-full px-3 py-2 border border-input rounded-md"
                            value={settings.language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                          >
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="marathi">Marathi</option>
                            <option value="tamil">Tamil</option>
                            <option value="telugu">Telugu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
