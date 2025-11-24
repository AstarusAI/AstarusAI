import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
    >
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/AIBackground1.webp"
          alt="AI Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-primary/40 shadow-lg"
            variants={fadeInUp(0)}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Next-Generation AI Architecture</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 className="text-white font-bold drop-shadow-2xl [text-shadow:_0_4px_20px_rgba(0,0,0,0.8)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-2" variants={fadeInUp(0.1)}>
            AI That{" "}
            <span className="text-primary drop-shadow-lg [text-shadow:_0_2px_10px_rgba(59,130,246,0.6)]">Learns</span>
            {" "}Continuously
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-xl [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)] px-4"
            variants={fadeInUp(0.2)}
          >
            Introducing memory-augmented transformers: the breakthrough that enables real-time learning and adaptation without expensive fine-tuning or complex infrastructure.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={fadeInUp(0.3)}
          >
            <Link to="/investors">
              <Button 
                size="default" 
                className="group bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  For Investors
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/technology">
              <Button 
                size="default" 
                className="bg-white text-foreground font-semibold px-6 py-3 rounded-lg shadow-xl hover:bg-white/90 hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Key metric */}
          <motion.div
            className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 text-center px-4"
            variants={fadeInUp(0.4)}
          >
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-lg [text-shadow:_0_2px_8px_rgba(59,130,246,0.5)]">Up to 75%</div>
              <div className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">Perplexity Reduction</div>
            </div>
            <div className="hidden sm:block w-px h-10 md:h-12 bg-white/40" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary drop-shadow-lg [text-shadow:_0_2px_8px_rgba(168,85,247,0.5)]">Seconds</div>
              <div className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">To Train</div>
            </div>
            <div className="hidden sm:block w-px h-10 md:h-12 bg-white/40" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-lg [text-shadow:_0_2px_8px_rgba(59,130,246,0.5)]">Zero</div>
              <div className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-md [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">External Dependencies</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
