import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Simple password check (in production, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with your actual password
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please try again",
        variant: "destructive",
      });
    }
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

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <Card className="w-full max-w-md shadow-professional">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Enter your password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage client submissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchSubmissions} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Portal Submissions</CardTitle>
            <CardDescription>
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No submissions yet</p>
                <p className="text-sm">Submissions will appear here once clients use the portal</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {formatDate(submission.timestamp)}
                        </TableCell>
                        <TableCell>
                          {submission.firstName} {submission.lastName}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.files.length} files</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              {selectedSubmission && formatDate(selectedSubmission.timestamp)}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedSubmission.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">SSN</Label>
                    <p className="font-medium">{selectedSubmission.ssn}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedSubmission.address}</p>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tax Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Filing Status</Label>
                    <p className="font-medium">{selectedSubmission.filingStatus}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tax Year</Label>
                    <p className="font-medium">{selectedSubmission.taxYear}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Service Type</Label>
                    <p className="font-medium">{selectedSubmission.serviceType}</p>
                  </div>
                </div>
                {selectedSubmission.additionalInfo && (
                  <div className="mt-4">
                    <Label className="text-muted-foreground">Additional Information</Label>
                    <p className="font-medium mt-1">{selectedSubmission.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Documents ({selectedSubmission.files.length})</h3>
                  {selectedSubmission.files.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadAll(selectedSubmission.folder)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All (ZIP)
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedSubmission.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">{formatFieldName(file.fieldName)}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {file.originalName} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => handleDownload(selectedSubmission.folder, file.fileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
