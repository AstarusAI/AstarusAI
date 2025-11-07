import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Next-Generation AI Architecture</span>
          </div>

          {/* Main heading */}
          <h1 className="text-foreground">
            AI That{" "}
            <span className="gradient-text">Learns</span>
            {" "}Continuously
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Introducing memory-augmented transformers: the breakthrough that enables real-time learning and adaptation without expensive retraining or complex infrastructure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="lg" className="group">
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
              <div className="text-4xl font-bold gradient-text">15-40%</div>
              <div className="text-sm text-muted-foreground">Perplexity Reduction</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold gradient-text">Seconds</div>
              <div className="text-sm text-muted-foreground">To Train</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold gradient-text">Zero</div>
              <div className="text-sm text-muted-foreground">External Dependencies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
