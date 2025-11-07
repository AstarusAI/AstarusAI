import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Shield, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const colorThemes = [
  {
    border: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    metricColor: "text-primary",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    metricColor: "text-secondary",
  },
  {
    border: "border-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    metricColor: "text-accent",
  },
  {
    border: "border-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    metricColor: "text-success",
  },
];

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
    <motion.section
      className="py-24 px-4 bg-muted/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn()}
    >
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 space-y-4"
          variants={fadeInUp(0.1)}
        >
          <h2 className="text-foreground">Why This Changes Everything</h2>
          <p className="text-xl text-muted-foreground">
            Proven results that make continuous learning practical and cost-effective for the first time.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          variants={staggerContainer(0.2, 0.2)}
        >
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            const theme = colorThemes[index] ?? colorThemes[0];
            return (
              <motion.div
                key={index}
                variants={fadeInUp(index * 0.05)}
                whileHover={scaleOnHover.whileHover}
                whileTap={scaleOnHover.whileTap}
                transition={scaleOnHover.transition}
              >
                <Card className={`p-8 bg-card border-2 card-hover ${theme.border}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${theme.iconBg}`}>
                        <Icon className={`w-7 h-7 ${theme.iconColor}`} />
                      </div>
                      <div className={`text-3xl font-bold ${theme.metricColor}`}>
                        {advantage.metric}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{advantage.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
