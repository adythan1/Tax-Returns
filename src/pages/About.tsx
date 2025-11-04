import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide accessible, accurate, and reliable tax and accounting services that empower individuals and businesses to achieve financial confidence and compliance."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description: "To be the most trusted partner for tax and financial services, known for excellence, integrity, and innovative solutions that simplify complex financial matters."
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Integrity, accuracy, client-first approach, and continuous improvement drive everything we do. We build lasting relationships based on trust and exceptional service."
    },
    {
      icon: Users,
      title: "Our Team",
      description: "Certified professionals with decades of combined experience in tax law, accounting, and financial planning, dedicated to your success."
    }
  ];

  const stats = [
    { number: "15+", label: "Years of Experience" },
    { number: "5,000+", label: "Clients Served" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Tax Professionals" }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              About QuickTaxReturns
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90 animate-slide-up">
              Your trusted partner in tax filing and accounting excellence since 2009
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-base lg:text-lg text-muted-foreground">
                <p>
                  QuickTaxReturns was founded with a simple yet powerful vision: to make professional 
                  tax and accounting services accessible to everyone. What started as a small 
                  practice has grown into a trusted firm serving thousands of clients nationwide.
                </p>
                <p>
                  Over the years, we've helped individuals, families, and businesses navigate 
                  complex tax regulations, maximize their returns, and achieve financial peace 
                  of mind. Our success is built on a foundation of expertise, integrity, and 
                  unwavering commitment to client satisfaction.
                </p>
                <p>
                  Today, QuickTaxReturns stands as a leading provider of tax and accounting services, 
                  combining traditional expertise with modern technology to deliver efficient, 
                  accurate, and personalized solutions for every client.
                </p>
              </div>
            </div>
            <div>
              <img
                src={aboutImage}
                alt="QuickTaxReturns team collaboration"
                className="rounded-lg shadow-professional"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-info">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values and principles guide every interaction and decision
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const colors = [
                "bg-gradient-accent",
                "bg-gradient-success",
                "bg-gradient-hero",
                "bg-gradient-info"
              ];
              return (
                <Card key={index} className="shadow-card hover:shadow-colored transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors[index]} flex-shrink-0`}>
                        <value.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-base text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Experience the QuickTaxReturns Difference?
          </h2>
          <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Let our experienced team handle your tax and accounting needs with the care and expertise you deserve
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
