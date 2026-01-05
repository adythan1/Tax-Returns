import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/meolnoyr", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thanks for reaching out. We'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        let message = "Something went wrong. Please try again later.";
        try {
          const data = (await res.json()) as { errors?: Array<{ message?: string }> };
          if (Array.isArray(data?.errors) && data.errors.length > 0) {
            message = data.errors.map((e) => e.message ?? "").filter(Boolean).join(" \n");
          }
        } catch (_err) {
          // ignore JSON parse errors; fallback message will be used
        }
        toast({ title: "Failed to send", description: message });
      }
    } catch (err) {
      toast({ title: "Network error", description: "Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "myquicktaxreturns@gmail.com",
      link: "mailto:myquicktaxreturns@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 617 5600 821",
      link: "tel:+16175600821"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "56 Russell Street, Suite A, Waltham, MA 02453",
      link: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 09:00 AM - 05:00 PM",
      link: null
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90 animate-slide-up">
              Have questions? We're here to help. Reach out to our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="_subject" value="New Contact Form Submission" />
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactFirstName">First Name *</Label>
                        <Input id="contactFirstName" name="firstName" required placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactLastName">Last Name *</Label>
                        <Input id="contactLastName" name="lastName" required placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input 
                        id="contactEmail" 
                        type="email" 
                        name="email"
                        required 
                        placeholder="john.doe@example.com" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input 
                        id="contactPhone" 
                        type="tel" 
                        name="phone"
                        placeholder="(555) 123-4567" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        required 
                        placeholder="What is your inquiry about?" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        required 
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-base text-muted-foreground mb-8">
                  Whether you have a question about our services, pricing, or anything else, 
                  our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          {info.link ? (
                            <a 
                              href={info.link} 
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">{info.details}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-card bg-accent/10 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Schedule a Consultation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prefer to speak with someone directly? Schedule a free consultation 
                    with one of our tax experts.
                  </p>
                  <Button variant="outline" className="w-full">
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "How long does it take to process my tax return?",
                  answer: "Most tax returns are completed within 3-5 business days after we receive all necessary documents. Complex returns may take up to 7-10 business days."
                },
                {
                  question: "What documents do I need to provide?",
                  answer: "Typically, you'll need W-2s, 1099s, receipts for deductions, last year's tax return, and any other relevant financial documents. We'll provide a comprehensive checklist based on your situation."
                },
                {
                  question: "Are my documents secure?",
                  answer: "Yes, absolutely. We use bank-level encryption and secure storage protocols to protect your sensitive information. Your data is never shared with unauthorized parties."
                },
                {
                  question: "Do you offer year-round support?",
                  answer: "Yes! While tax season is our busiest time, we provide tax planning and consultation services throughout the entire year to help optimize your financial strategy."
                }
              ].map((faq, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
