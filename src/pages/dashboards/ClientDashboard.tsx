import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Filter, Search, User, Star, Clock, Calendar, MapPin, HeartPulse, MessageSquare } from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  age: number;
  gender: string;
  experience: string;
  rating: number;
  location: string;
  skills: string[];
  bio: string;
  availability: string;
  photo: string;
}

const ClientDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "any",
    skills: [] as string[],
    experience: [0, 10],
    availability: "any",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [issue, setIssue] = useState("");

  // Mock data for caregivers
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: "cg-1",
      name: "Priya Sharma",
      age: 28,
      gender: "Female",
      experience: "3 years",
      rating: 4.8,
      location: "Andheri, Mumbai",
      skills: ["Elderly Care", "Medication Management", "Mobility Assistance"],
      bio: "Compassionate caregiver with 3 years of experience in elderly care, specializing in chronic illness management.",
      availability: "Weekdays, Full-time",
      photo: "/placeholder-avatar.jpg",
    },
    {
      id: "cg-2",
      name: "Rahul Desai",
      age: 32,
      gender: "Male",
      experience: "5 years",
      rating: 4.9,
      location: "Bandra, Mumbai",
      skills: ["Physiotherapy", "Post-Surgery Care", "Dementia Care"],
      bio: "Trained physiotherapist with 5 years of specialized experience in post-surgery recovery and rehabilitation.",
      availability: "Any time, including nights",
      photo: "/placeholder-avatar.jpg",
    },
    {
      id: "cg-3",
      name: "Neha Patel",
      age: 26,
      gender: "Female",
      experience: "2 years",
      rating: 4.5,
      location: "Powai, Mumbai",
      skills: ["Basic Care", "Cooking", "Companionship"],
      bio: "Caring and attentive caregiver focused on providing companionship and basic daily assistance.",
      availability: "Weekends only",
      photo: "/placeholder-avatar.jpg",
    },
  ]);

  // Mock data for current caregiver
  const [currentCaregivers, setCurrentCaregivers] = useState<(Caregiver & { status: string })[]>([
    {
      ...caregivers[0],
      status: "Active - Started 2 weeks ago",
    },
  ]);

  const handleRequestCaregiver = (id: string) => {
    toast({
      title: "Request Sent",
      description: "Your request has been sent to the caregiver. We'll notify you once they respond.",
    });
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setFeedback("");
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly.",
    });
  };

  const handleIssueReport = () => {
    if (!issue.trim()) {
      toast({
        title: "Empty Issue Report",
        description: "Please describe the issue before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIssue("");
    toast({
      title: "Issue Reported",
      description: "Your issue has been reported. Our team will contact you soon.",
    });
  };

  // Filter caregivers based on search term and filters
  const filteredCaregivers = caregivers.filter(caregiver => {
    // Search term filter
    if (searchTerm && !caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !caregiver.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Gender filter
    if (filters.gender !== "any" && caregiver.gender.toLowerCase() !== filters.gender) {
      return false;
    }
    
    // Experience filter
    const expYears = parseInt(caregiver.experience.split(" ")[0]);
    if (expYears < filters.experience[0] || expYears > filters.experience[1]) {
      return false;
    }
    
    // Availability filter
    if (filters.availability !== "any" && 
        !caregiver.availability.toLowerCase().includes(filters.availability.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
        <p className="text-muted-foreground">
          Find and manage caregivers for your loved ones
        </p>
      </div>

      <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="search">
            <Search size={16} className="mr-2" /> Find Caregivers
          </TabsTrigger>
          <TabsTrigger value="current">
            <User size={16} className="mr-2" /> Current Care
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Star size={16} className="mr-2" /> Feedback
          </TabsTrigger>
        </TabsList>

        {/* Search Caregivers Tab */}
        <TabsContent value="search" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, skills, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" /> 
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select 
                    value={filters.gender} 
                    onValueChange={(value) => setFilters({...filters, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select 
                    value={filters.availability} 
                    onValueChange={(value) => setFilters({...filters, availability: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="nights">Night Shifts</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between">
                    <Label>Experience (years)</Label>
                    <span className="text-sm text-muted-foreground">
                      {filters.experience[0]} - {filters.experience[1]} years
                    </span>
                  </div>
                  <Slider 
                    defaultValue={[0, 10]} 
                    max={10} 
                    step={1}
                    value={filters.experience}
                    onValueChange={(value) => setFilters({...filters, experience: value as [number, number]})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCaregivers.map((caregiver) => (
              <Card key={caregiver.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                        <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <CardTitle>{caregiver.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {caregiver.location}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {caregiver.gender}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                      <span className="font-medium">{caregiver.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Clock size={14} className="inline mr-1" />
                      {caregiver.experience}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {caregiver.bio}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {caregiver.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={14} className="mr-1" />
                    Available: {caregiver.availability}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full gradient-primary"
                    onClick={() => handleRequestCaregiver(caregiver.id)}
                  >
                    Request Caregiver
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCaregivers.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Search size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No caregivers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more caregivers.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Current Caregivers Tab */}
        <TabsContent value="current" className="space-y-4">
          {currentCaregivers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {currentCaregivers.map((caregiver) => (
                <Card key={caregiver.id} className="border-2 border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                          <img src={caregiver.photo} alt={caregiver.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <CardTitle>{caregiver.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {caregiver.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {caregiver.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="flex items-center text-muted-foreground">
                          <Calendar size={14} className="mr-1" /> Schedule
                        </span>
                        <span>{caregiver.availability}</span>
                      </div>
                      <div>
                        <span className="flex items-center text-muted-foreground">
                          <MapPin size={14} className="mr-1" /> Location
                        </span>
                        <span>{caregiver.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1">
                      <MessageSquare size={16} className="mr-2" /> Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <HeartPulse size={16} className="mr-2" /> Health Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <User size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No active caregivers</h3>
              <p className="text-muted-foreground">
                You don't have any caregivers assigned yet. Go to the "Find Caregivers" tab to request one.
              </p>
              <Button 
                className="mt-4 gradient-primary"
                onClick={() => setActiveTab("search")}
              >
                Find Caregivers
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>
                  Share your experience and help us improve our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Tell us about your experience..." 
                    className="min-h-32"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gradient-primary"
                  onClick={handleFeedbackSubmit}
                >
                  Submit Feedback
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report an Issue</CardTitle>
                <CardDescription>
                  Let us know if you're facing any problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="issue">Describe the Issue</Label>
                  <Textarea 
                    id="issue" 
                    placeholder="What issues are you facing?" 
                    className="min-h-32"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleIssueReport}
                >
                  Report Issue
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard; 
