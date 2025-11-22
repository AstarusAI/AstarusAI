import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-primary">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Whether you're an investor, potential partner, or just curious about our technology, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 border-2 border-primary/20">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Email Us</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  For general inquiries and partnerships
                </p>
                <a href="mailto:rafayel.latif@gmail.com" className="text-primary hover:underline">
                  rafayel.latif@gmail.com
                </a>
              </Card>

              <Card className="p-6 border-2 border-secondary/20">
                <Phone className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Call Us</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Monday to Friday, 9am - 5pm GMT
                </p>
                <a href="tel:+44123456789" className="text-secondary hover:underline">
                  +44 7957 456969
                </a>
              </Card>

              {/* <Card className="p-6 border-2 border-accent/20">
                <MapPin className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-bold mb-2 text-foreground">Visit Us</h3>
                <p className="text-muted-foreground text-sm">
                  London, United Kingdom
                </p>
              </Card> */}
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Company (Optional)
                  </label>
                  <Input placeholder="Your company name" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    I'm interested in...
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                    <option>Investment Opportunities</option>
                    <option>Technology Partnership</option>
                    <option>General Inquiry</option>
                    <option>Career Opportunities</option>
                    <option>Media & Press</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us about your interest in Astarus..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-foreground mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">How can I invest in Astarus?</h3>
                <p className="text-muted-foreground">
                  We're currently in discussions with strategic investors. Please reach out via the contact form selecting "Investment Opportunities" and we'll be in touch to share our investor deck and schedule a call.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">Is the technology available for licensing?</h3>
                <p className="text-muted-foreground">
                  We're open to strategic partnerships and technology licensing discussions with select organizations. Contact us to explore collaboration opportunities.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground">Are you hiring?</h3>
                <p className="text-muted-foreground">
                  Yes! We're always looking for talented AI researchers and engineers. Select "Career Opportunities" in the form above or visit our Team page for more information.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
