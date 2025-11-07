import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Shield, Layers } from "lucide-react";

const advantages = [
  {
    icon: TrendingUp,
    title: "Superior Performance",
    metric: "15-40%",
    description: "Perplexity reduction when retrained on domain-specific data across model sizes from 1.6M to 63M parameters.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Updates",
    metric: "< 5 sec",
    description: "Train on thousands of tokens in seconds. No expensive GPU clusters or lengthy retraining cycles required.",
  },
  {
    icon: Shield,
    title: "No Catastrophic Forgetting",
    metric: "100%",
    description: "Maintains base model knowledge while adding new information. LUT corrections layer on top without interference.",
  },
  {
    icon: Layers,
    title: "Minimal Overhead",
    metric: "< 1%",
    description: "Tiny memory footprint and computational cost. LUT layer adds negligible latency compared to external RAG.",
  },
];

export const Advantages = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-foreground">Why This Changes Everything</h2>
          <p className="text-xl text-muted-foreground">
            Proven results that make continuous learning practical and cost-effective for the first time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-card border-2 card-hover"
                style={{ 
                  borderColor: index === 0 ? 'hsl(var(--primary))' : 
                               index === 1 ? 'hsl(var(--secondary))' : 
                               index === 2 ? 'hsl(var(--accent))' : 
                               'hsl(var(--success))'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: index === 0 ? 'hsl(var(--primary) / 0.1)' : 
                                        index === 1 ? 'hsl(var(--secondary) / 0.1)' : 
                                        index === 2 ? 'hsl(var(--accent) / 0.1)' : 
                                        'hsl(var(--success) / 0.1)'
                      }}
                    >
                      <Icon 
                        className="w-7 h-7"
                        style={{ 
                          color: index === 0 ? 'hsl(var(--primary))' : 
                                 index === 1 ? 'hsl(var(--secondary))' : 
                                 index === 2 ? 'hsl(var(--accent))' : 
                                 'hsl(var(--success))'
                        }}
                      />
                    </div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ 
                        color: index === 0 ? 'hsl(var(--primary))' : 
                               index === 1 ? 'hsl(var(--secondary))' : 
                               index === 2 ? 'hsl(var(--accent))' : 
                               'hsl(var(--success))'
                      }}
                    >
                      {advantage.metric}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{advantage.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
