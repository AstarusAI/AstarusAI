import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import solutionImage from "@/assets/solution-visual.jpg";

const features = [
  {
    title: "Real-Time Learning",
    description: "Update model behavior in seconds with append-only lookup tables that require negligible compute.",
  },
  {
    title: "Native Integration",
    description: "Uses the model's internal embeddings — no external vector stores or complex RAG infrastructure needed.",
  },
  {
    title: "Cost-Effective",
    description: "Dramatically lower compute and infrastructure costs compared to fine-tuning or traditional RAG systems.",
  },
  {
    title: "Continuous Improvement",
    description: "The model accumulates corrections and improvements over time, becoming better at routine tasks automatically.",
  },
];

export const Solution = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-foreground">Our Solution</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We've developed a <span className="text-primary font-semibold">memory-augmented transformer architecture</span> that adds a small, trainable lookup table (LUT) layer to the final transformer block.
          </p>
        </div>

        {/* Solution Image */}
        <div className="max-w-5xl mx-auto mb-16">
          <img 
            src={solutionImage} 
            alt="Memory-Augmented Architecture" 
            className="w-full rounded-lg shadow-lg border border-border"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - explanation */}
          <div className="space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Learn how our memory-augmented architecture enables real-time model adaptation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              During inference, the LUT maps activation keys to corrective logits that are added to the model output. Updating the LUT is as simple as adding rows to a table — no backpropagation, no expensive retraining, no external dependencies.
            </p>
            <div className="pt-4 space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - visual card */}
          <Card className="p-8 bg-card border relative overflow-hidden">
            <div className="relative space-y-6">
              <h3 className="text-2xl font-bold text-foreground">How It Works</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary border">
                  <div className="text-sm font-semibold text-primary mb-2">Step 1: Inference</div>
                  <p className="text-sm text-muted-foreground">Model generates activations in the final transformer block</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-primary/30" />
                </div>

                <div className="p-4 rounded-lg bg-secondary border">
                  <div className="text-sm font-semibold text-primary mb-2">Step 2: Lookup</div>
                  <p className="text-sm text-muted-foreground">LUT matches activations to stored correction patterns</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-primary/30" />
                </div>

                <div className="p-4 rounded-lg bg-secondary border">
                  <div className="text-sm font-semibold text-primary mb-2">Step 3: Correction</div>
                  <p className="text-sm text-muted-foreground">Corrective logits are added to output, steering predictions</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-primary/30" />
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary">
                  <div className="text-sm font-semibold text-primary mb-2">Result</div>
                  <p className="text-sm text-foreground font-medium">Personalized, adapted output in real-time</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
