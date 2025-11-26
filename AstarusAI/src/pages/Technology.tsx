import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Brain, Database, TrendingUp, ArrowRight, Sparkles, Layers, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";

const performanceMetrics = [
  {
    icon: TrendingUp,
    value: "75%",
    label: "Perplexity Reduction",
    color: "primary",
  },
  {
    icon: Zap,
    value: "<20s",
    label: "Training Time",
    color: "secondary",
  },
  {
    icon: Brain,
    value: "100%",
    label: "Knowledge Retention",
    color: "primary",
  },
  {
    icon: Database,
    value: "<1%",
    label: "Memory Overhead",
    color: "secondary",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Base Model Training",
    description: "Start with a standard transformer architecture trained on general data. This provides the foundational knowledge and language understanding capabilities.",
    color: "primary",
  },
  {
    step: "02",
    title: "LUT Integration",
    description: "Add a lightweight lookup table layer to transformer blocks. This layer stores high dimensional transformations without modifying the base model weights.",
    color: "secondary",
  },
  {
    step: "03",
    title: "Continuous Adaptation",
    description: "As new data arrives, update the LUT by adding entries that steer predictions toward desired behaviors. This happens in seconds, not hours or days.",
    color: "primary",
  },
  {
    step: "04",
    title: "Real-Time Inference",
    description: "During inference, the model retrieves relevant corrections from the LUT and applies them to its outputs, enabling personalized responses.",
    color: "secondary",
  },
];

const technicalFeatures = [
  {
    icon: Layers,
    title: "Lightweight Gradient Updates",
    description: "Gradients are computed only for the LUT, not the full model, allowing fast, low-cost adaptation without retraining.",
  },
  {
    icon: Code2,
    title: "Internal Embeddings",
    description: "Uses the model's native representation space for seamless integration with any transformer architecture.",
  },
  {
    icon: Database,
    title: "Scalable Updates",
    description: "Add new knowledge by simply appending rows to the lookup table - no complex infrastructure required.",
  },
];

export default function Technology() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section
        className="relative pt-28 pb-16 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp(0.1)} className="space-y-6">
            <div className="section-badge mx-auto">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary">Deep Dive</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="text-foreground">The Technology Behind </span>
              <span className="text-gradient">Astarus</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to continuous learning in large language models
              using memory-augmented transformer architecture.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-gradient-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={fadeInUp(0.1)}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Memory-Augmented Architecture
            </h2>
            <p className="text-lg text-white/70">
              Our LUT (Lookup Table) augmented transformers represent a paradigm shift 
              in how AI models learn and adapt.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer(0.1, 0.1)}
          >
            {technicalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={fadeInUp(index * 0.1)}>
                  <Card className="p-6 h-full bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/60">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={fadeInUp(0.1)}>
            <div className="section-badge mx-auto mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary">Proven Results</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Performance <span className="text-gradient">Metrics</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Benchmarked across multiple model sizes and domains
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer(0.1, 0.1)}
          >
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const isPrimary = metric.color === "primary";
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp(index * 0.1)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`p-6 text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    isPrimary ? "bg-gradient-to-br from-primary/5 to-primary/10" : "bg-gradient-to-br from-secondary/5 to-secondary/10"
                  }`}>
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg ${
                      isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${isPrimary ? "text-gradient" : "text-gradient-secondary"}`}>
                      {metric.value}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={fadeInUp(0.1)}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A step-by-step guide to our memory-augmented training process
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            variants={staggerContainer(0.1, 0.1)}
          >
            {workflowSteps.map((step, index) => {
              const isPrimary = step.color === "primary";
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp(index * 0.1)}
                  className="relative"
                >
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent hidden md:block" />
                  )}
                  <Card className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isPrimary ? "border-l-4 border-l-primary" : "border-l-4 border-l-secondary"
                  }`}>
                    <div className="flex items-start gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-white ${
                        isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                      }`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${isPrimary ? "text-primary" : "text-secondary"}`}>
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-gradient-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp(0.1)}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Experience It Yourself
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Try our interactive demo and see how memory-augmented transformers 
              enable real-time learning and personalization.
            </p>
            <Link to="/chat">
              <Button className="cta-button group text-lg px-10 py-6 h-auto">
                <span>Try Interactive Demo</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
