import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Real-Time Learning", description: "Update model behavior in seconds with append-only lookup tables that require negligible compute.", image: "/futuristic_ai_techno_65818c05.jpg" },
  { title: "Native Integration", description: "Uses the model's internal embeddings — no complex RAG infrastructure needed.", image: "/digital_transformati_bcf974ad.jpg" },
  { title: "Cost-Effective", description: "Dramatically lower compute and infrastructure costs compared to fine-tuning.", image: "/complex_infrastructu_67a3236a.jpg" },
  { title: "Continuous Improvement", description: "The model accumulates corrections over time, becoming better automatically.", image: "/brain_artificial_int_76a4f2c5.jpg" },
];

const steps = [
  { step: "01", title: "Inference", description: "Model processes input and generates embeddings at selected layers.", color: "primary" },
  { step: "02", title: "Lookup", description: "LUT searches for matching embeddings and retrieves correction vectors.", color: "secondary" },
  { step: "03", title: "Correction", description: "Corrections are applied to logits, steering predictions toward learned behavior.", color: "primary" },
  { step: "04", title: "Output", description: "Personalized, adapted response is generated in real-time.", color: "secondary" },
];

export const Solution = () => {
  return (
    <motion.section
      className="relative py-20 sm:py-24 md:py-28 lg:py-28 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden"
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={fadeIn()}
    >
      {/* Clean gradient background — no busy image overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />

      <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
        {/* Header — crisp, minimal */}
        <motion.div
          className="text-center mb-14 sm:mb-16 lg:mb-20"
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 mb-6"
            variants={fadeInUp(0)}
          >
            Our Innovation
          </motion.span>
          <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-foreground tracking-tight mb-6" variants={fadeInUp(0)}>
            Memory-Augmented{" "}
            <span className="text-primary">Transformers</span>
          </motion.h2>
          <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" variants={fadeInUp(0)}>
            A breakthrough architecture that adds a small, trainable lookup table (LUT) layer to transformer blocks, enabling instant learning.
          </motion.p>
        </motion.div>

        {/* Two-column layout: features + how it works */}
        <motion.div
          className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.1, 0.1)}
        >
          {/* Key Advantages — clean cards with integrated images */}
          <motion.div className="space-y-6" variants={fadeInUp(0)}>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Key Advantages</h3>
            <div className="space-y-4">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp(0.08)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group overflow-hidden border border-border/60 hover:border-primary/30 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-36 h-32 sm:h-auto sm:min-h-[120px] flex-shrink-0">
                        <img
                          src={item.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent sm:from-black/20" />
                      </div>
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
                        <h4 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h4>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <Link to="/chat" className="inline-block">
              <Button className="rounded-xl bg-primary text-primary-foreground min-h-[48px] px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
                Try It Yourself
              </Button>
            </Link>
          </motion.div>

          {/* How It Works — streamlined steps */}
          <motion.div variants={fadeInUp(0.15)}>
            <Card className="overflow-hidden border border-border/60 bg-white rounded-2xl shadow-sm">
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <img
                  src="/digital_transformati_88f18833.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-0 left-0 right-0 p-5 font-display text-xl sm:text-2xl font-bold text-white">
                  How It Works
                </h3>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                {steps.map((s, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                        s.color === "primary" ? "bg-primary text-primary-foreground" : "bg-neutral-900 text-white"
                      }`}
                    >
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="font-display font-bold text-foreground mb-1">{s.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t border-border/60">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-primary">Result:</span> Personalized output with no retraining.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
