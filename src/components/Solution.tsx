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
      className="relative py-16 sm:py-20 md:py-24 lg:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden bg-background bg-dots-subtle"
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={fadeIn()}
    >
      <div className="absolute inset-0">
        <img src="/brain_artificial_int_e9d43400.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/92" />
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full border border-primary/10 pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-48 h-48 rounded-3xl bg-secondary/5 pointer-events-none" />

      <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
        <motion.div
          className="max-w-3xl lg:max-w-4xl xl:max-w-[42rem] mx-auto text-center mb-10 sm:mb-14 lg:mb-16 xl:mb-20 space-y-3 sm:space-y-4 lg:space-y-5"
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase mx-auto font-accent" variants={fadeInUp(0)}>
            Our Innovation
          </motion.div>
          <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-black px-2" variants={fadeInUp(0)}>
            Memory-Augmented{" "}
            <span className="text-primary">Transformers</span>
          </motion.h2>
          <motion.p className="text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto px-4 font-sans font-medium" variants={fadeInUp(0)}>
            A breakthrough architecture that adds a small, trainable lookup table (LUT) layer to transformer blocks, enabling instant learning.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 items-start max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.1, 0.1)}
        >
          <motion.div className="space-y-4 sm:space-y-5" variants={fadeInUp(0)}>
            <motion.div variants={fadeInUp(0)}>
              <h3 className="font-display text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Key Advantages</h3>
              <div className="grid gap-2 sm:gap-3">
                {features.map((item, index) => (
                  <motion.div key={index} variants={fadeInUp(0.08)} whileHover={{ x: index % 2 === 1 ? -4 : 4 }} transition={{ duration: 0.25 }}>
                    <Card className={`p-0 overflow-hidden bg-card border border-border hover:border-primary/20 transition-all duration-300 shadow-sm ${
                      index === 0 ? "rounded-xl" : index % 2 === 1 ? "rounded-lg rounded-l-xl" : "rounded-lg rounded-r-xl"
                    }`}>
                      <div className={`flex flex-col sm:flex-row ${index % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
                        <div className="relative w-full sm:w-20 md:w-24 lg:w-28 sm:min-h-[72px] aspect-video sm:aspect-square flex-shrink-0">
                          <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-primary/25" />
                        </div>
                        <div className="p-3 sm:p-4 min-w-0 flex-1">
                          <h4 className="font-display font-bold text-foreground mb-0.5 text-base sm:text-lg">{item.title}</h4>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeInUp(0.2)} className="px-0">
              <Link to="/chat" className="block w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground min-h-[44px] touch-manipulation text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-4 font-semibold hover:bg-primary/90 transition-colors font-accent">
                    Try It Yourself
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp(0.15)} className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-primary/5 blur-xl pointer-events-none" />
            <Card className="relative p-4 sm:p-5 md:p-6 lg:p-7 bg-card border border-border backdrop-blur-sm rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-24 sm:h-28 lg:h-32 rounded-lg overflow-hidden mb-4 sm:mb-5 lg:mb-6">
                <img src="/digital_transformati_88f18833.jpg" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <h3 className="absolute bottom-0 left-0 right-0 p-3 font-display text-lg sm:text-xl font-bold text-white drop-shadow-md">
                  How It Works
                </h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {steps.map((s, index) => (
                  <motion.div
                    key={index}
                    className="relative flex gap-2.5 sm:gap-3"
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {index < steps.length - 1 && (
                      <div className="absolute left-5 sm:left-6 top-10 bottom-0 w-px bg-border" />
                    )}
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-accent font-bold text-primary-foreground text-xs sm:text-sm ${
                      s.color === "primary" ? "bg-primary" : "bg-black"
                    }`}>
                      {s.step}
                    </div>
                    <div className="pt-0.5 min-w-0 flex-1">
                      <h4 className="font-display font-bold text-foreground mb-0.5 text-base sm:text-lg">{s.title}</h4>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">{s.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-4 sm:mt-5 p-2.5 sm:p-3 rounded-lg bg-primary/10 border border-primary/20"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <p className="text-sm sm:text-base text-foreground leading-relaxed font-sans">
                  <span className="font-semibold">Result:</span> Personalized, adapted output with no retraining required.
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
