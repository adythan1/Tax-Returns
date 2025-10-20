import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Building2, 
  Users, 
  Calculator, 
  TrendingUp, 
  FileCheck, 
  PieChart,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Scale,
  Award
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "Individual Tax Filing",
      description: "Complete preparation and filing of personal income tax returns with maximized deductions and credits.",
      segment: "Individuals",
      features: [
        "Form 1040 preparation",
        "Itemized deductions optimization",
        "Tax credit identification",
        "State and federal filing"
      ]
    },
    {
      icon: Building2,
      title: "Business Tax Services",
      description: "Comprehensive tax solutions for businesses of all sizes, from startups to established corporations.",
      segment: "Business",
      features: [
        "Corporate tax returns",
        "Partnership & S-Corp filings",
        "Quarterly estimated taxes",
        "Business entity planning"
      ]
    },
    {
      icon: Calculator,
      title: "Bookkeeping Services",
      description: "Professional bookkeeping to keep your financial records accurate, organized, and up-to-date.",
      segment: "Business",
      features: [
        "Monthly reconciliation",
        "Accounts payable/receivable",
        "Financial statement preparation",
        "Payroll processing"
      ]
    },
    {
      icon: TrendingUp,
      title: "Tax Planning",
      description: "Strategic tax planning to minimize your tax liability and optimize your financial position year-round.",
      segment: "Both",
      features: [
        "Year-end tax strategies",
        "Retirement planning",
        "Investment tax optimization",
        "Multi-year tax projections"
      ]
    },
    {
      icon: FileCheck,
      title: "Audit Support",
      description: "Expert assistance and representation if you're facing an IRS audit or tax dispute.",
      segment: "Both",
      features: [
        "Audit representation",
        "Document preparation",
        "IRS correspondence handling",
        "Resolution negotiation"
      ]
    },
    {
      icon: PieChart,
      title: "Financial Consulting",
      description: "Professional guidance on financial matters to help you make informed business decisions.",
      segment: "Business",
      features: [
        "Cash flow analysis",
        "Budget preparation",
        "Financial forecasting",
        "Business valuation"
      ]
    },
    {
      icon: Users,
      title: "Estate & Trust Tax",
      description: "Specialized tax services for estates, trusts, and complex family financial situations.",
      segment: "Individuals",
      features: [
        "Estate tax returns",
        "Trust tax preparation",
        "Gift tax reporting",
        "Beneficiary tax planning"
      ]
    },
    {
      icon: Briefcase,
      title: "Nonprofit Services",
      description: "Dedicated tax and accounting solutions for nonprofit organizations and charities.",
      segment: "Nonprofits",
      features: [
        "Form 990 preparation",
        "Compliance monitoring",
        "Donor reporting",
        "Tax-exempt status maintenance"
      ]
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Tax & Accounting Services
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90 animate-slide-up">
              Clear, compliant, and efficient solutions for individuals, businesses, and nonprofits
            </p>
          </div>
        </div>
      </section>

      {/* Assurance Bar */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: "Secure by design", desc: "Encrypted documents & private workflows" },
              { icon: Scale, title: "Compliance ready", desc: "Aligned with IRS and state requirements" },
              { icon: Award, title: "Handled by experts", desc: "Certified professionals, real support" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border bg-card/40 p-4 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colors = [
                "bg-gradient-info",
                "bg-gradient-success",
                "bg-gradient-accent",
                "bg-gradient-hero",
                "bg-gradient-info",
                "bg-gradient-success",
                "bg-gradient-accent",
                "bg-gradient-hero"
              ];
              return (
                <Card key={index} className="shadow-card hover:shadow-colored transition-all duration-300">
                  <CardHeader>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${colors[index]} mb-4`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                      <Badge variant="secondary" className="rounded-full">{service.segment}</Badge>
                    </div>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.slice(0,3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-success mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <Link to="/portal">
                        <Button size="sm" variant="default">
                          Go to Portal <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">Not sure which service fits best?</p>
            <div className="mt-3">
              <Link to="/contact">
                <Button variant="outline">Talk to a Specialist</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section (Concise) */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Simple, transparent, and efficient</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload", description: "Securely submit your documents and basic info" },
              { step: "02", title: "Prepare", description: "We review, clarify, and prepare with accuracy" },
              { step: "03", title: "File & Support", description: "We file and support you with any follow‑ups" }
            ].map((process, index) => {
              const colors = [
                "bg-gradient-info",
                "bg-gradient-success",
                "bg-gradient-accent"
              ];
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${colors[index]} mb-4`}>
                    <span className="text-2xl font-bold text-white">{process.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                  <p className="text-sm text-muted-foreground">{process.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-success text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Use the Portal to securely share your documents and let our experts take care of the rest
          </p>
          <Link to="/portal">
            <Button size="lg" variant="secondary" className="text-base font-semibold">
              Go to Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
