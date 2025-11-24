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
      <section className="relative pt-16 sm:pt-20 md:pt-28 lg:pt-32 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
            <h1 className="text-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Meet Our Team</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
              A passionate group of AI researchers and engineers pushing the boundaries of machine learning
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Founder/CEO */}
            <Card className="p-5 sm:p-6 card-hover border-2 border-primary/20">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mx-auto border-2 md:border-4 border-primary">
                  <img 
                    src="/CEO Pic.jpeg" 
                    alt="Rafayel - Founder & CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Rafayel</h3>
                  <p className="text-sm sm:text-base text-primary font-semibold">Founder & CEO</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  AI researcher with a focus on continuous learning architectures. Leading the development of memory-augmented transformers.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a href="https://www.linkedin.com/in/rafayel-latif-490aa724a/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Rafayel on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="mailto:rafayel.latif@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email Rafayel">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Card>

            {/* CTO */}
            <Card className="p-5 sm:p-6 card-hover border-2 border-secondary/20">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-secondary flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mx-auto">
                  A
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Alfred</h3>
                  <p className="text-sm sm:text-base text-secondary font-semibold">Business Development</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  Focused on investor relations, funding strategy, and strategic partnerships to accelerate Astarus's growth.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <a href="https://www.linkedin.com/in/alfred-mulinge-7586582a9/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors" aria-label="Alfred on LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="mailto:binfred.ke@gmail.com" className="text-muted-foreground hover:text-secondary transition-colors" aria-label="Email Alfred">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container">
          <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 sm:mb-6">Join Our Team</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
              We're always looking for talented individuals who are passionate about pushing the boundaries of AI research.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base"
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
