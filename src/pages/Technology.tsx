import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Zap, Brain, Database, TrendingUp } from "lucide-react";
import technologyBg from "@/assets/technology-bg.jpg";
import continuousLearning from "@/assets/continuous-learning.jpg";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const performanceMetrics = [
  {
    icon: TrendingUp,
    value: "75%",
    label: "Perplexity Reduction",
    borderClass: "border-primary/20",
    textClass: "text-primary",
  },
  {
    icon: Zap,
    value: "< 20s",
    label: "Training Time",
    borderClass: "border-secondary/20",
    textClass: "text-secondary",
  },
  {
    icon: Brain,
    value: "100%",
    label: "Knowledge Retention",
    borderClass: "border-accent/20",
    textClass: "text-accent",
  },
  {
    icon: Database,
    value: "< 1%",
    label: "Memory Overhead",
    borderClass: "border-success/20",
    textClass: "text-success",
  },
];

const workflowSteps = [
  {
    title: "Step 1: Base Model Training",
    colorClass: "text-primary",
    borderClass: "border-l-primary",
    description:
      "Start with a standard transformer architecture trained on general data. This provides the foundational knowledge and language understanding capabilities.",
  },
  {
    title: "Step 2: LUT Integration",
    colorClass: "text-secondary",
    borderClass: "border-l-secondary",
    description:
      "Add a lightweight lookup table layer to the some of the transformer blocks. This layer stores high dimensional transformations without modifying the base model weights.",
  },
  {
    title: "Step 3: Continuous Adaptation",
    colorClass: "text-accent",
    borderClass: "border-l-accent",
    description:
      "As new data arrives, update the LUT by adding entries that steer predictions toward desired behaviors. This happens in seconds, not hours or days.",
  },
  {
    title: "Step 4: Real-Time Inference",
    colorClass: "text-success",
    borderClass: "border-l-success",
    description:
      "During inference, the model retrieves relevant corrections from the LUT and applies them to its outputs, enabling personalized responses without retraining.",
  },
];

export default function Technology() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0">
          <img 
            src={technologyBg} 
            alt="Technology Background" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background/80" />
        </div>
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-6"
            variants={fadeInUp(0.1)}
          >
            <h1 className="text-primary">The Technology Behind Astarus</h1>
            <p className="text-xl text-muted-foreground">
              A revolutionary approach to continuous learning in large language models
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Architecture Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto"
            variants={staggerContainer(0.2, 0.2)}
          >
            <motion.div className="space-y-6" variants={fadeInUp(0.1)}>
              <h2 className="text-foreground">Memory-Augmented Architecture</h2>
              <p className="text-lg text-muted-foreground">
                Our LUT (Lookup Table) augmented transformers represent a paradigm shift in how AI models learn and adapt.
              </p>
              <motion.div className="space-y-4" variants={staggerContainer(0.1, 0.1)}>
                <motion.div className="flex gap-3" variants={fadeInUp(0.05)}>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">No Backpropagation Required</h4>
                    <p className="text-muted-foreground">Updates happen through simple table lookups, not expensive gradient descent</p>
                  </div>
                </motion.div>
                <motion.div className="flex gap-3" variants={fadeInUp(0.1)}>
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Internal Embeddings</h4>
                    <p className="text-muted-foreground">Uses the model's native representation space for seamless integration</p>
                  </div>
                </motion.div>
                <motion.div className="flex gap-3" variants={fadeInUp(0.15)}>
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Scalable Updates</h4>
                    <p className="text-muted-foreground">Add new knowledge by simply appending rows to the lookup table</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeInUp(0.2)} whileHover={scaleOnHover.whileHover} whileTap={scaleOnHover.whileTap} transition={scaleOnHover.transition}>
              <img 
                src={continuousLearning} 
                alt="Continuous Learning" 
                className="w-full rounded-lg shadow-xl border border-border"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Performance Metrics */}
      <motion.section
        className="py-20 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={fadeInUp(0.1)}>
            <h2 className="text-foreground mb-4">Proven Performance</h2>
            <p className="text-lg text-muted-foreground">
              Benchmarked across multiple model sizes and domains
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer(0.15, 0.2)}
          >
            {performanceMetrics.map(({ icon: Icon, value, label, borderClass, textClass }, index) => (
              <motion.div
                key={label}
                variants={fadeInUp(index * 0.05)}
                whileHover={scaleOnHover.whileHover}
                whileTap={scaleOnHover.whileTap}
                transition={scaleOnHover.transition}
              >
                <Card className={`p-6 text-center card-hover border-2 ${borderClass}`}>
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${textClass}`} />
                  <div className={`text-4xl font-bold mb-2 ${textClass}`}>{value}</div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Technical Details */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.h2 className="text-foreground mb-12 text-center" variants={fadeInUp(0.1)}>
              How It Works
            </motion.h2>
            
            <motion.div className="space-y-8" variants={staggerContainer(0.15, 0.2)}>
              {workflowSteps.map(({ title, colorClass, borderClass, description }, index) => (
                <motion.div key={title} variants={fadeInUp(index * 0.05)}>
                  <Card className={`p-8 border-l-4 ${borderClass}`}>
                    <h3 className={`text-2xl font-bold mb-4 ${colorClass}`}>{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
