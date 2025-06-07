import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
  Users,
} from "lucide-react";

interface Case {
  id: string;
  caregiverName: string;
  caregiverId: string;
  patientName: string;
  patientAge: number;
  condition: string;
  assignedDate: string;
  status: "ongoing" | "completed" | "new";
  lastSessionDate?: string;
  nextSessionDate?: string;
}

interface Note {
  id: string;
  caseId: string;
  date: string;
  content: string;
  type: "session" | "assessment" | "recommendation";
}

interface Message {
  id: string;
  sender: "counselor" | "caregiver";
  content: string;
  timestamp: string;
}

const CounselorDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cases");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] = useState<"session" | "assessment" | "recommendation">("session");
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Mock data for cases
  const [cases, setCases] = useState<Case[]>([
    {
      id: "case-1",
      caregiverName: "Priya Sharma",
      caregiverId: "cg-1",
      patientName: "Raj Malhotra",
      patientAge: 72,
      condition: "Post-stroke recovery, Depression",
      assignedDate: "2023-10-15",
      status: "ongoing",
      lastSessionDate: "2023-11-10",
      nextSessionDate: "2023-11-25",
    },
    {
      id: "case-2",
      caregiverName: "Rajesh Kumar",
      caregiverId: "cg-2",
      patientName: "Anita Desai",
      patientAge: 68,
      condition: "Early dementia, Anxiety",
      assignedDate: "2023-09-28",
      status: "ongoing",
      lastSessionDate: "2023-11-05",
      nextSessionDate: "2023-11-19",
    },
    {
      id: "case-3",
      caregiverName: "Neha Patel",
      caregiverId: "cg-3",
      patientName: "Suresh Patel",
      patientAge: 85,
      condition: "Chronic loneliness, Mild depression",
      assignedDate: "2023-11-02",
      status: "new",
    },
    {
      id: "case-4",
      caregiverName: "Vikram Singh",
      caregiverId: "cg-4",
      patientName: "Meena Gupta",
      patientAge: 78,
      condition: "Parkinson's, Severe anxiety",
      assignedDate: "2023-10-10",
      status: "completed",
      lastSessionDate: "2023-11-08",
    },
  ]);

  // Mock data for notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      caseId: "case-1",
      date: "2023-11-10",
      content: "Patient showing signs of improvement in mood. Caregiver reports more engagement in daily activities and better sleep patterns. Recommended continuing with the current approach of morning walks and social engagement.",
      type: "session",
    },
    {
      id: "note-2",
      caseId: "case-1",
      date: "2023-10-25",
      content: "Initial assessment: Patient displays moderate depression symptoms following stroke. Limited mobility is affecting mental health. Caregiver seems well-equipped but needs guidance on encouraging patient independence.",
      type: "assessment",
    },
    {
      id: "note-3",
      caseId: "case-2",
      date: "2023-11-05",
      content: "Memory exercises showing little effect. Patient becomes frustrated with memory lapses. Anxiety is more prominent in the evenings. Caregiver needs additional support in managing evening routines.",
      type: "session",
    },
    {
      id: "note-4",
      caseId: "case-2",
      date: "2023-10-20",
      content: "Recommend implementing a strict daily routine to help with memory and reduce anxiety. Suggest memory games for 15 minutes daily and keeping a daily journal with caregiver's help.",
      type: "recommendation",
    },
  ]);

  // Mock data for messages
  const [chats, setChats] = useState<{ [key: string]: Message[] }>({
    "cg-1": [
      {
        id: "msg-1",
        sender: "caregiver",
        content: "Hello, I'm having trouble with Mr. Malhotra's evening routine. He becomes agitated around 7 PM every day. Any suggestions?",
        timestamp: "2023-11-12 14:35",
      },
      {
        id: "msg-2",
        sender: "counselor",
        content: "Hi Priya, this sounds like 'sundowning', which is common. Try dimming the lights earlier, reducing noise, and establishing a calming routine starting around 6 PM. Let's discuss more in our next session.",
        timestamp: "2023-11-12 15:10",
      },
      {
        id: "msg-3",
        sender: "caregiver",
        content: "That makes sense. I'll try adjusting the lighting and creating a quieter environment. Thanks for the quick response!",
        timestamp: "2023-11-12 15:25",
      },
    ],
    "cg-2": [
      {
        id: "msg-4",
        sender: "counselor",
        content: "Hi Rajesh, following up on our session yesterday. How did the memory exercise go with Mrs. Desai?",
        timestamp: "2023-11-06 10:15",
      },
      {
        id: "msg-5",
        sender: "caregiver",
        content: "Good morning. The exercises went better than expected. She remembered 3 out of 5 items today, which is improvement. Still struggling with the evening anxiety though.",
        timestamp: "2023-11-06 11:30",
      },
      {
        id: "msg-6",
        sender: "counselor",
        content: "That's excellent progress! For the evening anxiety, have you tried the lavender essential oil diffuser we discussed? Several studies show it can help reduce anxiety in dementia patients.",
        timestamp: "2023-11-06 11:45",
      },
    ],
  });

  // Function to handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCase) {
      toast({
        title: "Error",
        description: "Please enter note content before saving.",
        variant: "destructive",
      });
      return;
    }

    const newNoteObj: Note = {
      id: `note-${notes.length + 1}`,
      caseId: selectedCase.id,
      date: new Date().toISOString().split('T')[0],
      content: newNote,
      type: newNoteType,
    };

    setNotes([newNoteObj, ...notes]);
    setNewNote("");
    
    toast({
      title: "Note Added",
      description: "Your note has been saved successfully.",
    });
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) {
      return;
    }

    const newMsg: Message = {
      id: `msg-${Math.random().toString(36).substring(7)}`,
      sender: "counselor",
      content: newMessage,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', ''),
    };

    setChats({
      ...chats,
      [activeChat]: [...(chats[activeChat] || []), newMsg],
    });

    setNewMessage("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the caregiver.",
    });
  };

  // Filter cases based on search term
  const filteredCases = cases.filter(c => 
    c.caregiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get notes for selected case
  const caseNotes = selectedCase 
    ? notes.filter(note => note.caseId === selectedCase.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Get active chat messages
  const activeMessages = activeChat ? chats[activeChat] || [] : [];

  // Get caregivers for chat
  const chatCaregivers = cases.map(c => ({
    id: c.caregiverId,
    name: c.caregiverName,
    patientName: c.patientName,
    hasUnread: c.caregiverId === "cg-3", // Just for demo
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Counselor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage cases, track mental wellness, and provide guidance
        </p>
      </div>

      <Tabs defaultValue="cases" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="cases">
            <Users size={16} className="mr-2" /> Cases
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText size={16} className="mr-2" /> Notes
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare size={16} className="mr-2" /> Chat
          </TabsTrigger>
        </TabsList>

        {/* Cases Tab */}
        <TabsContent value="cases" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search cases by caregiver, patient, or condition..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gradient-primary md:w-auto">
              <Plus size={16} className="mr-2" /> Add Case
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className={
                caseItem.status === "new" ? "border-2 border-primary/20" : ""
              }>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{caseItem.patientName}</CardTitle>
                      <CardDescription>
                        {caseItem.patientAge} years • Caregiver: {caseItem.caregiverName}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        caseItem.status === "ongoing" ? "default" : 
                        caseItem.status === "new" ? "secondary" : "outline"
                      }
                    >
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Condition: </span>
                    {caseItem.condition}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Assigned: </span>
                    {caseItem.assignedDate}
                  </div>
                  
                  {caseItem.status !== "new" && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="flex items-center text-muted-foreground">
                          <Clock size={14} className="mr-1" /> Last Session
                        </span>
                        <span>{caseItem.lastSessionDate}</span>
                      </div>
                      {caseItem.status === "ongoing" && caseItem.nextSessionDate && (
                        <div>
                          <span className="flex items-center text-muted-foreground">
                            <Calendar size={14} className="mr-1" /> Next Session
                          </span>
                          <span>{caseItem.nextSessionDate}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button 
                      className="flex-1 gradient-primary"
                      onClick={() => {
                        setSelectedCase(caseItem);
                        setActiveTab("notes");
                      }}
                    >
                      <FileText size={16} className="mr-2" /> View Notes
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setActiveChat(caseItem.caregiverId);
                        setActiveTab("chat");
                      }}
                    >
                      <MessageSquare size={16} className="mr-2" /> Chat
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          {selectedCase ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedCase.patientName}'s Notes</h2>
                  <p className="text-muted-foreground">
                    Caregiver: {selectedCase.caregiverName} • Condition: {selectedCase.condition}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCase(null);
                    setActiveTab("cases");
                  }}
                >
                  Back to Cases
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button 
                      variant={newNoteType === "session" ? "default" : "outline"} 
                      className={newNoteType === "session" ? "gradient-primary" : ""}
                      onClick={() => setNewNoteType("session")}
                    >
                      Session Note
                    </Button>
                    <Button 
                      variant={newNoteType === "assessment" ? "default" : "outline"} 
                      className={newNoteType === "assessment" ? "gradient-primary" : ""}
                      onClick={() => setNewNoteType("assessment")}
                    >
                      Assessment
                    </Button>
                    <Button 
                      variant={newNoteType === "recommendation" ? "default" : "outline"} 
                      className={newNoteType === "recommendation" ? "gradient-primary" : ""}
                      onClick={() => setNewNoteType("recommendation")}
                    >
                      Recommendation
                    </Button>
                  </div>
                  
                  <Textarea 
                    placeholder="Enter your note content here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-32"
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gradient-primary"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Previous Notes</h3>
                
                {caseNotes.length > 0 ? (
                  caseNotes.map((note) => (
                    <Card key={note.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge variant={
                              note.type === "session" ? "default" : 
                              note.type === "assessment" ? "secondary" : "outline"
                            }>
                              {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                            </Badge>
                            <span className="ml-2 text-muted-foreground text-sm">
                              {note.date}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText size={14} className="mr-1" /> Export
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                    <p className="text-muted-foreground">
                      Start by adding your first note for this case.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Brain size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No case selected</h3>
              <p className="text-muted-foreground">
                Please select a case from the Cases tab to view or add notes.
              </p>
              <Button 
                className="mt-4 gradient-primary"
                onClick={() => setActiveTab("cases")}
              >
                Go to Cases
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="flex h-[calc(80vh-6rem)] bg-muted rounded-lg overflow-hidden">
            {/* Chat Sidebar */}
            <div className="w-64 border-r border-border bg-background p-3 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-medium text-sm">Caregivers</h3>
              </div>
              
              <div className="space-y-2">
                {chatCaregivers.map((caregiver) => (
                  <div 
                    key={caregiver.id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                      activeChat === caregiver.id 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted-foreground/10"
                    }`}
                    onClick={() => setActiveChat(caregiver.id)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{caregiver.name}</span>
                        {caregiver.hasUnread && (
                          <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            <span className="text-[10px]">1</span>
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        Patient: {caregiver.patientName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat Main */}
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-border bg-background flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>
                          {chatCaregivers.find(c => c.id === activeChat)?.name.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {chatCaregivers.find(c => c.id === activeChat)?.name || "Caregiver"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Patient: {chatCaregivers.find(c => c.id === activeChat)?.patientName || "Patient"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <User size={16} className="mr-1" /> View Profile
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-background/50">
                    <div className="space-y-4">
                      {activeMessages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender === "counselor" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] ${
                            message.sender === "counselor" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          } rounded-lg p-3 space-y-1`}>
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs opacity-70 text-right">{message.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 border-t border-border bg-background">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type your message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} className="gradient-primary">
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-background/50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <MessageSquare size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a caregiver from the sidebar to start a conversation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselorDashboard;
