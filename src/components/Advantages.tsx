import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Shield, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const colorThemes = [
  {
    border: "border-primary",
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
    metricColor: "text-primary",
    cardBg: "bg-primary/5",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/5",
    iconColor: "text-secondary",
    metricColor: "text-secondary",
    cardBg: "bg-secondary/5",
  },
  {
    border: "border-primary",
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
    metricColor: "text-primary",
    cardBg: "bg-primary/5",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/5",
    iconColor: "text-secondary",
    metricColor: "text-secondary",
    cardBg: "bg-secondary/5",
  },
];

const advantages = [
  {
    icon: TrendingUp,
    title: "Superior Performance",
    metric: "75%",
    description: "Perplexity reduction when retrained on domain-specific data across model sizes from 1.6M to 63M parameters.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Updates",
    metric: "< 20 sec",
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
      className="py-24 px-4 bg-white"
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
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border-2 border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">Proven Results</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Why This Changes Everything</h2>
          <p className="text-xl text-gray-700 font-medium leading-relaxed">
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
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`p-8 border-2 ${theme.border} ${theme.cardBg} relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300`}>
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${
                    index % 2 === 0 ? 'from-primary/20' : 'from-secondary/20'
                  } to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between">
                      <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${theme.iconBg} border-2 ${theme.border} shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className={`w-10 h-10 ${theme.iconColor}`} />
                      </div>
                      <div className={`text-5xl md:text-6xl font-bold ${theme.metricColor} drop-shadow-lg`}>
                        {advantage.metric}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold text-gray-900 mb-3 transition-colors ${
                        index % 2 === 0 ? 'group-hover:text-primary' : 'group-hover:text-secondary'
                      }`}>{advantage.title}</h3>
                      <p className="text-gray-700 leading-relaxed font-medium text-base">{advantage.description}</p>
                    </div>
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
