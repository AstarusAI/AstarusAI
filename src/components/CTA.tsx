import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      
      <div className="container relative">
        <Card className="max-w-4xl mx-auto p-12 bg-card border shadow-lg">
          <div className="text-center space-y-8">
            <h2 className="text-foreground">Ready to Learn More?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're currently in stealth mode and seeking strategic partners and investors. Join us in building the future of continuously learning AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="hero" size="lg" className="group">
                <Mail className="w-5 h-5" />
                Contact for Investment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Request Technical Brief
              </Button>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                For partnership inquiries, technical questions, or investor relations, reach out to us.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
