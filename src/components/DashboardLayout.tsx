import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  Users, FileText, PieChart, Server, HeartPulse, Brain, 
  Menu, X, LogOut, UserCircle, Settings, Home
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "./ui/NotificationBell";
import { useNotifications } from "@/context/NotificationContext";

interface UserData {
  name: string;
  role: string;
  avatar?: string;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  // Fetch user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  // Sidebar navigation items
  const sidebarItems = [
    {
      role: "caregiver",
      icon: <FileText size={20} />,
      label: "Training Modules",
      path: "/dashboard/caregiver",
    },
    {
      role: "client",
      icon: <Users size={20} />,
      label: "Find Caregivers",
      path: "/dashboard/client",
    },
    {
      role: "admin",
      icon: <PieChart size={20} />,
      label: "Analytics",
      path: "/dashboard/admin",
    },
    {
      role: "tech",
      icon: <Server size={20} />,
      label: "System Monitoring",
      path: "/dashboard/tech",
    },
    {
      role: "doctor",
      icon: <HeartPulse size={20} />,
      label: "Health Reports",
      path: "/dashboard/doctor",
    },
    {
      role: "counselor",
      icon: <Brain size={20} />,
      label: "Cases",
      path: "/dashboard/counselor",
    },
  ];

  // Filter navigation items based on user role
  const filteredItems = userData 
    ? sidebarItems.filter(item => item.role === userData.role || userData.role === "admin")
    : [];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-border transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } md:relative`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-gradient">Shatam</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-2 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-lg transition-colors
              ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}
            `}
          >
            <Home size={20} />
            {isSidebarOpen && <span className="ml-3">Home</span>}
          </NavLink>

          {filteredItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg transition-colors
                ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}
              `}
              end
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-6">
          <div>
            {/* Header title based on current page would go here */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.avatar} alt={userData?.name} />
                    <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userData?.name || "User"}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-subtle p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 
