import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, FileText, Award, MapPin, Calendar, User, Star, PlayCircle } from "lucide-react";
import { FeedbackForm } from "@/components/ui/FeedbackForm";
import { useNotifications } from "@/context/NotificationContext";
import PaginationContainer from "@/components/ui/PaginationContainer";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  duration: string;
  videoLink: string;
}

interface PlacementOffer {
  id: string;
  clientName: string;
  location: string;
  schedule: string;
  duration: string;
  payRate: string;
  status: "pending" | "accepted" | "declined";
}

const CaregiverDashboard = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("training");
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: "mod-1",
      title: "Basic Elderly Care Fundamentals",
      description: "Learn the basics of elderly care including mobility assistance, hygiene management, and diet supervision.",
      progress: 100,
      completed: true,
      duration: "4 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-2",
      title: "Medication Management",
      description: "Understanding medication schedules, proper administration, and monitoring side effects.",
      progress: 65,
      completed: false,
      duration: "3 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-3",
      title: "Emergency Response",
      description: "How to handle medical emergencies, falls, and when to call professional help.",
      progress: 40,
      completed: false,
      duration: "2 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-4",
      title: "Cognitive Health & Memory Care",
      description: "Techniques for supporting patients with dementia, Alzheimer's, and other cognitive conditions.",
      progress: 0,
      completed: false,
      duration: "5 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-5",
      title: "Physical Therapy Basics",
      description: "Learn simple physical therapy exercises to help elderly patients maintain mobility.",
      progress: 0,
      completed: false,
      duration: "4 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-6",
      title: "Nutrition and Diet Planning",
      description: "Understanding nutritional needs of elderly patients and how to prepare appropriate meals.",
      progress: 0,
      completed: false,
      duration: "3 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-7",
      title: "Communication Skills",
      description: "Effective communication techniques for elderly patients with hearing or cognitive impairments.",
      progress: 0,
      completed: false,
      duration: "2 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: "mod-8",
      title: "End-of-Life Care",
      description: "Understanding palliative care principles and providing comfort for patients at end of life.",
      progress: 0,
      completed: false,
      duration: "4 hours",
      videoLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
  ]);

  const [placements, setPlacements] = useState<PlacementOffer[]>([
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
    {
      id: "place-4",
      clientName: "Dr. Mehta",
      location: "Juhu, Mumbai",
      schedule: "Tue & Thu, 10AM-4PM",
      duration: "6 months",
      payRate: "₹18,000/month",
      status: "pending",
    },
    {
      id: "place-5",
      clientName: "Khan Family",
      location: "Colaba, Mumbai",
      schedule: "Mon-Wed-Fri, 2PM-8PM",
      duration: "2 months",
      payRate: "₹15,000/month",
      status: "accepted",
    },
    {
      id: "place-6",
      clientName: "Mrs. Iyer",
      location: "Dadar, Mumbai",
      schedule: "Full-time, live-in",
      duration: "3 months",
      payRate: "₹30,000/month",
      status: "declined",
    },
    {
      id: "place-7",
      clientName: "Kapoor Family",
      location: "Worli, Mumbai",
      schedule: "Part-time, mornings",
      duration: "Ongoing",
      payRate: "₹12,000/month",
      status: "pending",
    },
  ]);

  // Calculate certification status
  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const certificationProgress = Math.floor((completedModules / totalModules) * 100);
  const isCertified = certificationProgress === 100;

  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  // Handlers
  const handleModuleClick = (moduleId: string) => {
    toast({
      title: "Module Launched",
      description: "The training module content would open here.",
    });
  };

  const handlePlacementResponse = (placementId: string, accept: boolean) => {
    setPlacements(prev => 
      prev.map(p => 
        p.id === placementId 
          ? { ...p, status: accept ? "accepted" : "declined" } 
          : p
      )
    );

    toast({
      title: accept ? "Placement Accepted" : "Placement Declined",
      description: accept 
        ? "You've accepted this placement. The client will be notified."
        : "You've declined this placement. We'll find you other opportunities.",
    });

    // Add notification
    addNotification({
      title: accept ? "Placement Accepted" : "Placement Declined",
      message: accept 
        ? "You've accepted a placement offer. Check your placements tab for details."
        : "You've declined a placement offer. We'll find other opportunities for you.",
      type: "info",
    });
  };

  // Handle feedback submission from the FeedbackForm component
  const handleFeedbackSubmit = async (data: any) => {
    console.log("Feedback submitted:", data);
    
    // Add notification about feedback submission
    addNotification({
      title: "Feedback Submitted",
      message: "Thank you for your feedback! Our team will review it shortly.",
      type: "success",
    });
  };

  // Handle issue report from the FeedbackForm component
  const handleIssueSubmit = async (data: any) => {
    console.log("Issue reported:", data);
    
    // Add notification about issue submission
    addNotification({
      title: "Issue Reported",
      message: "Your issue has been reported. Our support team will contact you soon.",
      type: "info",
    });
  };

  const handleContinueLearning = (videoLink: string) => {
    setSelectedVideo(videoLink);
    setVideoOpen(true);
  };

  // Render a training module card
  const renderTrainingModule = (module: TrainingModule, index: number) => (
    <Card key={module.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>{module.title}</CardTitle>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Progress: {module.progress}%
          </span>
          <span className="text-sm text-muted-foreground">
            <Clock size={14} className="inline mr-1" />
            {module.duration}
          </span>
        </div>
        <Progress value={module.progress} className="h-2" />
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => handleContinueLearning(module.videoLink)}
          disabled={module.completed}
          variant={module.completed ? "outline" : "default"}
          className={module.completed ? "w-full" : "w-full gradient-primary"}
        >
          <PlayCircle size={16} className="mr-2" />
          {module.completed ? "Completed" : "Continue Learning"}
        </Button>
      </CardFooter>
    </Card>
  );

  // Render a placement offer card
  const renderPlacementOffer = (placement: PlacementOffer, index: number) => (
    <Card key={placement.id} className={placement.status !== "pending" ? 
      "border-2 " + (placement.status === "accepted" ? "border-green-200" : "border-red-200") : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{placement.clientName}</CardTitle>
          {placement.status !== "pending" && (
            <Badge variant={placement.status === "accepted" ? "default" : "destructive"}>
              {placement.status === "accepted" ? "Accepted" : "Declined"}
            </Badge>
          )}
        </div>
        <CardDescription>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" /> {placement.location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="flex items-center text-muted-foreground">
              <Calendar size={14} className="mr-1" /> Schedule
            </span>
            <span>{placement.schedule}</span>
          </div>
          <div>
            <span className="flex items-center text-muted-foreground">
              <Clock size={14} className="mr-1" /> Duration
            </span>
            <span>{placement.duration}</span>
          </div>
        </div>
        <div>
          <span className="text-lg font-bold">{placement.payRate}</span>
        </div>
      </CardContent>
      {placement.status === "pending" && (
        <CardFooter className="flex gap-2">
          <Button 
            className="flex-1 gradient-primary"
            onClick={() => handlePlacementResponse(placement.id, true)}
          >
            <Check size={16} className="mr-1" /> Accept
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handlePlacementResponse(placement.id, false)}
          >
            <X size={16} className="mr-1" /> Decline
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caregiver Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your training, certifications, and job placements
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant={isCertified ? "default" : "outline"} className="px-3 py-1">
            {isCertified ? (
              <><Check size={14} className="mr-1" /> Certified</>
            ) : (
              <><Clock size={14} className="mr-1" /> Certification in Progress</>
            )}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="training" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="training">
            <FileText size={16} className="mr-2" /> Training
          </TabsTrigger>
          <TabsTrigger value="certification">
            <Award size={16} className="mr-2" /> Certification
          </TabsTrigger>
          <TabsTrigger value="placements">
            <MapPin size={16} className="mr-2" /> Placements
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Star size={16} className="mr-2" /> Feedback
          </TabsTrigger>
        </TabsList>

        {/* Training Modules Tab */}
        <TabsContent value="training" className="space-y-4">
          <PaginationContainer
            data={modules}
            itemsPerPage={4}
            renderItem={renderTrainingModule}
          />
        </TabsContent>

        {/* Certification Tab */}
        <TabsContent value="certification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certification Status</CardTitle>
              <CardDescription>Track your progress towards becoming a certified caregiver</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Overall Progress</span>
                  <span>{certificationProgress}%</span>
                </div>
                <Progress value={certificationProgress} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Requirements:</h3>
                <ul className="space-y-2">
                  {modules.map((module) => (
                    <li key={module.id} className="flex items-start space-x-2">
                      <div className={`mt-0.5 rounded-full p-1 ${
                        module.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {module.completed ? <Check size={14} /> : <Clock size={14} />}
                      </div>
                      <div>
                        <p className={module.completed ? "text-green-600 font-medium" : ""}>
                          {module.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {module.completed ? "Completed" : `In progress - ${module.progress}%`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              {isCertified ? (
                <Button className="w-full gradient-primary">
                  <Award size={16} className="mr-2" /> Download Certificate
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <Clock size={16} className="mr-2" /> Certificate Pending
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Placements Tab */}
        <TabsContent value="placements" className="space-y-4">
          <PaginationContainer
            data={placements}
            itemsPerPage={4}
            renderItem={renderPlacementOffer}
          />
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* General Feedback Form */}
            <FeedbackForm 
              title="Submit Feedback"
              description="Share your experience and help us improve our services"
              defaultCategory="general"
              onSubmitFeedback={handleFeedbackSubmit}
            />

            {/* Issue Report Form */}
            <FeedbackForm 
              title="Report an Issue"
              description="Let us know if you're facing any problems"
              defaultCategory="technical"
              onSubmitFeedback={handleIssueSubmit}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Training Video</DialogTitle>
            <DialogDescription>
              Watch this video to continue your training module
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video mt-2">
            {selectedVideo && (
              <iframe 
                className="w-full h-full"
                src={selectedVideo.replace("watch?v=", "embed/")}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaregiverDashboard; 
