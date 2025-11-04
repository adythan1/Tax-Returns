import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  ArrowRight,
  ShieldCheck,
  Lock,
  Scale,
  Building2,
  Briefcase,
  Handshake,
  Upload,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  // Content condensed to help customers quickly understand who we are and what we do.

  return (
    <div className="flex flex-col">
      {/* Hero Section (unchanged) */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Professional Tax Filing & Accounting Made Simple
              </h1>
              <p className="text-lg lg:text-xl text-white/90">
                Trust QuickTaxReturns for accurate, efficient, and stress-free tax filing. 
                Our certified professionals ensure you get the best returns while staying compliant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/portal">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base font-semibold">
                    Go to Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block animate-slide-up">
              <img
                src={heroImage}
                alt="Professional tax and accounting services"
                className="rounded-lg shadow-professional"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About + What We Do (Concise) */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Who We Are</h2>
              <p className="text-base lg:text-lg text-muted-foreground">
                QuickTaxReturns is a team of certified tax professionals and accountants dedicated to
                simplifying taxes for individuals and businesses. We combine deep expertise with
                modern tools to deliver accurate filings and clear guidance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">What We Do</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  "Personal & business tax filing",
                  "Bookkeeping & payroll",
                  "Tax planning & advisory",
                  "Audit support & resolution",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mt-1 mr-2 inline-block h-2 w-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-3">
                <Link to="/about">
                  <Button size="lg">About Us</Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline">What We Offer</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A clear, guided process from Portal upload to filing
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Docs", desc: "Securely upload W-2s, 1099s, and receipts.", icon: Upload },
              { step: "02", title: "Expert Review", desc: "We analyze and identify every opportunity.", icon: ShieldCheck },
              { step: "03", title: "Preparation", desc: "We prepare accurate, compliant returns.", icon: FileText },
              { step: "04", title: "Filing & Support", desc: "We file and support you year-round.", icon: Users },
            ].map((p, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-info mb-4">
                  <p.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security (Concise) */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Encrypted by default", desc: "Your documents and data are protected with bank‑level security." },
              { icon: Lock, title: "Private & confidential", desc: "Access is strictly controlled and monitored." },
              { icon: Scale, title: "Built for compliance", desc: "We stay aligned with IRS and state requirements." },
            ].map((item, i) => (
              <Card key={i} className="shadow-card h-full">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve (Brief) */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for every stage — from first-time filers to growing businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Individuals", desc: "Simple to complex personal returns" },
              { icon: Briefcase, title: "Small Businesses", desc: "Sole proprietors and LLCs" },
              { icon: Building2, title: "Established Firms", desc: "S-Corp, partnerships, and more" },
              { icon: Handshake, title: "Nonprofits", desc: "Compliance and Form 990 support" },
            ].map((seg, i) => (
              <Card key={i} className="shadow-card h-full">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <seg.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{seg.title}</CardTitle>
                  <CardDescription className="text-base">{seg.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (2 highlights) */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from people and businesses who trust QuickTaxReturns
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "QuickTaxReturns found deductions I had missed for years. The process was smooth and stress-free.",
                name: "Sarah M.",
                role: "Freelance Designer",
              },
              {
                quote: "Professional, responsive, and accurate. Highly recommend for complex filings.",
                name: "Priya R.",
                role: "Startup CFO",
              },
            ].map((t, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-6">
                  <p className="text-base leading-relaxed">“{t.quote}”</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t.name}</span> · {t.role}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Soft CTA */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">Ready when you are</h3>
            <p className="text-muted-foreground max-w-2xl">
              Upload your documents in minutes or talk to a specialist—whichever you prefer.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/portal">
                <Button size="lg">Go to Portal</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Talk to a Specialist</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-success text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Let's Simplify Your Taxes Together</h2>
          <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied clients who trust QuickTaxReturns with their tax and accounting needs
          </p>
          <Link to="/portal">
            <Button size="lg" variant="secondary" className="text-base font-semibold">
              Start Your Tax Filing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
