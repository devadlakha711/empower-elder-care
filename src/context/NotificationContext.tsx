import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Notification } from '@/lib/api';

// Default notification types
type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  generateNotifications: (role: string) => void;
}

// Create context with default values
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAllNotifications: () => {},
  generateNotifications: () => {},
});

// Hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage:', error);
    }
  }, [notifications]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Generate role-specific notifications
  const generateNotifications = (role: string) => {
    // Clear existing notifications first
    clearAllNotifications();
    
    // Generate mock notifications based on user role
    const mockNotifications: Omit<Notification, 'id' | 'time' | 'isRead'>[] = [
      {
        title: "Welcome to Shatam",
        message: "Thank you for joining our platform dedicated to elder care.",
        type: "info",
      }
    ];
    
    // Role-specific notifications
    const roleSpecificNotifications: Record<string, Omit<Notification, 'id' | 'time' | 'isRead'>[]> = {
      caregiver: [
        {
          title: "New Training Module Available",
          message: "Check out the latest module on dementia care techniques.",
          type: "info",
        },
        {
          title: "Certification Reminder",
          message: "Your CPR certification expires in 30 days. Please renew it soon.",
          type: "warning",
        }
      ],
      client: [
        {
          title: "New Caregivers Available",
          message: "10 new caregivers have joined in your area this week.",
          type: "info",
        },
        {
          title: "Feedback Requested",
          message: "Please provide feedback on your recent caregiver experience.",
          type: "info",
        }
      ],
      admin: [
        {
          title: "System Update",
          message: "Platform updated to version 2.4.0 with new features.",
          type: "info",
        },
        {
          title: "User Reports Ready",
          message: "Monthly user activity reports are now available.",
          type: "info",
        },
        {
          title: "Urgent: Database Maintenance",
          message: "Scheduled maintenance tonight from 2-3 AM IST.",
          type: "warning",
        }
      ],
      tech: [
        {
          title: "API Performance Alert",
          message: "Search API response time has increased by 20%.",
          type: "warning",
        },
        {
          title: "Deployment Successful",
          message: "New features deployed to production environment.",
          type: "success",
        }
      ],
      doctor: [
        {
          title: "New Patient Assigned",
          message: "3 new patients have been assigned to your dashboard.",
          type: "info",
        },
        {
          title: "Medical Review Required",
          message: "Patient #2458 needs your medical assessment.",
          type: "warning",
        }
      ],
      counselor: [
        {
          title: "Upcoming Session",
          message: "You have a counseling session scheduled for tomorrow.",
          type: "info",
        },
        {
          title: "Case Notes Reminder",
          message: "Please complete case notes for your recent sessions.",
          type: "warning",
        }
      ]
    };
    
    // Add role-specific notifications
    const notificationsToAdd = [
      ...mockNotifications,
      ...(roleSpecificNotifications[role] || [])
    ];
    
    // Add each notification with a slight delay to simulate them coming in
    notificationsToAdd.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 300);
    });
  };
  
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    generateNotifications,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 
