/**
 * Mock API service for Shatam application
 * This simulates API calls to a backend server
 */

import { toast } from "@/components/ui/use-toast";

// Types
export interface User {
  id: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export interface Caregiver extends User {
  specializations: string[];
  experience: number;
  rating: number;
  certifications: string[];
  availability: string[];
  hourlyRate: number;
}

export interface Client extends User {
  careType: string;
  schedule: string;
  duration: string;
  budget: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  duration: string;
}

export interface PlacementOffer {
  id: string;
  clientName: string;
  location: string;
  schedule: string;
  duration: string;
  payRate: string;
  status: "pending" | "accepted" | "declined";
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error handler
const handleError = (error: unknown) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: error instanceof Error ? error.message : "An unknown error occurred",
    variant: "destructive",
  });
  throw error;
};

// API Service
const api = {
  // Auth with OTP
  loginWithOtp: async (phone: string, otp: string, role: string): Promise<User> => {
    try {
      await delay(1000); // Simulate API call
      
      // In a real app, this would verify OTP with the server
      // For demo purposes, any 6-digit OTP works
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        throw new Error("Invalid OTP format");
      }
      
      // Generate a user based on role
      let name = `${role.charAt(0).toUpperCase() + role.slice(1)} User`;
      
      // Use predefined names for some roles for better UX
      switch (role) {
        case 'admin':
          name = 'Admin User';
          break;
        case 'caregiver':
          name = 'Priya Sharma';
          break;
        case 'client':
          name = 'Raj Malhotra';
          break;
        case 'doctor':
          name = 'Dr. Agarwal';
          break;
        case 'counselor':
          name = 'Sunita Counselor';
          break;
        case 'tech':
          name = 'Tech Support';
          break;
      }
      
      const user: User = {
        id: crypto.randomUUID(),
        name,
        role,
        phone,
        location: "Mumbai, India",
        avatar: "/placeholder-avatar.jpg",
      };
      
      return user;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Auth with password (legacy - keeping for backward compatibility)
  login: async (phone: string, password: string, role: string): Promise<User> => {
    try {
      await delay(1000); // Simulate API call
      
      // In a real app, this would be a POST request to /api/auth/login
      // For now, we'll just return a mock user
      const user: User = {
        id: crypto.randomUUID(),
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        role,
        phone,
        location: "Mumbai, India",
        avatar: "/placeholder-avatar.jpg",
      };
      
      return user;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Send OTP
  sendOtp: async (phone: string): Promise<boolean> => {
    try {
      await delay(800); // Simulate API call
      
      // In a real app, this would send an actual OTP to the phone number
      // For demo purposes, always return success
      return true;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Verify if user exists
  checkUserExists: async (phone: string): Promise<boolean> => {
    try {
      await delay(600); // Simulate API call
      
      // In a real app, this would check if the user exists in the database
      // For demo purposes, return random result
      return Math.random() > 0.3; // 70% chance user exists
    } catch (error) {
      return handleError(error);
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await delay(500); // Simulate API call
      // In a real app, this would be a POST request to /api/auth/logout
    } catch (error) {
      handleError(error);
    }
  },
  
  // User
  getProfile: async (): Promise<User> => {
    try {
      await delay(800); // Simulate API call
      
      // In a real app, this would fetch the user profile from the server
      // For now, we'll just return the user from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not found");
      }
      
      return JSON.parse(storedUser);
    } catch (error) {
      return handleError(error);
    }
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      await delay(1000); // Simulate API call
      
      // In a real app, this would be a PUT request to /api/users/profile
      // For now, we'll just update the user in localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("User not found");
      }
      
      const currentUser = JSON.parse(storedUser);
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    try {
      await delay(800); // Simulate API call
      
      // In a real app, this would fetch notifications from the server
      // For now, we'll just return notifications from localStorage
      const storedNotifications = localStorage.getItem("notifications");
      if (!storedNotifications) {
        return [];
      }
      
      return JSON.parse(storedNotifications);
    } catch (error) {
      return handleError(error);
    }
  },
  
  markNotificationAsRead: async (id: string): Promise<void> => {
    try {
      await delay(500); // Simulate API call
      
      // In a real app, this would be a PUT request to /api/notifications/{id}/read
      // For now, we'll just update the notification in localStorage
      const storedNotifications = localStorage.getItem("notifications");
      if (!storedNotifications) {
        return;
      }
      
      const notifications: Notification[] = JSON.parse(storedNotifications);
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    } catch (error) {
      handleError(error);
    }
  },
  
  // Caregivers
  getCaregivers: async (filters?: any): Promise<Caregiver[]> => {
    try {
      await delay(1200); // Simulate API call
      
      // In a real app, this would be a GET request to /api/caregivers with query params
      // For now, we'll just return mock data
      const caregivers: Caregiver[] = [
        {
          id: "1",
          name: "Priya Sharma",
          role: "caregiver",
          phone: "+91 98765 43210",
          location: "Mumbai, India",
          specializations: ["Elderly Care", "Medical Assistance"],
          experience: 5,
          rating: 4.8,
          certifications: ["CPR", "First Aid", "Dementia Care"],
          availability: ["Weekdays", "Evenings"],
          hourlyRate: 250,
        },
        {
          id: "2",
          name: "Raj Patel",
          role: "caregiver",
          phone: "+91 87654 32109",
          location: "Delhi, India",
          specializations: ["Elderly Care", "Physiotherapy"],
          experience: 3,
          rating: 4.5,
          certifications: ["CPR", "Physical Therapy Assistant"],
          availability: ["Weekends", "Nights"],
          hourlyRate: 200,
        },
        {
          id: "3",
          name: "Anita Desai",
          role: "caregiver",
          phone: "+91 76543 21098",
          location: "Bangalore, India",
          specializations: ["Palliative Care", "Elderly Care"],
          experience: 7,
          rating: 4.9,
          certifications: ["CPR", "Palliative Care", "Geriatric Care"],
          availability: ["Full-time"],
          hourlyRate: 300,
        },
      ];
      
      return caregivers;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Training Modules
  getTrainingModules: async (): Promise<TrainingModule[]> => {
    try {
      await delay(800); // Simulate API call
      
      // In a real app, this would be a GET request to /api/training/modules
      // For now, we'll just return mock data
      const modules: TrainingModule[] = [
        {
          id: "mod-1",
          title: "Basic Elderly Care Fundamentals",
          description: "Learn the basics of elderly care including mobility assistance, hygiene management, and diet supervision.",
          progress: 100,
          completed: true,
          duration: "4 hours",
        },
        {
          id: "mod-2",
          title: "Medication Management",
          description: "Understanding medication schedules, proper administration, and monitoring side effects.",
          progress: 65,
          completed: false,
          duration: "3 hours",
        },
        {
          id: "mod-3",
          title: "Emergency Response",
          description: "How to handle medical emergencies, falls, and when to call professional help.",
          progress: 40,
          completed: false,
          duration: "2 hours",
        },
        {
          id: "mod-4",
          title: "Cognitive Health & Memory Care",
          description: "Techniques for supporting patients with dementia, Alzheimer's, and other cognitive conditions.",
          progress: 0,
          completed: false,
          duration: "5 hours",
        },
      ];
      
      return modules;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Placement Offers
  getPlacementOffers: async (): Promise<PlacementOffer[]> => {
    try {
      await delay(1000); // Simulate API call
      
      // In a real app, this would be a GET request to /api/placements/offers
      // For now, we'll just return mock data
      const placements: PlacementOffer[] = [
        {
          id: "place-1",
          clientName: "Sharma Family",
          location: "Bandra, Mumbai",
          schedule: "Mon-Fri, 9AM-5PM",
          duration: "3 months",
          payRate: "₹20,000/month",
          status: "pending",
        },
        {
          id: "place-2",
          clientName: "Mr. Patel",
          location: "Andheri, Mumbai",
          schedule: "Weekends only",
          duration: "Ongoing",
          payRate: "₹1,200/day",
          status: "pending",
        },
        {
          id: "place-3",
          clientName: "Mrs. Gupta",
          location: "Powai, Mumbai",
          schedule: "Night shifts, 8PM-8AM",
          duration: "1 month",
          payRate: "₹25,000/month",
          status: "pending",
        },
      ];
      
      return placements;
    } catch (error) {
      return handleError(error);
    }
  },
  
  respondToPlacement: async (id: string, accept: boolean): Promise<void> => {
    try {
      await delay(800); // Simulate API call
      
      // In a real app, this would be a PUT request to /api/placements/offers/{id}/respond
      // No localStorage update needed here as this would normally be handled by the server
    } catch (error) {
      handleError(error);
    }
  },
  
  // Feedback
  submitFeedback: async (feedbackData: any): Promise<void> => {
    try {
      await delay(1000); // Simulate API call
      
      // In a real app, this would be a POST request to /api/feedback
      // No localStorage update needed here as this would normally be handled by the server
    } catch (error) {
      handleError(error);
    }
  },
};

export default api; 
