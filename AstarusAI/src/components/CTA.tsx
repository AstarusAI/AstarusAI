import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, scaleOnHover } from "@/lib/motion";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <motion.section
      className="py-24 px-4 relative overflow-hidden bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn()}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      <div className="container relative z-10">
        <motion.div
          variants={fadeInUp(0.1)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-4xl mx-auto p-12 bg-white border-2 border-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="text-center space-y-8 relative z-10">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border-2 border-primary/20 mb-2">
                <span className="text-sm font-semibold text-primary">Get Involved</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Ready to Learn More?</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                We're currently in stealth mode and seeking strategic partners and investors. Join us in building the future of continuously learning AI.
              </p>

              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" variants={fadeInUp(0.2)}>
                <Link to="/contact">
                  <Button size="lg" className="group bg-primary text-white font-semibold px-8 py-6 rounded-lg shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact for Investment
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link to="/technology">
                  <Button size="lg" className="group relative bg-white border-2 border-secondary/30 text-gray-900 font-semibold px-8 py-6 rounded-lg shadow-xl hover:bg-secondary/5 hover:scale-105 transition-all duration-300 hover:border-secondary/50">
                    <span className="relative z-10">Request Technical Brief</span>
                  </Button>
                </Link>
              </motion.div>

              <motion.div className="pt-8 border-t border-gray-200" variants={fadeInUp(0.3)}>
                <p className="text-sm text-gray-600 font-medium">
                  For partnership inquiries, technical questions, or investor relations, reach out to us.
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};
