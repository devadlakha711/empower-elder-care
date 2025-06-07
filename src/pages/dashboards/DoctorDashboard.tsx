import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  History, 
  MessageSquare, 
  Plus, 
  Search, 
  User, 
  UserPlus 
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  caregiverName: string;
  caregiverId: string;
  condition: string;
  lastCheckup: string;
  nextCheckup: string;
  status: "stable" | "needs-attention" | "critical";
}

interface HealthReport {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  notes: string;
  caregiverNotes: string;
  doctorFeedback: string;
}

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctorFeedback, setDoctorFeedback] = useState("");
  const [carePlanNotes, setCarePlanNotes] = useState("");

  // Mock data for patients
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "p1",
      name: "Raj Malhotra",
      age: 72,
      caregiverName: "Priya Sharma",
      caregiverId: "cg-1",
      condition: "Post-stroke recovery, Hypertension",
      lastCheckup: "2023-11-10",
      nextCheckup: "2023-12-10",
      status: "stable",
    },
    {
      id: "p2",
      name: "Anita Desai",
      age: 68,
      caregiverName: "Rajesh Kumar",
      caregiverId: "cg-2",
      condition: "Arthritis, Early dementia",
      lastCheckup: "2023-11-05",
      nextCheckup: "2023-11-20",
      status: "needs-attention",
    },
    {
      id: "p3",
      name: "Suresh Patel",
      age: 85,
      caregiverName: "Neha Patel",
      caregiverId: "cg-3",
      condition: "Diabetes, Heart disease",
      lastCheckup: "2023-11-12",
      nextCheckup: "2023-11-26",
      status: "stable",
    },
    {
      id: "p4",
      name: "Meena Gupta",
      age: 78,
      caregiverName: "Vikram Singh",
      caregiverId: "cg-4",
      condition: "Parkinson's, Osteoporosis",
      lastCheckup: "2023-10-30",
      nextCheckup: "2023-11-18",
      status: "critical",
    },
  ]);

  // Mock data for health reports
  const [healthReports, setHealthReports] = useState<HealthReport[]>([
    {
      id: "hr-1",
      patientId: "p1",
      patientName: "Raj Malhotra",
      date: "2023-11-10",
      bloodPressure: "138/85",
      heartRate: "78 bpm",
      temperature: "36.8°C",
      weight: "68 kg",
      notes: "Patient recovering well. Following medication schedule properly.",
      caregiverNotes: "Patient has been eating well and taking short walks in the garden daily.",
      doctorFeedback: "Continue with current medication. Increase daily walking time gradually.",
    },
    {
      id: "hr-2",
      patientId: "p2",
      patientName: "Anita Desai",
      date: "2023-11-05",
      bloodPressure: "145/90",
      heartRate: "82 bpm",
      temperature: "37.1°C",
      weight: "62 kg",
      notes: "Patient experiencing increased joint pain. Memory issues more noticeable.",
      caregiverNotes: "Having trouble remembering to take morning medication. Needs reminders.",
      doctorFeedback: "",
    },
    {
      id: "hr-3",
      patientId: "p3",
      patientName: "Suresh Patel",
      date: "2023-11-12",
      bloodPressure: "130/80",
      heartRate: "72 bpm",
      temperature: "36.6°C",
      weight: "70 kg",
      notes: "Blood sugar levels stabilized. No chest pain reported in the last week.",
      caregiverNotes: "Following diet plan strictly. Taking all medications on time.",
      doctorFeedback: "Blood work looks good. Continue with current treatment plan.",
    },
    {
      id: "hr-4",
      patientId: "p4",
      patientName: "Meena Gupta",
      date: "2023-10-30",
      bloodPressure: "160/95",
      heartRate: "90 bpm",
      temperature: "38.0°C",
      weight: "55 kg",
      notes: "Patient showing signs of respiratory infection. Tremors have increased.",
      caregiverNotes: "Having difficulty sleeping at night. Loss of appetite for the past 3 days.",
      doctorFeedback: "",
    },
  ]);

  // Function to handle doctor feedback submission
  const handleFeedbackSubmit = (reportId: string) => {
    if (!doctorFeedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Update the health report with doctor's feedback
    setHealthReports(healthReports.map(report => 
      report.id === reportId ? { ...report, doctorFeedback } : report
    ));
    
    setDoctorFeedback("");
    
    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been sent to the caregiver.",
    });
  };

  // Function to handle care plan submission
  const handleCarePlanSubmit = (patientId: string) => {
    if (!carePlanNotes.trim()) {
      toast({
        title: "Error",
        description: "Please enter care plan details before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setCarePlanNotes("");
    setSelectedPatient(null);
    
    toast({
      title: "Care Plan Updated",
      description: "The patient's care plan has been updated successfully.",
    });
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.caregiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get health reports for selected patient
  const patientReports = selectedPatient 
    ? healthReports.filter(report => report.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage patient health reports and provide care guidance
        </p>
      </div>

      <Tabs defaultValue="patients" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="patients">
            <User size={16} className="mr-2" /> Patients
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText size={16} className="mr-2" /> Health Reports
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare size={16} className="mr-2" /> Caregiver Feedback
          </TabsTrigger>
        </TabsList>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search patients by name, caregiver, or condition..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gradient-primary md:w-auto">
              <UserPlus size={16} className="mr-2" /> Add Patient
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className={
                patient.status === "critical" ? "border-2 border-red-200" :
                patient.status === "needs-attention" ? "border-2 border-amber-200" : ""
              }>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{patient.name}</CardTitle>
                      <CardDescription>
                        {patient.age} years • Caregiver: {patient.caregiverName}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        patient.status === "stable" ? "outline" : 
                        patient.status === "needs-attention" ? "secondary" : "destructive"
                      }
                    >
                      {patient.status === "stable" ? "Stable" : 
                       patient.status === "needs-attention" ? "Needs Attention" : "Critical"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Condition: </span>
                    {patient.condition}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="flex items-center text-muted-foreground">
                        <History size={14} className="mr-1" /> Last Checkup
                      </span>
                      <span>{patient.lastCheckup}</span>
                    </div>
                    <div>
                      <span className="flex items-center text-muted-foreground">
                        <Calendar size={14} className="mr-1" /> Next Checkup
                      </span>
                      <span>{patient.nextCheckup}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Dialog 
                      open={selectedPatient?.id === patient.id} 
                      onOpenChange={(open) => {
                        if (!open) setSelectedPatient(null);
                        else setSelectedPatient(patient);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex-1 gradient-primary">
                          <FileText size={16} className="mr-2" /> View Reports
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Health Reports: {patient.name}</DialogTitle>
                          <DialogDescription>
                            {patient.age} years • {patient.condition}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto">
                          {patientReports.length > 0 ? (
                            <div className="space-y-4">
                              {patientReports.map((report) => (
                                <Card key={report.id}>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-base">Report: {report.date}</CardTitle>
                                      <Badge variant="outline">
                                        <Clock size={14} className="mr-1" /> {report.date}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pb-2 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="bg-muted rounded-lg p-3 text-center">
                                        <div className="text-muted-foreground text-xs mb-1">Blood Pressure</div>
                                        <div className="font-medium">{report.bloodPressure}</div>
                                      </div>
                                      <div className="bg-muted rounded-lg p-3 text-center">
                                        <div className="text-muted-foreground text-xs mb-1">Heart Rate</div>
                                        <div className="font-medium">{report.heartRate}</div>
                                      </div>
                                      <div className="bg-muted rounded-lg p-3 text-center">
                                        <div className="text-muted-foreground text-xs mb-1">Temperature</div>
                                        <div className="font-medium">{report.temperature}</div>
                                      </div>
                                      <div className="bg-muted rounded-lg p-3 text-center">
                                        <div className="text-muted-foreground text-xs mb-1">Weight</div>
                                        <div className="font-medium">{report.weight}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="text-sm font-medium">Notes</div>
                                      <div className="bg-muted p-3 rounded-lg text-sm">
                                        {report.notes}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="text-sm font-medium">Caregiver Notes</div>
                                      <div className="bg-muted p-3 rounded-lg text-sm">
                                        {report.caregiverNotes}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="text-sm font-medium">Your Feedback</div>
                                      {report.doctorFeedback ? (
                                        <div className="bg-primary/10 p-3 rounded-lg text-sm">
                                          {report.doctorFeedback}
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <Textarea 
                                            placeholder="Enter your feedback and instructions for the caregiver..."
                                            value={doctorFeedback}
                                            onChange={(e) => setDoctorFeedback(e.target.value)}
                                          />
                                          <Button 
                                            className="w-full gradient-primary"
                                            onClick={() => handleFeedbackSubmit(report.id)}
                                          >
                                            Submit Feedback
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <FileText size={20} className="text-primary" />
                              </div>
                              <h3 className="text-lg font-medium mb-2">No reports available</h3>
                              <p className="text-muted-foreground">
                                There are no health reports for this patient yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Plus size={16} className="mr-2" /> Care Plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Care Plan</DialogTitle>
                          <DialogDescription>
                            Create or update the care plan for {patient.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Care Plan Notes</div>
                            <Textarea 
                              placeholder="Enter detailed care instructions, medication changes, and recommendations..."
                              value={carePlanNotes}
                              onChange={(e) => setCarePlanNotes(e.target.value)}
                              className="min-h-32"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            className="gradient-primary w-full"
                            onClick={() => handleCarePlanSubmit(patient.id)}
                          >
                            Update Care Plan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Health Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Reports</CardTitle>
              <CardDescription>
                View and respond to the latest health reports from caregivers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vitals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.patientName}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Heart size={14} className="mr-1 text-rose-500" />
                          <span>{report.bloodPressure}, {report.heartRate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          report.patientId === "p4" ? "destructive" : 
                          report.patientId === "p2" ? "secondary" : "outline"
                        }>
                          {report.patientId === "p4" ? "Critical" : 
                           report.patientId === "p2" ? "Needs Attention" : "Stable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const patient = patients.find(p => p.id === report.patientId);
                            if (patient) {
                              setSelectedPatient(patient);
                              setActiveTab("patients");
                            }
                          }}
                        >
                          {report.doctorFeedback ? "View Feedback" : "Add Feedback"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>
                Patient health metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity size={64} className="mx-auto text-primary/30" />
                <p className="mt-4 text-muted-foreground">
                  Health trend charts would render here with real data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Caregiver Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Caregiver Performance</CardTitle>
              <CardDescription>
                Provide feedback and training recommendations to caregivers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caregiver</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Last Report</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Priya Sharma</TableCell>
                    <TableCell>Raj Malhotra</TableCell>
                    <TableCell>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>2023-11-10</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Send Feedback</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rajesh Kumar</TableCell>
                    <TableCell>Anita Desai</TableCell>
                    <TableCell>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 3 ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>2023-11-05</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Send Feedback</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Neha Patel</TableCell>
                    <TableCell>Suresh Patel</TableCell>
                    <TableCell>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 5 ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>2023-11-12</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Send Feedback</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Vikram Singh</TableCell>
                    <TableCell>Meena Gupta</TableCell>
                    <TableCell>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 3 ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>2023-10-30</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Send Feedback</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Recommendations</CardTitle>
              <CardDescription>
                Suggest additional training modules for caregivers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Rajesh Kumar</div>
                  <Button size="sm" className="gradient-primary">Send Recommendation</Button>
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  Recommend <span className="font-medium">Memory Care Advanced Training</span> module to better support patients with early dementia.
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Vikram Singh</div>
                  <Button size="sm" className="gradient-primary">Send Recommendation</Button>
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  Recommend <span className="font-medium">Critical Patient Care</span> and <span className="font-medium">Emergency Response</span> modules for improvement in handling critical patients.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
