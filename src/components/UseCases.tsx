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
      className="py-24 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white"
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
          <div className="inline-block px-4 py-2 rounded-full bg-secondary/5 border-2 border-secondary/20 mb-4">
            <span className="text-sm font-semibold text-secondary">Real-World Impact</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Transformative Applications</h2>
          <p className="text-xl text-gray-700 font-medium leading-relaxed">
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
                  className={`p-8 border-2 card-hover group relative overflow-hidden ${
                    index % 2 === 0 ? 'bg-primary/5 border-primary/20' : 'bg-secondary/5 border-secondary/20'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                    index % 2 === 0 ? 'from-primary/20' : 'from-secondary/20'
                  } to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="relative space-y-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border-2 shadow-lg ${
                          index % 2 === 0 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-secondary/5 border-secondary/20'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            index % 2 === 0 ? 'text-primary' : 'text-secondary'
                          }`}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold text-gray-900 mb-2 group-hover:${
                          index % 2 === 0 ? 'text-primary' : 'text-secondary'
                        } transition-colors`}>{useCase.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">{useCase.description}</p>
                    <div className="pt-2">
                      <div className={`text-sm font-bold mb-3 ${
                        index % 2 === 0 ? 'text-primary' : 'text-secondary'
                      }`}>Key Applications:</div>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, idx) => (
                          <motion.span
                            key={idx}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 ${
                              index % 2 === 0
                                ? 'bg-primary/5 border-primary/20 text-primary'
                                : 'bg-secondary/5 border-secondary/20 text-secondary'
                            }`}
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
