import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp } from "@/lib/motion";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <motion.section
      className="relative py-24 px-4 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn()}
    >
      <div className="absolute inset-0 bg-gradient-primary" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={fadeInUp(0.1)}
        >
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-8 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience the Future of AI?
          </h2>
          
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Try our interactive demo and see how memory-augmented transformers 
            enable real-time learning and personalization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 h-auto text-base shadow-lg group">
                <Play className="w-5 h-5 mr-2" />
                Try Demo Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 h-auto text-base backdrop-blur-sm">
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
