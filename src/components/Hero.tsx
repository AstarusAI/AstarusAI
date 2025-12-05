import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Zap, Brain, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/AIBackground1.webp"
          alt="AI Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 mix-blend-overlay" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl floating-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl floating" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-2xl floating-slow" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark glass-border shadow-2xl"
            variants={fadeInUp(0)}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-white/90">Next-Generation AI Architecture</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          <motion.h1 
            className="font-bold text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
            variants={fadeInUp(0.1)}
          >
            AI That{" "}
            <span className="relative inline-block">
              <span className="text-gradient">Learns</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 3 150 3 198 8" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                    <stop offset="100%" stopColor="hsl(25, 95%, 53%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br className="hidden sm:block" />
            <span className="text-white/95"> Continuously</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={fadeInUp(0.2)}
          >
            Introducing memory-augmented transformers: the breakthrough that enables 
            <span className="text-primary font-semibold"> real-time learning</span> and adaptation 
            without expensive fine-tuning or complex infrastructure.
          </motion.p>

          <motion.div
            className="flex items-center justify-center pt-4"
            variants={fadeInUp(0.3)}
          >
            <Link to="/demo">
              <Button 
                size="lg" 
                className="group cta-button text-base px-8 py-6 h-auto"
              >
                <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Try Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            variants={fadeInUp(0.4)}
          >
            <div className="glass-dark glass-border rounded-2xl p-5 text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">75%</div>
              <div className="text-sm text-white/70 font-medium">Perplexity Reduction</div>
            </div>

            <div className="glass-dark glass-border rounded-2xl p-5 text-center group hover:glow-secondary transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gradient-secondary mb-1">&lt;20s</div>
              <div className="text-sm text-white/70 font-medium">Training Time</div>
            </div>

            <div className="glass-dark glass-border rounded-2xl p-5 text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">100%</div>
              <div className="text-sm text-white/70 font-medium">Knowledge Retention</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div 
              className="w-1.5 h-3 bg-white/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
