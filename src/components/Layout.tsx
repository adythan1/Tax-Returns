import { Link, useLocation } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portal", label: "Portal" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/portal") return location.pathname === "/portal" || location.pathname === "/upload";
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-info opacity-30 blur-sm transition-opacity group-hover:opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-colored">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              QuickTaxReturns
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} aria-current={isActive(item.path) ? "page" : undefined}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`rounded-full px-4 font-semibold tracking-tight ${
                    isActive(item.path)
                      ? "bg-gradient-info text-white shadow-colored"
                      : "hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted/60"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 rounded-xl border bg-background/95 shadow-card">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start rounded-full font-semibold ${
                    isActive(item.path) ? "bg-gradient-info text-white shadow-colored" : "hover:bg-muted/60"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </nav>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="relative border-t bg-muted/30">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-info via-accent to-success opacity-40" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-colored">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">QuickTaxReturns</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional tax filing and accounting assistance. We help you maximize deductions,
              minimize risks, and stay compliant year-round.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a aria-label="Facebook" href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a aria-label="Twitter" href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a aria-label="LinkedIn" href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a aria-label="Instagram" href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90 mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Individual Tax Filing</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Business Tax Services</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Bookkeeping</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Tax Planning</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/portal" className="text-muted-foreground hover:text-primary transition-colors">Portal</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90 mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-3">Get tax tips and updates straight to your inbox.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // basic UX feedback; production would call an API
                alert("Thanks for subscribing!");
              }}
              className="flex gap-2"
            >
              <Input type="email" placeholder="Your email" className="bg-background" required />
              <Button type="submit" className="whitespace-nowrap">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} QuickTaxReturns. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
