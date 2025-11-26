import { Card } from "@/components/ui/card";
import { Users, Building2, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const useCases = [
  {
    icon: Users,
    title: "Personalized AI Assistants",
    description: "Consumer models that remember user preferences, tone, and past decisions — creating truly personalized experiences without privacy concerns.",
    examples: ["Custom GPTs", "Personal productivity tools", "Content creators"],
    color: "primary",
  },
  {
    icon: Building2,
    title: "Enterprise Adoption",
    description: "Companies can inject firm-specific knowledge, style guides, and domain expertise directly into model behavior.",
    examples: ["Legal firms", "Financial analysts", "Medical professionals"],
    color: "secondary",
  },
  {
    icon: GraduationCap,
    title: "Adaptive Learning Systems",
    description: "Educational AI that continuously adapts to individual student learning patterns and knowledge gaps.",
    examples: ["AI tutors", "Training platforms", "Skill development"],
    color: "primary",
  },
  {
    icon: Briefcase,
    title: "Operational Intelligence",
    description: "Models that improve at routine business tasks through accumulated corrections and organizational knowledge.",
    examples: ["Email automation", "Code generation", "Document summarization"],
    color: "secondary",
  },
];

export const UseCases = () => {
  return (
    <motion.section
      className="relative py-24 px-4 bg-gradient-to-b from-muted/30 to-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeIn()}
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 space-y-6"
          variants={fadeInUp(0.1)}
        >
          <div className="section-badge mx-auto">
            <Briefcase className="w-4 h-4 text-secondary" />
            <span className="text-secondary">Real-World Impact</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Transformative{" "}
            <span className="text-gradient-secondary">Applications</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enable use cases that were previously impossible or economically unfeasible 
            with traditional approaches.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
          variants={staggerContainer(0.1, 0.1)}
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isPrimary = useCase.color === "primary";
            
            return (
              <motion.div
                key={index}
                variants={fadeInUp(index * 0.1)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <Icon className={`w-full h-full ${isPrimary ? "text-primary" : "text-secondary"}`} />
                  </div>

                  <div className="p-8 relative z-10">
                    <div className="flex items-start gap-5 mb-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${
                        isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className={`text-xl sm:text-2xl font-bold flex-1 pt-2 transition-colors duration-300 ${
                        isPrimary ? "group-hover:text-primary" : "group-hover:text-secondary"
                      }`}>
                        {useCase.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {useCase.description}
                    </p>

                    <div className="space-y-3">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${
                        isPrimary ? "text-primary" : "text-secondary"
                      }`}>
                        Key Applications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, idx) => (
                          <motion.span
                            key={idx}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                              isPrimary
                                ? "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                                : "bg-secondary/5 border-secondary/20 text-secondary hover:bg-secondary/10"
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {example}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                    isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                  }`} />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          variants={fadeInUp(0.4)}
        >
          <Link to="/investors">
            <Button className="cta-button group">
              <span>Explore Investment Opportunities</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};
