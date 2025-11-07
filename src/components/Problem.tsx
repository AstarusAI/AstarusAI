import { Card } from "@/components/ui/card";
import { AlertCircle, DollarSign, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const colorThemes = [
  {
    border: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    border: "border-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    border: "border-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
];

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
    <motion.section
      className="py-24 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp(0)}
    >
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 space-y-4"
          variants={fadeInUp(0.1)}
        >
          <h2 className="text-foreground">The Problem</h2>
          <p className="text-xl text-muted-foreground">
            Current LLMs lack the ability to learn continuously and adapt in real-time — a fundamental limitation that hinders personalization and enterprise adoption.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={staggerContainer(0.15, 0.1)}
        >
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            const theme = colorThemes[index] ?? colorThemes[0];
            return (
              <motion.div
                key={index}
                variants={fadeInUp(index * 0.05)}
                whileHover={scaleOnHover.whileHover}
                whileTap={scaleOnHover.whileTap}
                transition={scaleOnHover.transition}
              >
                <Card className={`p-6 bg-card border-2 card-hover ${theme.border}`}>
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
                      <Icon className={`w-6 h-6 ${theme.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{problem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
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
