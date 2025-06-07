import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  AlertCircle,
  Check,
  Database,
  Download,
  ExternalLink,
  FileText,
  RefreshCw,
  Server,
  Settings,
  WifiOff
} from "lucide-react";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  source: string;
  message: string;
}

const TechDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("system");

  // Mock data for system metrics
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: "m1",
      name: "Server Uptime",
      value: 99.98,
      status: "healthy",
      trend: "stable",
    },
    {
      id: "m2",
      name: "API Response Time",
      value: 245,
      status: "healthy",
      trend: "down",
    },
    {
      id: "m3",
      name: "Database Load",
      value: 68,
      status: "warning",
      trend: "up",
    },
    {
      id: "m4",
      name: "Storage Usage",
      value: 42,
      status: "healthy",
      trend: "up",
    },
    {
      id: "m5",
      name: "Memory Usage",
      value: 78,
      status: "warning",
      trend: "up",
    },
    {
      id: "m6",
      name: "Daily Active Users",
      value: 1452,
      status: "healthy",
      trend: "up",
    },
  ]);

  // Mock data for integrations
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "i1",
      name: "Learning Management System",
      type: "API",
      status: "connected",
      lastSync: "2023-11-15 08:30:15",
    },
    {
      id: "i2",
      name: "Zoho CRM",
      type: "OAuth 2.0",
      status: "connected",
      lastSync: "2023-11-15 09:15:22",
    },
    {
      id: "i3",
      name: "Payment Gateway",
      type: "API",
      status: "connected",
      lastSync: "2023-11-15 07:45:10",
    },
    {
      id: "i4",
      name: "SMS Gateway",
      type: "Webhook",
      status: "disconnected",
      lastSync: "2023-11-10 18:20:45",
    },
    {
      id: "i5",
      name: "Email Service",
      type: "SMTP",
      status: "error",
      lastSync: "2023-11-14 22:10:33",
    },
  ]);

  // Mock data for logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log1",
      timestamp: "2023-11-15 10:15:23",
      level: "error",
      source: "PaymentService",
      message: "Failed to process payment for user ID 4532: Gateway timeout",
    },
    {
      id: "log2",
      timestamp: "2023-11-15 09:58:12",
      level: "warning",
      source: "UserService",
      message: "Multiple failed login attempts for account: rajesh@example.com",
    },
    {
      id: "log3",
      timestamp: "2023-11-15 09:45:30",
      level: "info",
      source: "CertificationService",
      message: "New certificate issued to caregiver ID 345",
    },
    {
      id: "log4",
      timestamp: "2023-11-15 09:30:15",
      level: "info",
      source: "EmailService",
      message: "Daily report email sent to admin@shatam.org",
    },
    {
      id: "log5",
      timestamp: "2023-11-15 09:15:22",
      level: "warning",
      source: "StorageService",
      message: "Storage usage approaching 80% threshold",
    },
    {
      id: "log6",
      timestamp: "2023-11-15 09:02:45",
      level: "error",
      source: "DatabaseService",
      message: "Connection pool exhausted - increasing capacity",
    },
    {
      id: "log7",
      timestamp: "2023-11-15 08:50:18",
      level: "info",
      source: "MatchingService",
      message: "New caregiver-client match created #12456",
    },
  ]);

  // Function to restart a service
  const handleRestartService = (serviceId: string) => {
    toast({
      title: "Service Restarting",
      description: `Service ${serviceId} is being restarted. This may take a few moments.`,
    });
    
    // Simulating service restart
    setTimeout(() => {
      toast({
        title: "Service Restarted",
        description: `Service ${serviceId} has been successfully restarted.`,
      });
    }, 2000);
  };

  // Function to reconnect an integration
  const handleReconnectIntegration = (integrationId: string) => {
    toast({
      title: "Reconnecting",
      description: `Attempting to reconnect to ${integrations.find(i => i.id === integrationId)?.name}...`,
    });
    
    // Simulating reconnection
    setTimeout(() => {
      setIntegrations(integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: "connected", lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19) } 
          : integration
      ));
      
      toast({
        title: "Connected",
        description: `Successfully reconnected to ${integrations.find(i => i.id === integrationId)?.name}.`,
      });
    }, 2000);
  };

  // Function to download logs
  const handleDownloadLogs = () => {
    toast({
      title: "Logs Exported",
      description: "System logs have been prepared for download.",
    });
  };

  // Function to refresh metrics
  const handleRefreshMetrics = () => {
    toast({
      title: "Refreshing",
      description: "Fetching the latest system metrics...",
    });
    
    // Simulating metric refresh
    setTimeout(() => {
      toast({
        title: "Refreshed",
        description: "System metrics have been updated with the latest data.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor system health, integrations, and logs
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshMetrics}>
            <RefreshCw size={16} className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="system">
            <Server size={16} className="mr-2" /> System Status
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <ExternalLink size={16} className="mr-2" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText size={16} className="mr-2" /> Logs
          </TabsTrigger>
        </TabsList>

        {/* System Status Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    <Badge 
                      variant={
                        metric.status === "healthy" ? "default" : 
                        metric.status === "warning" ? "outline" : "destructive"
                      }
                    >
                      {metric.status === "healthy" && <Check size={12} className="mr-1" />}
                      {metric.status === "warning" && <AlertCircle size={12} className="mr-1" />}
                      {metric.status === "critical" && <WifiOff size={12} className="mr-1" />}
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-2xl font-bold">
                        {metric.name.includes("Time") ? `${metric.value}ms` : 
                         metric.name.includes("Usage") || metric.name.includes("Load") ? `${metric.value}%` :
                         metric.value}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className={
                          metric.trend === "up" ? "text-green-500" : 
                          metric.trend === "down" ? "text-blue-500" : "text-gray-500"
                        }>
                          {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                        </span>
                        <span className="ml-1">
                          {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {metric.name.includes("Usage") || metric.name.includes("Load") ? (
                      <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium">{metric.value}%</span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="16" 
                            fill="none" 
                            className="stroke-muted stroke-[2]" 
                          />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="16" 
                            fill="none" 
                            strokeDasharray="100" 
                            strokeDashoffset={100 - metric.value} 
                            className={`stroke-[2] ${
                              metric.status === "healthy" ? "stroke-primary" : 
                              metric.status === "warning" ? "stroke-amber-500" : "stroke-destructive"
                            } transition-all duration-1000 ease-in-out`}
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                      </div>
                    ) : (
                      <Activity size={40} className="text-primary/30" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Services</CardTitle>
              <CardDescription>
                Status of all system services and components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>API Gateway</span>
                  </div>
                  <div className="text-muted-foreground">Operational</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('api-gateway')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Authentication Service</span>
                  </div>
                  <div className="text-muted-foreground">Operational</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('auth-service')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>User Service</span>
                  </div>
                  <div className="text-muted-foreground">Operational</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('user-service')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Payment Processing</span>
                  </div>
                  <div className="text-muted-foreground">Degraded</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('payment-service')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Database</span>
                  </div>
                  <div className="text-muted-foreground">Operational</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('database')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Email Service</span>
                  </div>
                  <div className="text-muted-foreground">Outage</div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestartService('email-service')}>
                    <RefreshCw size={14} className="mr-1" /> Restart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>{integration.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            integration.status === "connected" ? "bg-green-500" : 
                            integration.status === "disconnected" ? "bg-amber-500" : "bg-red-500"
                          }`}></div>
                          <span>
                            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReconnectIntegration(integration.id)}
                            disabled={integration.status === "connected"}
                          >
                            <RefreshCw size={14} className="mr-1" /> Reconnect
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings size={14} className="mr-1" /> Configure
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>
                Response times for integration endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>LMS API</span>
                  <span>145ms</span>
                </div>
                <Progress value={29} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Zoho CRM</span>
                  <span>230ms</span>
                </div>
                <Progress value={46} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Gateway</span>
                  <span>320ms</span>
                </div>
                <Progress value={64} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>SMS Gateway</span>
                  <span>185ms</span>
                </div>
                <Progress value={37} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Email Service</span>
                  <span>450ms</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">System Logs</h3>
            <Button variant="outline" onClick={handleDownloadLogs}>
              <Download size={16} className="mr-2" /> Export Logs
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={
                          log.level === "info" ? "outline" : 
                          log.level === "warning" ? "secondary" : "destructive"
                        }>
                          {log.level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.source}</TableCell>
                      <TableCell className="max-w-lg truncate">{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-3">
              <Button variant="link">Load More Logs</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Current database performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Connection Pool</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Query Time</span>
                    <span>180ms</span>
                  </div>
                  <Progress value={36} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Database size={14} className="mr-1" />
                  <span>MongoDB Atlas</span>
                </div>
                <span>Last Updated: 1 minute ago</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechDashboard; 
