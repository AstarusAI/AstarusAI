import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const features = [
  {
    title: "Real-Time Learning",
    description: "Update model behavior in seconds with append-only lookup tables that require negligible compute.",
  },
  {
    title: "Native Integration",
    description: "Uses the model's internal embeddings — no complex RAG infrastructure needed.",
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
    <motion.section
      className="py-24 px-4 relative bg-black rounded-t-3xl -mt-12 z-10"
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
          <h2 className="text-white text-4xl font-bold">Our Solution</h2>
          <p className="text-xl text-white/90 leading-relaxed font-medium">
            We've developed a <span className="text-primary font-bold">memory-augmented transformer architecture</span> that adds a small, trainable lookup table (LUT) layer to the some of the transformer blocks.
          </p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto"
          variants={staggerContainer(0.2, 0.2)}
        >
          {/* Left side - explanation */}
          <motion.div className="space-y-6" variants={fadeInUp(0.2)}>
            <p className="text-xl text-white/90 leading-relaxed font-semibold">
              Learn how our memory-augmented architecture enables real-time model adaptation.
            </p>
            <p className="text-white/80 leading-relaxed">
              During inference, the LUT maps activation keys to corrective logits that are added to the model output. Updating the LUT is as simple as adding rows to a table, no external dependencies.
            </p>
            <motion.div className="pt-4 space-y-4" variants={staggerContainer(0.1, 0.1)}>
              {features.map((feature, index) => (
                <motion.div key={index} className="flex gap-3" variants={fadeInUp(index * 0.05)}>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/80">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - visual card */}
          <motion.div
            variants={fadeInUp(0.3)}
            whileHover={scaleOnHover.whileHover}
            whileTap={scaleOnHover.whileTap}
            transition={scaleOnHover.transition}
          >
            <Card className="p-8 bg-card border relative overflow-hidden">
              <div className="relative space-y-6">
                <h3 className="text-2xl font-bold text-primary">How It Works</h3>

                <motion.div className="space-y-2" variants={staggerContainer(0.15, 0.1)}>
                  <motion.div className="p-3 rounded-lg bg-primary/5 border-2 border-primary/20" variants={fadeInUp(0.05)}>
                    <div className="text-sm font-bold text-primary mb-1">Step 1: Inference</div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Model gets feedback</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-primary/50" />
                  </div>

                  <motion.div className="p-3 rounded-lg bg-secondary/5 border-2 border-secondary/20" variants={fadeInUp(0.1)}>
                    <div className="text-sm font-bold text-secondary mb-1">Step 2: Lookup</div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">The Lookup Table (LUT) updates using calculated embedding transformations.</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-secondary/50" />
                  </div>

                  <motion.div className="p-3 rounded-lg bg-primary/5 border-2 border-primary/20" variants={fadeInUp(0.15)}>
                    <div className="text-sm font-bold text-primary mb-1">Step 3: Correction</div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">These updates adjust the logits, steering future predictions.</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-4 bg-primary/50" />
                  </div>

                  <motion.div className="p-3 rounded-lg bg-secondary/10 border-2 border-secondary" variants={fadeInUp(0.2)}>
                    <div className="text-sm font-bold text-secondary mb-1">Result</div>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-bold">Personalized, adapted output in real-time</p>
                  </motion.div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
