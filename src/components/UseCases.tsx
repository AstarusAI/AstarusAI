import { Card } from "@/components/ui/card";
import { Users, Building2, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, scaleOnHover } from "@/lib/motion";

const useCases = [
  {
    icon: Users,
    title: "Personalized AI Assistants",
    description: "Consumer models that remember user preferences, tone, and past decisions — creating truly personalized experiences without privacy concerns.",
    examples: ["Custom GPTs", "Personal productivity tools", "Content creators"],
  },
  {
    icon: Building2,
    title: "Enterprise Adoption",
    description: "Companies can inject firm-specific knowledge, style guides, and domain expertise directly into model behavior.",
    examples: ["Legal firms", "Financial analysts", "Medical professionals"],
  },
  {
    icon: GraduationCap,
    title: "Adaptive Learning Systems",
    description: "Educational AI that continuously adapts to individual student learning patterns and knowledge gaps.",
    examples: ["AI tutors", "Training platforms", "Skill development"],
  },
  {
    icon: Briefcase,
    title: "Operational Intelligence",
    description: "Models that improve at routine business tasks through accumulated corrections and organizational knowledge.",
    examples: ["Email automation", "Code generation", "Document summarization"],
  },
];

export const UseCases = () => {
  return (
    <motion.section
      className="py-24 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn()}
    >
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16 space-y-4"
          variants={fadeInUp(0.1)}
        >
          <h2 className="text-foreground">Transformative Applications</h2>
          <p className="text-xl text-muted-foreground">
            Enable use cases that were previously impossible or economically unfeasible.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer(0.2, 0.2)}
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp(index * 0.05)}
                whileHover={scaleOnHover.whileHover}
                whileTap={scaleOnHover.whileTap}
                transition={scaleOnHover.transition}
              >
                <Card
                  className="p-6 bg-card border-2 card-hover group"
                  style={{
                    borderColor:
                      index === 0
                        ? "hsl(var(--primary))"
                        : index === 1
                        ? "hsl(var(--secondary))"
                        : index === 2
                        ? "hsl(var(--accent))"
                        : "hsl(var(--success))",
                  }}
                >
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "hsl(var(--primary) / 0.1)"
                              : index === 1
                              ? "hsl(var(--secondary) / 0.1)"
                              : index === 2
                              ? "hsl(var(--accent) / 0.1)"
                              : "hsl(var(--success) / 0.1)",
                        }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon
                          className="w-7 h-7"
                          style={{
                            color:
                              index === 0
                                ? "hsl(var(--primary))"
                                : index === 1
                                ? "hsl(var(--secondary))"
                                : index === 2
                                ? "hsl(var(--accent))"
                                : "hsl(var(--success))",
                          }}
                        />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{useCase.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                    <div className="pt-2">
                      <div className="text-sm font-semibold text-primary mb-3">Key Applications:</div>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, idx) => (
                          <motion.span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-primary/10 text-sm text-foreground border border-primary/20"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {example}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
