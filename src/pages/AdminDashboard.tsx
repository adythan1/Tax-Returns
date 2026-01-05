import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, EyeOff, FileText, Loader2, Lock, Trash2, LayoutDashboard, LogOut, TrendingUp, Users, Calendar, PieChart as PieChartIcon, Settings, HelpCircle, Bell, Search, ArrowLeft, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Submission {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
  address: string;
  filingStatus: string;
  taxYear: string;
  serviceType: string;
  additionalInfo: string;
  status?: "received" | "reviewing" | "processing" | "completed" | "action_required";
  files: {
    fieldName: string;
    fileName: string;
    originalName: string;
    size: number;
    type: string;
  }[];
  folder: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes('/admin/submissions/')) return 'detail';
    if (path.includes('/admin/submissions')) return 'submissions';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/support')) return 'help';
    return 'overview';
  };

  const activeView = getActiveView();

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const match = location.pathname.match(/\/admin\/submissions\/(.+)/);
    if (match && match[1]) {
      const id = match[1];
      const sub = submissions.find(s => s.id === id);
      if (sub) setSelectedSubmission(sub);
    }
  }, [location.pathname, submissions]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // New state for filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    return last7Days.map(date => {
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const count = submissions.filter(s => {
        const sDate = new Date(parseInt(s.timestamp));
        return sDate.getDate() === date.getDate() && 
               sDate.getMonth() === date.getMonth() && 
               sDate.getFullYear() === date.getFullYear();
      }).length;
      return { name: dateStr, submissions: count };
    });
  }, [submissions]);

  const statusData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};
    submissions.forEach(s => {
      const status = s.status || 'received';
      const formattedStatus = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      statusCounts[formattedStatus] = (statusCounts[formattedStatus] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  const COLORS = ['hsl(215, 100%, 18%)', 'hsl(190, 85%, 45%)', 'hsl(45, 100%, 55%)', 'hsl(142, 71%, 45%)', 'hsl(210, 100%, 56%)'];

  const stats = {
    total: submissions.length,
    today: submissions.filter(s => {
      const date = new Date(parseInt(s.timestamp));
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    }).length,
    week: submissions.filter(s => {
      const date = new Date(parseInt(s.timestamp));
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
    month: submissions.filter(s => {
      const date = new Date(parseInt(s.timestamp));
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }).length
  };
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Deprecated, using activeView="detail" instead
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  // const [isDeleting, setIsDeleting] = useState(false);

  // Simple password check (in production, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials for demonstration
    const ADMIN_EMAIL = "admin@example.com";
    const ADMIN_PASSWORD = "admin123";

    if (!email || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (email !== ADMIN_EMAIL) {
      toast({
        title: "Invalid Email",
        description: "The email address provided is not authorized.",
        variant: "destructive",
      });
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      toast({
        title: "Invalid Password",
        description: "The password provided is incorrect.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticated(true);
    toast({
      title: "Login Successful",
      description: "Welcome to the admin dashboard",
    });
  };

  // Fetch submissions from backend
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${backendUrl}/api/admin/submissions`);
      const data = await res.json();
      
      if (res.ok) {
        setSubmissions(data.submissions || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load submissions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Network Error",
        description: "Could not connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, fetchSubmissions]);

  // Download file
  const handleDownload = async (folder: string, filename: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const url = `${backendUrl}/api/admin/download?folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(filename)}`;
      
      // Open in new tab to trigger download
      window.open(url, '_blank');
      
      toast({
        title: "Download Started",
        description: filename,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download file",
        variant: "destructive",
      });
    }
  };

  // Download all files as ZIP
  const handleDownloadAll = async (folder: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const url = `${backendUrl}/api/admin/download-zip?folder=${encodeURIComponent(folder)}`;
      
      // Open in new tab to trigger download
      window.open(url, '_blank');
      
      toast({
        title: "Download Started",
        description: "Downloading all files as ZIP...",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download ZIP file",
        variant: "destructive",
      });
    }
  };

  // Delete submission - COMMENTED OUT (not working on server)
  // const handleDeleteClick = (submission: Submission) => {
  //   setSubmissionToDelete(submission);
  //   setIsDeleteDialogOpen(true);
  // };

  // const confirmDelete = async () => {
  //   if (!submissionToDelete) return;

  //   setIsDeleting(true);
  //   try {
  //     const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  //     const res = await fetch(`${backendUrl}/api/admin/submission/${encodeURIComponent(submissionToDelete.folder)}`, {
  //       method: 'POST',
  //     });

  //     const data = await res.json();

  //     if (res.ok && data.success) {
  //       toast({
  //         title: "Deleted Successfully",
  //         description: `Submission from ${submissionToDelete.firstName} ${submissionToDelete.lastName} has been deleted.`,
  //       });

  //       // Refresh submissions list
  //       await fetchSubmissions();

  //       // Close dialogs
  //       setIsDeleteDialogOpen(false);
  //       setIsDetailsOpen(false);
  //       setSubmissionToDelete(null);
  //     } else {
  //       toast({
  //         title: "Delete Failed",
  //         description: data.message || "Could not delete submission",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     toast({
  //       title: "Network Error",
  //       description: "Could not connect to server",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  // Update submission status
  const handleStatusChange = async (folder: string, newStatus: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const res = await fetch(`${backendUrl}/api/admin/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder, status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Status Updated",
          description: `Submission status changed to ${newStatus.replace('_', ' ')}`,
        });
        
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub.folder === folder ? { ...sub, status: newStatus as any } : sub
        ));
        
        if (selectedSubmission && selectedSubmission.folder === folder) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus as any });
        }
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update status",
        variant: "destructive",
      });
    }
  };

  // Get status badge color
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Processing</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Review</Badge>;
      case 'action_required':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Action Required</Badge>;
      default:
        return <Badge variant="secondary">Received</Badge>;
    }
  };

  // Format field name for display
  const formatFieldName = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      'w2': 'W2 - Payroll Document',
      'driversLicense': "Driver's License",
      'socialSecurityCard': 'Social Security Card',
      'form1095': '1095 - Health Coverage',
      'form1099NEC': '1099 NEC - Miscellaneous Income',
      'form1098': '1098 - Mortgage Interest',
      'form1098T': '1098-T - Tuition Statement',
      'form1098E': '1098-E - Student Loan Interest',
      'k1': 'K1 Form - LLC/Partnership',
      'other': 'Other Documents',
      'unknown': 'Document'
    };
    return fieldMap[fieldName] || fieldName;
  };

  // Format date
  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter and paginate submissions
  const getFilteredSubmissions = () => {
    let filtered = [...submissions];

    // 1. Date Filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateFilter === "today") {
      filtered = filtered.filter(sub => new Date(parseInt(sub.timestamp)) >= today);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(sub => new Date(parseInt(sub.timestamp)) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(sub => new Date(parseInt(sub.timestamp)) >= monthAgo);
    }

    // 2. Status Filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(sub => (sub.status || 'received') === statusFilter);
    }

    // 3. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.firstName.toLowerCase().includes(query) ||
        sub.lastName.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.phone.includes(query)
      );
    }

    return filtered;
  };

  const allFilteredSubmissions = getFilteredSubmissions();
  const totalPages = Math.ceil(allFilteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = allFilteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
        <Navigation />
        
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Animated Blobs */}
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl animate-pulse duration-[10000ms]" />
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-3xl animate-pulse duration-[8000ms] delay-1000" />
          <div className="absolute -bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl animate-pulse duration-[12000ms] delay-2000" />
          
          {/* Floating Shapes */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 border-4 border-primary/10 rounded-xl animate-bounce duration-[3000ms]" />
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-accent/20 rounded-full animate-ping duration-[2000ms]" />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary/20 rounded-full" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <SidebarProvider
        style={{
          "--sidebar-background": "215 100% 18%",
          "--sidebar-foreground": "0 0% 100%",
          "--sidebar-primary": "190 85% 45%",
          "--sidebar-primary-foreground": "0 0% 100%",
          "--sidebar-accent": "190 85% 45%",
          "--sidebar-accent-foreground": "0 0% 100%",
          "--sidebar-border": "215 80% 25%",
          "--sidebar-ring": "190 85% 45%",
        } as React.CSSProperties}
      >
        <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">Admin Portal</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeView === "overview"} 
                      onClick={() => navigate("/admin/overview")}
                      className="h-12 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <LayoutDashboard />
                      <span className="text-base">Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeView === "submissions"} 
                      onClick={() => navigate("/admin/submissions")}
                      className="h-12 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <FileText />
                      <span className="text-base">Submissions</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeView === "users"} 
                      onClick={() => navigate("/admin/users")}
                      className="h-12 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Users />
                      <span className="text-base">Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeView === "settings"} 
                      onClick={() => navigate("/admin/settings")}
                      className="h-12 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Settings />
                      <span className="text-base">Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeView === "help"} 
                      onClick={() => navigate("/admin/support")}
                      className="h-12 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <HelpCircle />
                      <span className="text-base">Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-9 w-9 border border-sidebar-border">
                <div className="flex h-full w-full items-center justify-center bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                  AD
                </div>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
                <span className="text-xs text-sidebar-foreground/70">admin@accruefy.com</span>
              </div>
            </div>
            <div className="text-xs text-sidebar-foreground/40 font-mono">Version 2.0.1</div>
          </SidebarFooter>
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
              onClick={() => setIsAuthenticated(false)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>
        
        <SidebarInset className="flex-1 overflow-auto">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-lg font-semibold capitalize">
                {activeView === "overview" ? "Dashboard Overview" : activeView}
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </div>
            </div>
            {activeView === "submissions" && (
              <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Data"}
              </Button>
            )}
          </header>
          
          <main className="p-6">
            {activeView === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-blue-500 text-white shadow-md hover:shadow-lg transition-shadow border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-100">Total Submissions</CardTitle>
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.total}</div>
                      <p className="text-xs text-blue-100 mt-1">All time submissions</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-500 text-white shadow-md hover:shadow-lg transition-shadow border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-100">Today</CardTitle>
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.today}</div>
                      <p className="text-xs text-purple-100 mt-1">Submissions today</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500 text-white shadow-md hover:shadow-lg transition-shadow border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-orange-100">This Week</CardTitle>
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.week}</div>
                      <p className="text-xs text-orange-100 mt-1">Last 7 days</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500 text-white shadow-md hover:shadow-lg transition-shadow border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-100">This Month</CardTitle>
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{stats.month}</div>
                      <p className="text-xs text-green-100 mt-1">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                      <CardTitle>Submission Activity</CardTitle>
                      <CardDescription>Daily submissions for the past week</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#888888" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false} 
                            />
                            <YAxis 
                              stroke="#888888" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false} 
                              tickFormatter={(value) => `${value}`} 
                              allowDecimals={false}
                            />
                            <Tooltip 
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar 
                              dataKey="submissions" 
                              fill="hsl(215, 100%, 18%)" 
                              radius={[4, 4, 0, 0]} 
                              barSize={40}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                      <CardTitle>Filing Status</CardTitle>
                      <CardDescription>Distribution by filing status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full flex items-center justify-center">
                        {statusData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeView === "submissions" && (
              <div className="space-y-6">
                {/* Toolbar Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border shadow-sm">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by name, email, or phone..."
                        className="pl-9 bg-background border-muted"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1); // Reset to first page on search
                        }}
                      />
                    </div>
                    <div className="w-[180px]">
                      <Select 
                        value={statusFilter} 
                        onValueChange={(value) => {
                          setStatusFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="bg-background border-muted">
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="reviewing">In Review</SelectItem>
                          <SelectItem value="action_required">Action Required</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Tabs value={dateFilter} onValueChange={(value) => {
                    setDateFilter(value as any);
                    setCurrentPage(1);
                  }} className="w-full md:w-auto">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="all">All Time</TabsTrigger>
                      <TabsTrigger value="today">Today</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Table Section */}
                <Card className="shadow-lg border-none bg-card rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                  <CardHeader className="px-6 py-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">Submissions</CardTitle>
                        <CardDescription>
                          Showing {paginatedSubmissions.length} of {allFilteredSubmissions.length} results
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={isLoading} className="bg-background hover:bg-accent">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : allFilteredSubmissions.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground">
                        <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No submissions found</p>
                        <p className="text-sm max-w-xs mx-auto mt-1">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setDateFilter("all");
                          }}
                          className="mt-2"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-slate-100/50 dark:bg-slate-800/50">
                              <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                                <TableHead className="w-[180px] font-semibold text-foreground">Date Submitted</TableHead>
                                <TableHead className="w-[140px] font-semibold text-foreground">Status</TableHead>
                                <TableHead className="font-semibold text-foreground">Client Name</TableHead>
                                <TableHead className="font-semibold text-foreground">Contact</TableHead>
                                <TableHead className="font-semibold text-foreground">Documents</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedSubmissions.map((submission) => (
                                <TableRow 
                                  key={submission.id} 
                                  className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all border-b border-slate-100 dark:border-slate-800 cursor-pointer"
                                  onClick={() => {
                                    navigate(`/admin/submissions/${submission.id}`);
                                  }}
                                >
                                  <TableCell className="font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Calendar className="h-4 w-4" />
                                      </div>
                                      {formatDate(submission.timestamp)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(submission.status)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-bold text-foreground">{submission.firstName} {submission.lastName}</div>
                                    <div className="text-xs text-muted-foreground font-mono mt-0.5">SSN: •••-••-{submission.ssn.slice(-4)}</div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                      <span className="text-foreground font-medium">{submission.email}</span>
                                      <span className="text-muted-foreground text-xs">{submission.phone}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="font-normal bg-background hover:bg-accent transition-colors">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {submission.files.length} file{submission.files.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="opacity-0 group-hover:opacity-100 transition-all text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                    >
                                      View Details
                                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/30 dark:bg-slate-900/30">
                            <div className="text-sm text-muted-foreground font-medium">
                              Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            {activeView === "detail" && selectedSubmission && (
              <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-in fade-in duration-500">
                {/* Header Section - Compact */}
                <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        navigate("/admin/submissions");
                        setSelectedSubmission(null);
                      }}
                      className="h-9 w-9 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Button>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSubmission.firstName} {selectedSubmission.lastName}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Submitted on {formatDate(selectedSubmission.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-[180px]">
                      <Select 
                        value={selectedSubmission.status || "received"} 
                        onValueChange={(value) => handleStatusChange(selectedSubmission.folder, value)}
                      >
                        <SelectTrigger className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="reviewing">In Review</SelectItem>
                          <SelectItem value="action_required">Action Required</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedSubmission.files.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => handleDownloadAll(selectedSubmission.folder)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download ZIP
                      </Button>
                    )}
                  </div>
                </div>

                {/* Main Content - Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                  {/* Left Column: Details */}
                  <Card className="lg:col-span-2 flex flex-col shadow-lg rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 border-none bg-white dark:bg-slate-950 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Users className="h-4 w-4" />
                        </div>
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Contact Details
                          </h3>
                          
                          <div className="space-y-3">
                            {selectedSubmission.email && (
                              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Email Address</Label>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.email}</p>
                              </div>
                            )}
                            
                            {selectedSubmission.phone && (
                              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Phone Number</Label>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.phone}</p>
                              </div>
                            )}
                            
                            {selectedSubmission.address && (
                              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Mailing Address</Label>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.address}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tax Info */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="h-3 w-3" /> Filing Details
                          </h3>
                          
                          <div className="space-y-3">
                            {selectedSubmission.ssn && (
                              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Social Security Number</Label>
                                <p className="text-sm font-mono font-medium text-slate-900 dark:text-slate-200 tracking-wide">
                                  {selectedSubmission.ssn}
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              {selectedSubmission.taxYear && (
                                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Tax Year</Label>
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.taxYear}</p>
                                </div>
                              )}
                              
                              {selectedSubmission.filingStatus && (
                                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Status</Label>
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.filingStatus}</p>
                                </div>
                              )}
                            </div>

                            {selectedSubmission.serviceType && (
                              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Service Type</Label>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{selectedSubmission.serviceType}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Additional Notes - Full Width */}
                        {selectedSubmission.additionalInfo && (
                          <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 block uppercase tracking-wider">Additional Notes</Label>
                            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {selectedSubmission.additionalInfo}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column: Documents */}
                  <Card className="flex flex-col shadow-lg rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 border-none bg-white dark:bg-slate-950 overflow-hidden h-full">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                          <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          Documents
                        </CardTitle>
                        <Badge variant="secondary" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                          {selectedSubmission.files.length} Files
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/50">
                      <div className="space-y-3">
                        {selectedSubmission.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {formatFieldName(file.fieldName)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {file.originalName}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                              onClick={() => handleDownload(selectedSubmission.folder, file.fileName)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeView === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage system access and user roles.</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>

                <Card className="shadow-lg rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-950">
                  <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        System Users
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search users..."
                            className="pl-9 w-[250px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                          <TableHead className="w-[250px] bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-medium">User</TableHead>
                          <TableHead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-medium">Role</TableHead>
                          <TableHead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-medium">Status</TableHead>
                          <TableHead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-medium">Last Active</TableHead>
                          <TableHead className="text-right bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Admin User", email: "admin@accruefy.com", role: "Administrator", status: "active", lastActive: "Just now" },
                          { name: "Sarah Johnson", email: "sarah@accruefy.com", role: "Editor", status: "active", lastActive: "2 hours ago" },
                          { name: "Michael Chen", email: "michael@accruefy.com", role: "Viewer", status: "inactive", lastActive: "5 days ago" },
                        ].map((user, i) => (
                          <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-slate-100 dark:border-slate-800 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-slate-100 dark:bg-slate-800">
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-200">{user.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={user.status === 'active' ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}>
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                              {user.lastActive}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === "settings" && (
               <div className="max-w-5xl space-y-8">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your dashboard preferences and account settings.</p>
                 </div>

                 <div className="grid gap-6 md:grid-cols-2">
                   <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-lg">
                         <Eye className="h-5 w-5 text-blue-500" />
                         Appearance
                       </CardTitle>
                       <CardDescription>Customize how the dashboard looks on your device.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                         <div className="space-y-0.5">
                           <Label className="text-base font-medium">Dark Mode</Label>
                           <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                         </div>
                         <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-lg">
                         <Bell className="h-5 w-5 text-orange-500" />
                         Notifications
                       </CardTitle>
                       <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                         <div className="space-y-0.5">
                           <Label className="text-base font-medium">Email Alerts</Label>
                           <p className="text-xs text-slate-500 dark:text-slate-400">Receive emails for new submissions</p>
                         </div>
                         <Switch defaultChecked />
                       </div>
                     </CardContent>
                   </Card>

                   <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 md:col-span-2">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-lg">
                         <Lock className="h-5 w-5 text-green-500" />
                         Security
                       </CardTitle>
                       <CardDescription>Manage your password and account security.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="grid gap-4 md:grid-cols-2">
                         <div className="space-y-2">
                           <Label>Current Password</Label>
                           <Input type="password" placeholder="••••••••" />
                         </div>
                         <div className="space-y-2">
                           <Label>New Password</Label>
                           <Input type="password" placeholder="••••••••" />
                         </div>
                       </div>
                       <div className="flex justify-end pt-2">
                         <Button variant="outline">Update Password</Button>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
            )}

            {activeView === "help" && (
              <div className="max-w-4xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Help & Support</h2>
                  <p className="text-slate-500 dark:text-slate-400">Find answers to common questions and get support.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-purple-500" />
                        Frequently Asked Questions
                      </CardTitle>
                      <CardDescription>Common questions about managing submissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-slate-100 dark:border-slate-800">
                          <AccordionTrigger className="text-slate-900 dark:text-slate-200">How do I download files?</AccordionTrigger>
                          <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Navigate to the Submissions tab, click on a submission to view details. You can download individual files by clicking the download icon next to them, or use the "Download ZIP" button to get all files at once.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-slate-100 dark:border-slate-800">
                          <AccordionTrigger className="text-slate-900 dark:text-slate-200">How do I update a submission status?</AccordionTrigger>
                          <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Open a submission's detail view. In the top header, you'll see a status dropdown. Select the new status (e.g., "In Review", "Completed") and it will automatically update.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-slate-100 dark:border-slate-800">
                          <AccordionTrigger className="text-slate-900 dark:text-slate-200">Can I delete submissions?</AccordionTrigger>
                          <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Currently, deletion is restricted to administrators. Please contact the system administrator if you need to permanently remove a submission record.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-blue-50 dark:bg-blue-950/20">
                      <CardHeader>
                        <CardTitle className="text-base text-blue-900 dark:text-blue-100">Need more help?</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Our support team is available Monday through Friday, 9am to 5pm EST.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Support
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                      <CardHeader>
                        <CardTitle className="text-base">Documentation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start h-auto py-2 px-2 text-slate-600 dark:text-slate-400 hover:text-blue-600">
                          <FileText className="mr-2 h-4 w-4" />
                          <div className="text-left">
                            <div className="text-sm font-medium">User Guide</div>
                            <div className="text-xs opacity-70">PDF • 2.4 MB</div>
                          </div>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-auto py-2 px-2 text-slate-600 dark:text-slate-400 hover:text-blue-600">
                          <FileText className="mr-2 h-4 w-4" />
                          <div className="text-left">
                            <div className="text-sm font-medium">API Documentation</div>
                            <div className="text-xs opacity-70">Online Link</div>
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    </div>
  );
};

export default AdminDashboard;
