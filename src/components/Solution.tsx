import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import solutionImage from "@/assets/solution-visual.jpg";
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
      className="py-24 px-4 relative"
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
          <h2 className="text-foreground">Our Solution</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We've developed a <span className="text-primary font-semibold">memory-augmented transformer architecture</span> that adds a small, trainable lookup table (LUT) layer to the some of the transformer blocks.
          </p>
        </motion.div>

        {/* Solution Image */}
        <motion.div
          className="max-w-5xl mx-auto mb-16"
          variants={fadeInUp(0.2)}
        >
          <motion.img
            src={solutionImage}
            alt="Memory-Augmented Architecture"
            className="w-full rounded-lg shadow-lg border border-border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto"
          variants={staggerContainer(0.2, 0.2)}
        >
          {/* Left side - explanation */}
          <motion.div className="space-y-6" variants={fadeInUp(0.2)}>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Learn how our memory-augmented architecture enables real-time model adaptation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              During inference, the LUT maps activation keys to corrective logits that are added to the model output. Updating the LUT is as simple as adding rows to a table, no external dependencies.
            </p>
            <motion.div className="pt-4 space-y-4" variants={staggerContainer(0.1, 0.1)}>
              {features.map((feature, index) => (
                <motion.div key={index} className="flex gap-3" variants={fadeInUp(index * 0.05)}>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                <h3 className="text-2xl font-bold text-foreground">How It Works</h3>

                <motion.div className="space-y-4" variants={staggerContainer(0.15, 0.1)}>
                  <motion.div className="p-4 rounded-lg bg-secondary border" variants={fadeInUp(0.05)}>
                    <div className="text-sm font-semibold text-primary mb-2">Step 1: Inference</div>
                    <p className="text-sm text-muted-foreground">Model generates transformations in some of the transformer blocks</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-primary/30" />
                  </div>

                  <motion.div className="p-4 rounded-lg bg-secondary border" variants={fadeInUp(0.1)}>
                    <div className="text-sm font-semibold text-primary mb-2">Step 2: Lookup</div>
                    <p className="text-sm text-muted-foreground">LUT matches activations to stored correction patterns</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-primary/30" />
                  </div>

                  <motion.div className="p-4 rounded-lg bg-secondary border" variants={fadeInUp(0.15)}>
                    <div className="text-sm font-semibold text-primary mb-2">Step 3: Correction</div>
                    <p className="text-sm text-muted-foreground">Corrective logits are added to output, steering predictions</p>
                  </motion.div>

                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-primary/30" />
                  </div>

                  <motion.div className="p-4 rounded-lg bg-primary/10 border border-primary" variants={fadeInUp(0.2)}>
                    <div className="text-sm font-semibold text-primary mb-2">Result</div>
                    <p className="text-sm text-foreground font-medium">Personalized, adapted output in real-time</p>
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
