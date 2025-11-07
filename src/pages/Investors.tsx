import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Rocket, Target, ArrowRight } from "lucide-react";
import investorsBg from "@/assets/investors-bg.jpg";

export default function Investors() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={investorsBg} 
            alt="Investors Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="gradient-text-colorful">Investment Opportunity</h1>
            <p className="text-xl text-muted-foreground">
              Join us in revolutionizing AI with continuously learning models
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 card-hover border-2 border-primary/20">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Huge Market</h3>
              <p className="text-sm text-muted-foreground">
                $1.3T AI market by 2032, with personalization as a key driver
              </p>
            </Card>
            
            <Card className="p-6 card-hover border-2 border-secondary/20">
              <Rocket className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">First Mover</h3>
              <p className="text-sm text-muted-foreground">
                Novel architecture with proven results and defensible IP
              </p>
            </Card>
            
            <Card className="p-6 card-hover border-2 border-accent/20">
              <Target className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Clear Path</h3>
              <p className="text-sm text-muted-foreground">
                B2B and B2C opportunities across multiple verticals
              </p>
            </Card>
            
            <Card className="p-6 card-hover border-2 border-success/20">
              <Users className="w-12 h-12 text-success mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Strong Team</h3>
              <p className="text-sm text-muted-foreground">
                Experienced AI researchers with deep technical expertise
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-foreground mb-12 text-center">Why Invest in Astarus?</h2>
            
            <div className="space-y-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary">The Problem We Solve</h3>
                <p className="text-muted-foreground mb-4">
                  Current AI models are static after training. They can't adapt to individual users or company-specific data without expensive retraining or complex external systems like RAG.
                </p>
                <p className="text-muted-foreground">
                  This limits personalization, increases costs, and creates barriers to enterprise adoption.
                </p>
              </Card>
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Solution</h3>
                <p className="text-muted-foreground mb-4">
                  Memory-augmented transformers that learn continuously in real-time, adapting to users and enterprises in seconds instead of weeks.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>15-40% performance improvement on domain-specific tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Updates in seconds vs. hours/days for traditional fine-tuning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Lower infrastructure costs than RAG systems</span>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-accent">Market Opportunity</h3>
                <p className="text-muted-foreground mb-4">
                  Multiple revenue streams across B2B and B2C markets:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">Enterprise (B2B)</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Legal firms</li>
                      <li>• Financial services</li>
                      <li>• Healthcare</li>
                      <li>• Consulting</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">Consumer (B2C)</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Personal AI assistants</li>
                      <li>• Content creators</li>
                      <li>• Developers</li>
                      <li>• Students</li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-success">Traction & Roadmap</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Current Status</h4>
                    <p>Working prototype with proven benchmarks across model sizes (1.6M - 63M parameters)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Next 6 Months</h4>
                    <p>Enterprise pilots, API development, partnership discussions with major model providers</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">12 Months</h4>
                    <p>Commercial launch, initial revenue, IP filings, Series A preparation</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <Card className="max-w-4xl mx-auto p-12 text-center gradient-bg text-white">
            <h2 className="text-white mb-6">Let's Build the Future Together</h2>
            <p className="text-lg mb-8 text-white/90">
              We're seeking strategic investors who share our vision for continuously learning AI systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="group"
              >
                Request Investor Deck
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Schedule a Call
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
