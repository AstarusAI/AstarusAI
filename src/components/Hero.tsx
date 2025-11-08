import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-ai.jpg";
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
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="AI Neural Network"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background/80" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card backdrop-blur-sm border border-primary/30"
            variants={fadeInUp(0)}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Next-Generation AI Architecture</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 className="text-foreground" variants={fadeInUp(0.1)}>
            AI That{" "}
            <span className="text-primary">Learns</span>
            {" "}Continuously
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
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
              <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                For Investors
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/technology">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Key metric */}
          <motion.div
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
            variants={fadeInUp(0.4)}
          >
            <div>
              <div className="text-4xl font-bold text-primary">Up to 75%</div>
              <div className="text-sm text-muted-foreground">Perplexity Reduction</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold text-secondary">Seconds</div>
              <div className="text-sm text-muted-foreground">To Train</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div>
              <div className="text-4xl font-bold text-primary">Zero</div>
              <div className="text-sm text-muted-foreground">External Dependencies</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
