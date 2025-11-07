import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpg";

export default function Team() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="gradient-text-colorful">Meet Our Team</h1>
            <p className="text-xl text-muted-foreground">
              A passionate group of AI researchers and engineers pushing the boundaries of machine learning
            </p>
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="py-12 px-4">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <img 
              src={teamPhoto} 
              alt="Astarus Team" 
              className="w-full rounded-lg shadow-2xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Founder/CEO */}
            <Card className="p-6 card-hover border-2 border-primary/20">
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-4xl font-bold text-white mx-auto">
                  R
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Rafayel</h3>
                  <p className="text-primary font-semibold">Founder & CEO</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  AI researcher with a focus on continuous learning architectures. Leading the development of memory-augmented transformers.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Rafayel on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email Rafayel">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Card>

            {/* CTO */}
            <Card className="p-6 card-hover border-2 border-secondary/20">
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-4xl font-bold text-white mx-auto">
                  A
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Alfred</h3>
                  <p className="text-secondary font-semibold">Business Development</p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Focused on investor relations, funding strategy, and strategic partnerships to accelerate Astarus's growth.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a href="#" className="text-muted-foreground hover:text-secondary transition-colors" aria-label="Alfred on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-secondary transition-colors" aria-label="Email Alfred">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <Card className="max-w-4xl mx-auto p-12 text-center">
            <h2 className="text-foreground mb-6">Join Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're always looking for talented individuals who are passionate about pushing the boundaries of AI research.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Open Positions
            </a>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
