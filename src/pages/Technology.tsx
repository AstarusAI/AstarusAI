import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";

const performanceMetrics = [
  { value: "75%", label: "Perplexity Reduction", image: "/brain_artificial_int_76a4f2c5.jpg" },
  { value: "<20s", label: "Training Time", image: "/futuristic_ai_techno_65818c05.jpg" },
  { value: "100%", label: "Knowledge Retention", image: "/digital_transformati_88f18833.jpg" },
  { value: "<1%", label: "Memory Overhead", image: "/complex_infrastructu_67a3236a.jpg" },
];

const workflowSteps = [
  { step: "01", title: "Base Model Training", description: "Start with a standard transformer architecture trained on general data. This provides the foundational knowledge and language understanding capabilities." },
  { step: "02", title: "LUT Integration", description: "Add a lightweight lookup table layer to transformer blocks. This layer stores high dimensional transformations without modifying the base model weights." },
  { step: "03", title: "Continuous Adaptation", description: "As new data arrives, update the LUT by adding entries that steer predictions toward desired behaviors. This happens in seconds, not hours or days." },
  { step: "04", title: "Real-Time Inference", description: "During inference, the model retrieves relevant corrections from the LUT and applies them to its outputs, enabling personalized responses." },
];

const technicalFeatures = [
  { title: "Lightweight Gradient Updates", description: "Gradients are computed only for the LUT, not the full model, allowing fast, low-cost adaptation without retraining.", image: "/digital_transformati_bcf974ad.jpg" },
  { title: "Internal Embeddings", description: "Uses the model's native representation space for seamless integration with any transformer architecture.", image: "/brain_artificial_int_e9d43400.jpg" },
  { title: "Scalable Updates", description: "Add new knowledge by simply appending rows to the lookup table — no complex infrastructure required.", image: "/complex_infrastructu_67a3236a.jpg" },
];

export default function Technology() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — clear image, light overlay */}
      <motion.section
        className="relative pt-24 sm:pt-28 md:pt-28 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-14 xl:pb-16 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden safe-area-px min-h-[40vh] lg:min-h-[35vh] flex flex-col justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn()}
      >
        <div className="absolute inset-0">
          <img
            src="/futuristic_ai_techno_dc5f7c2e.jpg"
            alt="Technology"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
        </div>

        <div className="container relative z-10 max-w-4xl lg:max-w-5xl xl:max-w-[64rem] mx-auto text-center w-full">
          <motion.div variants={fadeInUp(0.1)} className="space-y-3 sm:space-y-4 lg:space-y-5">
            <p className="font-accent text-primary font-semibold text-xs uppercase tracking-wider">
              Deep Dive
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
              The Technology Behind <span className="text-primary-foreground">Astarus</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-accent">
              A revolutionary approach to continuous learning in large language models
              using memory-augmented transformer architecture.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics — image cards, motion, no icons */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 lg:py-14 xl:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-to-b from-muted/40 to-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
          <motion.div className="max-w-3xl lg:max-w-[72rem] mx-auto text-center mb-6 sm:mb-10 lg:mb-8" variants={fadeInUp(0.1)}>
            <p className="font-accent text-primary font-semibold text-xs uppercase tracking-wider mb-2 sm:mb-3">
              Proven Results
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              Performance <span className="text-primary">Metrics</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-accent">
              Benchmarked across multiple model sizes and domains
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-4 xl:gap-5"
            variants={staggerContainer(0.08, 0.05)}
          >
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={fadeInUp(0.1)}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group"
              >
                <Card className="overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant transition-all duration-300 h-full p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={metric.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                      <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                        {metric.value}
                      </div>
                      <p className="text-sm text-white/90 font-accent">{metric.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Our Architecture — unique pattern background */}
      <motion.section
        className="relative py-12 sm:py-16 md:py-20 lg:py-14 xl:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-white bg-pattern-architecture overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
          <motion.div className="max-w-3xl lg:max-w-[72rem] mx-auto text-center mb-6 sm:mb-10 lg:mb-8" variants={fadeInUp(0.1)}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              Memory-Augmented <span className="text-primary">Architecture</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-accent">
              Our LUT-augmented transformers represent a paradigm shift in how AI models learn and adapt.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-5 xl:gap-6"
            variants={staggerContainer(0.1, 0.05)}
          >
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp(index * 0.1)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden h-full border border-border bg-card shadow-soft hover:shadow-elegant hover:border-primary/20 transition-all duration-300 group">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={feature.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5 lg:p-4 xl:p-5">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground font-accent text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How it works — crossing image + steps */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 lg:py-14 xl:py-16 px-4 sm:px-6 md:px-8 lg:px-10 bg-muted/30 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/digital_transformati_88f18833.jpg"
            alt=""
            className="w-full max-w-2xl h-full max-h-[80vh] object-cover opacity-[0.07]"
          />
        </div>
        <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
          <motion.div className="max-w-3xl lg:max-w-[72rem] mx-auto text-center mb-6 sm:mb-10 lg:mb-8" variants={fadeInUp(0.1)}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-accent">
              A step-by-step guide to our memory-augmented training process
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl lg:max-w-[48rem] xl:max-w-[56rem] mx-auto space-y-2 lg:space-y-3"
            variants={staggerContainer(0.08, 0.05)}
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp(0.1)}
                className="relative"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-5 sm:left-6 top-12 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent hidden sm:block" />
                )}
                <Card className="p-4 sm:p-5 border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card/95 backdrop-blur-sm border border-border/80 hover:border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Step indicator: ring + label */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Step
                      </span>
                      <span
                        className="font-display text-sm font-bold text-primary w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ring-2 ring-primary/25 bg-primary/5"
                        aria-hidden
                      >
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground font-accent text-xs sm:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Experience It Yourself — compact, patterned, polished */}
      <motion.section
        className="relative py-10 sm:py-12 md:py-14 lg:py-12 xl:py-14 px-4 sm:px-6 md:px-8 lg:px-10 bg-gradient-dark overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0 bg-pattern-cta pointer-events-none" aria-hidden />
        <div className="container relative z-10 max-w-5xl lg:max-w-6xl mx-auto">
          <motion.div className="max-w-xl lg:max-w-2xl mx-auto text-center" variants={fadeInUp(0.1)}>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
              Experience It Yourself
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-accent mb-6 max-w-md mx-auto">
              Try our interactive demo and see how memory-augmented transformers
              enable real-time learning and personalization.
            </p>
            <Link to="/chat" className="inline-block">
              <motion.span
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 min-h-[44px] shadow-sm hover:shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 border border-primary/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Interactive Demo
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
