import { Card } from "@/components/ui/card";
import { AlertCircle, DollarSign, Clock, Zap } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "Expensive Fine-Tuning",
    description: "Traditional model adaptation requires costly compute resources and full retraining cycles.",
  },
  {
    icon: Clock,
    title: "Slow to Adapt",
    description: "Current methods can't update in real-time, making personalization impractical at scale.",
  },
  {
    icon: AlertCircle,
    title: "Catastrophic Forgetting",
    description: "Backpropagation-based approaches struggle with continuous learning without losing previous knowledge.",
  },
  {
    icon: Zap,
    title: "Complex RAG Systems",
    description: "External retrieval augmentation adds infrastructure complexity and latency without true learning.",
  },
];

export const Problem = () => {
  return (
    <section className="py-24 px-4">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-foreground">The Problem</h2>
          <p className="text-xl text-muted-foreground">
            Current LLMs lack the ability to learn continuously and adapt in real-time — a fundamental limitation that hinders personalization and enterprise adoption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 card-hover"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
