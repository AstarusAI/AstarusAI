import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-ai.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="AI Neural Network"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card backdrop-blur-sm border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Next-Generation AI Architecture</span>
          </div>

          {/* Main heading */}
          <h1 className="text-foreground">
            AI That{" "}
            <span className="gradient-text-colorful">Learns</span>
            {" "}Continuously
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Introducing memory-augmented transformers: the breakthrough that enables real-time learning and adaptation without expensive retraining or complex infrastructure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="lg" className="group gradient-bg">
              For Investors
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Key metric */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">15-40%</div>
              <div className="text-sm text-muted-foreground">Perplexity Reduction</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold text-secondary">Seconds</div>
              <div className="text-sm text-muted-foreground">To Train</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold text-accent">Zero</div>
              <div className="text-sm text-muted-foreground">External Dependencies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
