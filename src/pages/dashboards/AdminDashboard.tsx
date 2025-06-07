import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Check, 
  X,
  Clock
} from "lucide-react";
import PaginationContainer from "@/components/ui/PaginationContainer";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  location: string;
  status: "active" | "pending" | "inactive";
  joinedAt: string;
}

interface FeedbackItem {
  id: string;
  userType: string;
  userName: string;
  content: string;
  date: string;
  status: "new" | "reviewed" | "resolved";
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "draft";
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [feedbackResponse, setFeedbackResponse] = useState("");

  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      name: "Rajesh Kumar",
      role: "caregiver",
      email: "rajesh@example.com",
      location: "Mumbai",
      status: "active",
      joinedAt: "2023-06-15",
    },
    {
      id: "user-2",
      name: "Anjali Sharma",
      role: "client",
      email: "anjali@example.com",
      location: "Delhi",
      status: "active",
      joinedAt: "2023-08-22",
    },
    {
      id: "user-3",
      name: "Vikram Singh",
      role: "caregiver",
      email: "vikram@example.com",
      location: "Bangalore",
      status: "pending",
      joinedAt: "2023-11-03",
    },
    {
      id: "user-4",
      name: "Priya Patel",
      role: "client",
      email: "priya@example.com",
      location: "Ahmedabad",
      status: "inactive",
      joinedAt: "2023-07-18",
    },
    {
      id: "user-5",
      name: "Sanjay Gupta",
      role: "doctor",
      email: "sanjay@example.com",
      location: "Chennai",
      status: "active",
      joinedAt: "2023-05-10",
    },
    {
      id: "user-6",
      name: "Meera Reddy",
      role: "caregiver",
      email: "meera@example.com",
      location: "Hyderabad",
      status: "active",
      joinedAt: "2023-09-05",
    },
    {
      id: "user-7",
      name: "Amit Joshi",
      role: "client",
      email: "amit@example.com",
      location: "Pune",
      status: "active",
      joinedAt: "2023-10-12",
    },
    {
      id: "user-8",
      name: "Neha Verma",
      role: "counselor",
      email: "neha@example.com",
      location: "Jaipur",
      status: "pending",
      joinedAt: "2023-11-15",
    },
    {
      id: "user-9",
      name: "Rahul Malhotra",
      role: "caregiver",
      email: "rahul@example.com",
      location: "Kolkata",
      status: "active",
      joinedAt: "2023-07-28",
    },
    {
      id: "user-10",
      name: "Divya Sen",
      role: "tech",
      email: "divya@example.com",
      location: "Lucknow",
      status: "inactive",
      joinedAt: "2023-08-03",
    },
  ]);

  // Mock data for feedback
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: "feedback-1",
      userType: "Caregiver",
      userName: "Rajesh Kumar",
      content: "The training modules are very informative, but I'd like to see more practical examples for handling emergency situations.",
      date: "2023-10-15",
      status: "new",
    },
    {
      id: "feedback-2",
      userType: "Client",
      userName: "Anjali Sharma",
      content: "Our caregiver has been excellent. Very professional and caring with my mother. The matching process was quick and efficient.",
      date: "2023-11-02",
      status: "reviewed",
    },
    {
      id: "feedback-3",
      userType: "Caregiver",
      userName: "Vikram Singh",
      content: "The app sometimes crashes when I try to upload my certification documents. Please fix this issue.",
      date: "2023-11-10",
      status: "new",
    },
    {
      id: "feedback-4",
      userType: "Client",
      userName: "Priya Patel",
      content: "I would like to request a different caregiver as the current one is not able to meet our scheduling needs.",
      date: "2023-11-18",
      status: "new",
    },
    {
      id: "feedback-5",
      userType: "Caregiver",
      userName: "Meera Reddy",
      content: "The payment system is not calculating my hours correctly. I worked 40 hours but only got paid for 36.",
      date: "2023-11-15",
      status: "reviewed",
    },
    {
      id: "feedback-6",
      userType: "Client",
      userName: "Amit Joshi",
      content: "Extremely satisfied with the services. The caregiver is punctual and takes good care of my father.",
      date: "2023-11-05",
      status: "resolved",
    },
    {
      id: "feedback-7",
      userType: "Caregiver",
      userName: "Rahul Malhotra",
      content: "Can we have more advanced training modules for specialized care like dementia patients?",
      date: "2023-10-30",
      status: "new",
    },
  ]);

  // Mock data for training modules
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([
    {
      id: "module-1",
      title: "Basic Elderly Care Fundamentals",
      description: "Learn the basics of elderly care including mobility assistance, hygiene management, and diet supervision.",
      createdAt: "2023-03-15",
      updatedAt: "2023-09-20",
      status: "active",
    },
    {
      id: "module-2",
      title: "Medication Management",
      description: "Understanding medication schedules, proper administration, and monitoring side effects.",
      createdAt: "2023-04-22",
      updatedAt: "2023-10-05",
      status: "active",
    },
    {
      id: "module-3",
      title: "Emergency Response",
      description: "How to handle medical emergencies, falls, and when to call professional help.",
      createdAt: "2023-05-18",
      updatedAt: "2023-08-30",
      status: "active",
    },
    {
      id: "module-4",
      title: "Cognitive Health & Memory Care",
      description: "Techniques for supporting patients with dementia, Alzheimer's, and other cognitive conditions.",
      createdAt: "2023-08-10",
      updatedAt: "2023-10-12",
      status: "draft",
    },
    {
      id: "module-5",
      title: "Physical Therapy Basics",
      description: "Learn simple physical therapy exercises to help elderly patients maintain mobility.",
      createdAt: "2023-09-05",
      updatedAt: "2023-10-15",
      status: "active",
    },
    {
      id: "module-6",
      title: "Nutrition and Diet Planning",
      description: "Understanding nutritional needs of elderly patients and how to prepare appropriate meals.",
      createdAt: "2023-09-20",
      updatedAt: "2023-11-01",
      status: "draft",
    },
    {
      id: "module-7",
      title: "Communication Skills",
      description: "Effective communication techniques for elderly patients with hearing or cognitive impairments.",
      createdAt: "2023-10-10",
      updatedAt: "2023-11-05",
      status: "active",
    },
  ]);

  // Handler for updating user status
  const handleUpdateUserStatus = (userId: string, newStatus: "active" | "pending" | "inactive") => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    toast({
      title: "User Updated",
      description: `User status has been updated to ${newStatus}.`,
    });
  };

  // Handler for adding a new training module
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a module title.",
        variant: "destructive",
      });
      return;
    }

    const newModule: TrainingModule = {
      id: `module-${trainingModules.length + 1}`,
      title: newModuleTitle,
      description: newModuleDescription || "No description provided.",
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: "draft",
    };

    setTrainingModules([...trainingModules, newModule]);
    setNewModuleTitle("");
    setNewModuleDescription("");

    toast({
      title: "Module Created",
      description: "New training module has been created as draft.",
    });
  };

  // Handler for updating training module status
  const handleUpdateModuleStatus = (moduleId: string, newStatus: "active" | "draft") => {
    setTrainingModules(trainingModules.map(module => 
      module.id === moduleId ? { ...module, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : module
    ));
    
    toast({
      title: "Module Updated",
      description: `Module status has been updated to ${newStatus}.`,
    });
  };

  // Handler for responding to feedback
  const handleFeedbackResponse = (feedbackId: string) => {
    if (!feedbackResponse.trim()) {
      toast({
        title: "Missing Response",
        description: "Please enter a response message.",
        variant: "destructive",
      });
      return;
    }

    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId ? { ...feedback, status: "resolved" } : feedback
    ));
    
    setSelectedFeedback(null);
    setFeedbackResponse("");
    
    toast({
      title: "Response Sent",
      description: "Your response has been sent to the user.",
    });
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render a user row for the table
  const renderUserRow = (user: User, index: number) => (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{user.role}</Badge>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.location}</TableCell>
      <TableCell>
        <Badge 
          variant={
            user.status === "active" ? "default" : 
            user.status === "pending" ? "outline" : 
            "destructive"
          }
        >
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>{user.joinedAt}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Edit size={16} />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Clock size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update User Status</DialogTitle>
                <DialogDescription>
                  Change the status of {user.name} ({user.email})
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center gap-2 py-4">
                <Button 
                  onClick={() => handleUpdateUserStatus(user.id, "active")} 
                  className={user.status === "active" ? "gradient-primary" : ""}
                >
                  <Check size={14} className="mr-1" /> Active
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateUserStatus(user.id, "pending")}
                  className={user.status === "pending" ? "border-primary text-primary" : ""}
                >
                  <Clock size={14} className="mr-1" /> Pending
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdateUserStatus(user.id, "inactive")}
                  className={user.status === "inactive" ? "border-destructive text-destructive" : ""}
                >
                  <X size={14} className="mr-1" /> Inactive
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );

  // Render a feedback row for the table
  const renderFeedbackRow = (feedback: FeedbackItem, index: number) => (
    <TableRow key={feedback.id}>
      <TableCell className="font-medium">{feedback.userName}</TableCell>
      <TableCell>
        <Badge variant="outline">{feedback.userType}</Badge>
      </TableCell>
      <TableCell className="max-w-xs truncate">{feedback.content}</TableCell>
      <TableCell>{feedback.date}</TableCell>
      <TableCell>
        <Badge 
          variant={feedback.status === "new" ? "destructive" : 
                  feedback.status === "reviewed" ? "outline" : "default"}
        >
          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Dialog 
          open={selectedFeedback?.id === feedback.id} 
          onOpenChange={(open) => {
            if (!open) setSelectedFeedback(null);
            else setSelectedFeedback(feedback);
          }}
        >
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={feedback.status === "resolved"}
            >
              {feedback.status === "new" ? "Review" : 
                feedback.status === "reviewed" ? "Respond" : "View"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Feedback from {feedback.userName}</DialogTitle>
              <DialogDescription>
                {feedback.userType} • {feedback.date}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                {feedback.content}
              </div>
              
              {feedback.status !== "resolved" && (
                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea 
                    id="response" 
                    placeholder="Enter your response to this feedback..." 
                    value={feedbackResponse}
                    onChange={(e) => setFeedbackResponse(e.target.value)}
                  />
                </div>
              )}
            </div>
            {feedback.status !== "resolved" && (
              <DialogFooter>
                <Button 
                  className="gradient-primary w-full"
                  onClick={() => handleFeedbackResponse(feedback.id)}
                >
                  Send Response
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );

  // Render a training module card
  const renderTrainingModule = (module: TrainingModule, index: number) => (
    <Card key={module.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription className="mt-1">
              Created: {module.createdAt} • Updated: {module.updatedAt}
            </CardDescription>
          </div>
          <Badge variant={module.status === "active" ? "default" : "outline"}>
            {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Edit size={14} className="mr-1" /> Edit
        </Button>
        <div className="space-x-2">
          {module.status === "draft" ? (
            <Button
              size="sm"
              className="gradient-primary"
              onClick={() => handleUpdateModuleStatus(module.id, "active")}
            >
              <Check size={14} className="mr-1" /> Publish
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdateModuleStatus(module.id, "draft")}
            >
              <Clock size={14} className="mr-1" /> Unpublish
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  // Custom container for user table
  const renderUserTableContainer = (items: React.ReactNode[]) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all platform users</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Custom container for feedback table
  const renderFeedbackTableContainer = (items: React.ReactNode[]) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users size={16} className="mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 size={16} className="mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare size={16} className="mr-2" /> Feedback
          </TabsTrigger>
          <TabsTrigger value="training">
            <FileText size={16} className="mr-2" /> Training
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <PaginationContainer
            data={filteredUsers}
            itemsPerPage={5}
            renderItem={renderUserRow}
            renderContainer={renderUserTableContainer}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>All registered users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{users.length}</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">+12% this month</Badge>
                  <span>vs. last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Placements</CardTitle>
                <CardDescription>Current caregiver placements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">42</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">+8% this month</Badge>
                  <span>vs. last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certification Rate</CardTitle>
                <CardDescription>Caregivers who completed training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">78%</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">+5% this month</Badge>
                  <span>vs. last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart size={64} className="mx-auto text-primary/30" />
                <p className="mt-4 text-muted-foreground">
                  Analytics chart would render here with real data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <PaginationContainer
            data={feedbacks}
            itemsPerPage={5}
            renderItem={renderFeedbackRow}
            renderContainer={renderFeedbackTableContainer}
          />
        </TabsContent>

        {/* Training Modules Tab */}
        <TabsContent value="training" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <h3 className="text-lg font-medium">Training Modules</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gradient-primary md:w-auto">
                  <Plus size={16} className="mr-2" /> Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Training Module</DialogTitle>
                  <DialogDescription>
                    Add a new training module for caregivers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Module Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter module title" 
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter module description" 
                      value={newModuleDescription}
                      onChange={(e) => setNewModuleDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="gradient-primary w-full" onClick={handleAddModule}>
                    Create Module
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <PaginationContainer
            data={trainingModules}
            itemsPerPage={4}
            renderItem={renderTrainingModule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 
