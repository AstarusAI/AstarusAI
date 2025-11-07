import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, scaleOnHover } from "@/lib/motion";

export const CTA = () => {
  return (
    <motion.section
      className="py-24 px-4 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn()}
    >
      <div className="container relative">
        <motion.div
          variants={fadeInUp(0.1)}
          whileHover={scaleOnHover.whileHover}
          whileTap={scaleOnHover.whileTap}
          transition={scaleOnHover.transition}
        >
          <Card className="max-w-4xl mx-auto p-12 bg-card border shadow-lg">
            <div className="text-center space-y-8">
              <h2 className="text-foreground">Ready to Learn More?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're currently in stealth mode and seeking strategic partners and investors. Join us in building the future of continuously learning AI.
              </p>

              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" variants={fadeInUp(0.2)}>
                <Button variant="hero" size="lg" className="group">
                  <Mail className="w-5 h-5" />
                  Contact for Investment
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  Request Technical Brief
                </Button>
              </motion.div>

              <motion.div className="pt-8 border-t border-border" variants={fadeInUp(0.3)}>
                <p className="text-sm text-muted-foreground">
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
