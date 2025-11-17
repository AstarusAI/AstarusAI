import { Card } from "@/components/ui/card";
import { AlertCircle, DollarSign, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const colorThemes = [
  {
    border: "border-primary",
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/5",
    iconColor: "text-secondary",
  },
  {
    border: "border-primary",
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
  },
  {
    border: "border-secondary",
    iconBg: "bg-secondary/5",
    iconColor: "text-secondary",
  },
];

const problems = [
  {
    icon: DollarSign,
    title: "Expensive Fine-Tuning",
    description: "Traditional model adaptation requires costly compute resources and full retraining cycles.",
    gradient: "from-red-500/20 via-orange-500/20 to-yellow-500/20",
    imageGradient: "bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400",
    image: "/expensivefinetuning.png",
  },
  {
    icon: Clock,
    title: "Slow to Adapt",
    description: "Current methods can't update in real-time, making personalization impractical at scale.",
    gradient: "from-blue-500/20 via-indigo-500/20 to-purple-500/20",
    imageGradient: "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400",
    image: "/slow.png",
  },
  {
    icon: AlertCircle,
    title: "Catastrophic Forgetting",
    description: "Backpropagation-based approaches struggle with continuous learning without losing previous knowledge.",
    gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
    imageGradient: "bg-gradient-to-br from-pink-400 via-rose-400 to-red-400",
    image: "/forget.png",
  },
  {
    icon: Zap,
    title: "Complex RAG Systems",
    description: "External retrieval augmentation adds infrastructure complexity and latency without true learning.",
    gradient: "from-cyan-500/20 via-teal-500/20 to-green-500/20",
    imageGradient: "bg-gradient-to-br from-cyan-400 via-teal-400 to-green-400",
    image: "/complex.png",
  },
];

// Square image component
const ProblemOctagon = ({ problem, index, position }: { problem: typeof problems[0], index: number, position: string }) => {
  const Icon = problem.icon;
  const theme = colorThemes[index] ?? colorThemes[0];
  const strokeColors = ['primary', 'secondary', 'primary', 'secondary'];
  const strokeColor = strokeColors[index] || 'primary';
  
  const positionClasses = {
    'top-left': 'flex-row',
    'top-right': 'flex-row-reverse',
    'bottom-left': 'flex-row',
    'bottom-right': 'flex-row-reverse',
  };
  
  const textAlignClasses = {
    'top-left': 'text-left',
    'top-right': 'text-right',
    'bottom-left': 'text-left',
    'bottom-right': 'text-right',
  };

  return (
    <div className={`flex items-center gap-6 ${positionClasses[position as keyof typeof positionClasses]}`}>
      {/* Square with image */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="relative group w-48 h-48"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Square image container */}
          <div className="relative w-full h-full overflow-hidden rounded-lg bg-white">
            <img 
              src={problem.image} 
              alt={problem.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
          </div>
          
          {/* Square border */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <filter id={`glow-${index}`}>
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="none"
              stroke={`hsl(var(--${strokeColor}))`}
              strokeWidth="2"
              rx="8"
              className="group-hover:stroke-[2.5] transition-all duration-300"
              filter={`url(#glow-${index})`}
            />
          </svg>
          
          {/* Icon badge on square */}
          <div className={`absolute -top-2 -right-2 w-14 h-14 rounded-full ${theme.iconBg} flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl group-hover:scale-110 transition-transform duration-300 z-10`}>
            <Icon className={`w-7 h-7 ${theme.iconColor}`} />
          </div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 ${theme.iconBg} rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10`}></div>
        </motion.div>
      </div>

      {/* Text content outside square */}
      <div className={`flex-1 ${textAlignClasses[position as keyof typeof textAlignClasses]}`}>
        <motion.div
          initial={{ opacity: 0, x: position.includes('left') ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
            {problem.title}
          </h3>
          <p className="text-base text-gray-700 leading-relaxed max-w-md">
            {problem.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export const Problem = () => {
  return (
    <motion.section
      className="pt-12 pb-8 px-4 relative bg-white overflow-hidden rounded-t-3xl -mt-12 z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp(0)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Header section - centered */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 space-y-4 -mt-8"
          variants={fadeInUp(0.1)}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border-2 border-primary/20">
            <span className="text-sm font-semibold text-primary">Challenges We Solve</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            The Problem
          </h2>
          <p className="text-xl text-gray-700 font-medium leading-relaxed">
            Current LLMs lack the ability to learn continuously and adapt in real-time — a fundamental limitation that hinders personalization and enterprise adoption.
          </p>
        </motion.div>

        {/* Square N-pattern layout */}
        <div className="relative max-w-7xl mx-auto py-12 min-h-[600px]">
          {/* Grid layout for N pattern: 2 columns, 2 rows */}
          <div className="grid grid-cols-2 gap-12 md:gap-16 h-full">
            {/* Top Left - Problem 0 */}
            <motion.div
              key={0}
              className="relative"
              initial={{ opacity: 0, scale: 0.5, x: -100, y: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0, type: "spring", stiffness: 100 }}
            >
              <ProblemOctagon problem={problems[0]} index={0} position="top-left" />
            </motion.div>

            {/* Top Right - Problem 2 */}
            <motion.div
              key={2}
              className="relative"
              initial={{ opacity: 0, scale: 0.5, x: 100, y: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <ProblemOctagon problem={problems[2]} index={2} position="top-right" />
            </motion.div>

            {/* Bottom Left - Problem 1 */}
            <motion.div
              key={1}
              className="relative"
              initial={{ opacity: 0, scale: 0.5, x: -100, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 100 }}
            >
              <ProblemOctagon problem={problems[1]} index={1} position="bottom-left" />
            </motion.div>

            {/* Bottom Right - Problem 3 */}
            <motion.div
              key={3}
              className="relative"
              initial={{ opacity: 0, scale: 0.5, x: 100, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <ProblemOctagon problem={problems[3]} index={3} position="bottom-right" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
