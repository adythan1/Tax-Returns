import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle2, AlertCircle, Download, ClipboardList } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { name: "Tax Documentation Checklist (Start Here)", file: "Tax Documentation Checklist - Individual.pdf", type: "checklist" },
  { name: "Caregiving Company Financial Statements", file: "Caregiving Company_Financial_Statements Template.xlsx", type: "template" },
  { name: "Personal Finance Template", file: "Personal Finance Template.xlsx", type: "template" },
  { name: "Schedule C Worksheet", file: "Schedule C Worksheet.xlsx", type: "template" },
  { name: "Transport Company Financial Statements", file: "Transport_Company_Financial Statements Template.xlsm.xlsx", type: "template" }
];

const DocumentUpload = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Debug: Log when isSubmitting changes
  React.useEffect(() => {
    console.log('isSubmitting changed to:', isSubmitting);
  }, [isSubmitting]);
  // Discrete document fields
  const [docs, setDocs] = useState({
    w2: [] as File[],
    driversLicense: [] as File[],
    ssnCard: [] as File[],
    form1095: [] as File[],
    form1099NEC: [] as File[],
    form1098: [] as File[],
    form1098T: [] as File[],
    form1098E: [] as File[],
    k1: [] as File[],
    voidedCheck: [] as File[],
    other: [] as File[],
  });

  type DocKey = keyof typeof docs;

  const handleDocChange = (key: DocKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocs((prev) => ({ ...prev, [key]: [...prev[key], ...newFiles] }));
    }
  };

  const removeDocFile = (key: DocKey, index: number) => {
    setDocs((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('handleSubmit called! Current step:', step, 'isSubmitting:', isSubmitting);
    e.preventDefault();
    
    // Only allow submission on step 3
    if (step !== 3) {
      console.log('❌ Form submission BLOCKED - not on step 3');
      return;
    }
    
    console.log('✅ Form submission proceeding...');
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Append all document files to FormData
    Object.entries(docs).forEach(([key, files]) => {
      files.forEach((file) => {
        formData.append(key, file);
      });
    });

    // Send submission to backend immediately - don't wait for response
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    console.log('Submitting to:', `${backendUrl}/api/submit-portal`);
    
    // Use sendBeacon for guaranteed delivery even after page navigation
    // If sendBeacon not supported or fails, fall back to fetch with keepalive
    let submitted = false;
    
    // Try sendBeacon first (best for fire-and-forget)
    if (navigator.sendBeacon) {
      try {
        // Note: sendBeacon only accepts FormData, Blob, or string
        submitted = navigator.sendBeacon(`${backendUrl}/api/submit-portal`, formData);
        console.log('SendBeacon submission:', submitted ? 'success' : 'failed');
      } catch (error) {
        console.log('SendBeacon failed, falling back to fetch:', error);
      }
    }
    
    // Fallback to fetch with keepalive if sendBeacon failed
    if (!submitted) {
      fetch(`${backendUrl}/api/submit-portal`, {
        method: 'POST',
        body: formData,
        keepalive: true, // Ensures request completes even after page navigation
      }).then(async (res) => {
        const data = await res.json();
        console.log('Background submission completed:', data);
        
        // If submission failed, show error toast
        if (!res.ok || !data.success) {
          toast({
            title: "Submission Failed",
            description: data.message || "There was an error processing your submission. Please try again or contact support.",
            variant: "destructive",
            duration: 10000, // Show for 10 seconds
          });
        }
      }).catch((error) => {
        console.error('Background submission error:', error);
        toast({
          title: "Network Error",
          description: "Could not connect to server. Please check your connection and try again.",
          variant: "destructive",
          duration: 10000,
        });
      });
    }

    // Show processing state for 3 seconds, then show success message
    setTimeout(() => {
      // Show success message
      toast({
        title: "Documents Received!",
        description: "Thank you for your submission. We've received your documents and will contact you within 24-48 hours.",
      });

      // Reset form
      form.reset();
      setDocs({ w2: [], driversLicense: [], ssnCard: [], form1095: [], form1099NEC: [], form1098: [], form1098T: [], form1098E: [], k1: [], other: [] });
      setFilingStatus('');
      setTaxYear('');
      setServiceType('');
      setFirstTimeFiling('');
      setStep(1);
      setIsSubmitting(false);
    }, 3000);
  };

  const openPicker = (id: string) => () => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    el?.click();
  };

  // Wizard state and validation helpers
  const personalRef = useRef<HTMLDivElement>(null);
  const taxRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);

  const [filingStatus, setFilingStatus] = useState("");
  const [taxYear, setTaxYear] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [firstTimeFiling, setFirstTimeFiling] = useState("");
  
  // Calculate available tax years dynamically
  const getAvailableTaxYears = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    const years = [];
    
    // After December 31st (January 1st onwards), include the previous year
    if (currentMonth >= 0) { // January is month 0
      years.push(currentYear - 1); // Previous year becomes available
    }
    
    // Always include 2-3 years back for amendments/late filings
    years.push(currentYear - 2);
    years.push(currentYear - 3);
    
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  };

  const validateStep1 = () => {
    const container = personalRef.current;
    if (!container) return true;
    const fields = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    for (const el of Array.from(fields)) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    // Radix Selects are not native <select>, so enforce manually
    const isIndividual = ['individual', 'both', 'amendment'].includes(serviceType);
    
    // Basic validation for fields that are always required
    if (!serviceType || !taxYear || !firstTimeFiling) {
      toast({ title: "Missing information", description: "Please complete all required fields to continue." });
      return false;
    }

    // Conditional validation for filing status
    if (isIndividual && !filingStatus) {
      toast({ title: "Missing information", description: "Please select a filing status." });
      return false;
    }

    return true;
  };

  const onNext = () => {
    console.log('onNext called, current step:', step);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    const newStep = (step < 3 ? (step + 1) as 1 | 2 | 3 : step);
    console.log('Moving to step:', newStep);
    setStep(newStep);
  };

  const onPrev = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Portal
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90 animate-slide-up">
              Securely share your information and upload the exact documents we need.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-professional">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Submit Your Documents</CardTitle>
                  <div className="text-sm text-muted-foreground">Step {step} of 3</div>
                </div>
                <CardDescription className="text-base">
                  Please provide your information and upload the necessary documents for tax filing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={handleSubmit} 
                  onKeyDown={(e) => {
                    // Prevent Enter key from submitting unless on final step
                    if (e.key === 'Enter' && step !== 3) {
                      e.preventDefault();
                    }
                  }}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div ref={personalRef} className={step === 1 ? "space-y-4" : "hidden"}>
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" required={step === 1} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" required={step === 1} placeholder="Doe" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" name="email" type="email" required={step === 1} placeholder="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" type="tel" required={step === 1} placeholder="(555) 123-4567" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input id="address" name="address" required={step === 1} placeholder="123 Main Street, City, State ZIP" />
                    </div>
                  </div>

                  {/* Tax Information */}
                  <div ref={taxRef} className={step === 2 ? "space-y-4 pt-4 border-t" : "hidden"}>
                    <h3 className="text-lg font-semibold">Tax Information</h3>
                    
                    {/* Hidden inputs for controlled selects to be included in FormData */}
                    <input type="hidden" name="filingStatus" value={filingStatus} />
                    <input type="hidden" name="taxYear" value={taxYear} />
                    <input type="hidden" name="serviceType" value={serviceType} />
                    <input type="hidden" name="firstTimeFiling" value={firstTimeFiling} />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Type of Service *</Label>
                        <Select value={serviceType} onValueChange={setServiceType}>
                          <SelectTrigger id="serviceType">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Tax Filing</SelectItem>
                            <SelectItem value="business">Business Tax Services</SelectItem>
                            <SelectItem value="both">Both Individual & Business</SelectItem>
                            <SelectItem value="consultation">Tax Consultation</SelectItem>
                            <SelectItem value="amendment">Tax Amendment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxYear">Tax Year *</Label>
                        <Select value={taxYear} onValueChange={setTaxYear}>
                          <SelectTrigger id="taxYear">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableTaxYears().map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {['individual', 'both', 'amendment'].includes(serviceType) && (
                      <div className="space-y-2 animate-fade-in">
                        <Label htmlFor="filingStatus">Filing Status *</Label>
                        <Select value={filingStatus} onValueChange={setFilingStatus}>
                          <SelectTrigger id="filingStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                            <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                            <SelectItem value="hoh">Head of Household</SelectItem>
                            <SelectItem value="widow">Qualifying Widow(er)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="firstTimeFiling">First time filing with us? *</Label>
                      <Select value={firstTimeFiling} onValueChange={setFirstTimeFiling}>
                        <SelectTrigger id="firstTimeFiling">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      {firstTimeFiling === "yes" && (
                        <p className="text-sm text-amber-600 dark:text-amber-500 flex items-start gap-2 mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-900">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>First-time filers must upload copies of Driver's License and Social Security Card in Step 3.</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea 
                        id="additionalInfo"
                        name="additionalInfo"
                        placeholder="Please provide any additional details that might be relevant for your tax filing..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Portal: Discrete Document Uploads */}
                  <div ref={docsRef} className={step === 3 ? "space-y-6 pt-4 border-t" : "hidden"}>
                    <h3 className="text-lg font-semibold">Required Documents</h3>
                    
                    {/* Templates Section */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Helpful Resources & Templates
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Download the checklist to ensure you have everything, and use the templates to organize your financial data.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {templates.map((template) => (
                          <a 
                            key={template.file}
                            href={`/templates/${template.file}`} 
                            download
                            className={`flex items-center gap-2 p-2 rounded border transition-colors text-sm no-underline ${
                              template.type === 'checklist' 
                                ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 text-indigo-900 dark:text-indigo-100 font-medium'
                                : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 hover:border-blue-400 text-blue-900 dark:text-blue-100'
                            }`}
                          >
                            {template.type === 'checklist' ? (
                              <ClipboardList className="h-4 w-4 text-indigo-600 shrink-0" />
                            ) : (
                              <Download className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            )}
                            <span className="truncate" title={template.name}>{template.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">Upload copies of all relevant documents. Most clients have 3-5 W2 forms.</p>

                    <Accordion type="multiple" className="w-full">
                      {/* Identification */}
                      <AccordionItem value="identification" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">
                          Identification Documents {firstTimeFiling === "yes" && <span className="text-amber-600 text-sm ml-2">(Required for first-time filers)</span>}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "driversLicense", label: "Driver's License - Identification document" },
                              { key: "ssnCard", label: "Social Security Card - Identification Document" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Income Forms */}
                      <AccordionItem value="income-forms" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">Income & Payroll Documents</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "w2", label: "W2 - Payroll document (Most clients have 3-5)" },
                              { key: "form1099NEC", label: "1099-NEC - Miscellaneous Income" },
                              { key: "k1", label: "K1 Form - LLC/Partnership document" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Health Coverage */}
                      <AccordionItem value="health" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">Health Coverage</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "form1095", label: "1095 - Health Coverage document" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Mortgage & Interest Documents */}
                      <AccordionItem value="mortgage-interest" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">Mortgage & Interest Documents</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "form1098", label: "1098 - Mortgage Interest Document" },
                              { key: "form1098T", label: "1098-T Form - Tuition statement" },
                              { key: "form1098E", label: "1098-E - Student Loan Interest" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Banking Information */}
                      <AccordionItem value="banking" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">Banking Information</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "voidedCheck", label: "Bank Info (Voided Check)" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Other */}
                      <AccordionItem value="other" className="border rounded-lg px-4">
                        <AccordionTrigger className="text-base font-medium">Other Documents</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {([
                              { key: "other", label: "Other documents/Others" },
                            ] as { key: DocKey; label: string }[]).map((field) => {
                              const inputId = `file-${field.key}`;
                              return (
                                <div key={field.key} className="space-y-2">
                                  <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor={inputId} className="font-normal">{field.label}</Label>
                                    <div className="flex items-center gap-2">
                                      {docs[field.key].length > 0 && (
                                        <span className="text-xs rounded-full bg-secondary/40 px-2 py-1 text-foreground/80">
                                          {docs[field.key].length} file{docs[field.key].length > 1 ? 's' : ''}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        id={inputId}
                                        multiple
                                        onChange={handleDocChange(field.key)}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                      />
                                      <Button type="button" variant="outline" size="sm" onClick={openPicker(inputId)}>Upload</Button>
                                    </div>
                                  </div>
                                  {docs[field.key].length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {docs[field.key].map((file, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs">
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[200px] truncate">{file.name}</span>
                                          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeDocFile(field.key, index)}>×</button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Security Notice (visible on step 3) */}
                  {step === 3 && (
                    <div className="flex items-start space-x-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Your data is secure</p>
                        <p className="text-muted-foreground">
                          All information is encrypted using bank-level security protocols and is only accessible to authorized tax professionals.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wizard Controls */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div>
                      {step > 1 && (
                        <Button type="button" variant="outline" onClick={onPrev}>
                          Previous
                        </Button>
                      )}
                    </div>
                    <div className="flex-1" />
                    <div className="flex gap-3">
                      {step < 3 ? (
                        <Button 
                          type="button" 
                          onClick={(e) => {
                            console.log('Next button clicked');
                            e.preventDefault();
                            onNext();
                          }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? "Processing..." : (
                            <>
                              Submit Documents
                              <CheckCircle2 className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-8 shadow-card bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Need Help?</p>
                    <p className="text-muted-foreground">
                      If you have questions about which documents to upload or need assistance with the form, 
                      please contact us at <a href="mailto:myquicktaxreturns@gmail.com" className="text-primary hover:underline">myquicktaxreturns@gmail.com</a> or 
                      call <a href="tel:+16175600821" className="text-primary hover:underline">+1 617 5600 821</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentUpload;
