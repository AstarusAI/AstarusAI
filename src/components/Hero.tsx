import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export const Hero = () => {
  return (
    <motion.section
      className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-20 sm:py-24 md:py-28 overflow-hidden bg-white"
      initial="hidden"
      animate="visible"
      variants={fadeIn()}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/AIBackground1.webp"
          alt="AI and neural networks"
          className="w-full h-full object-cover scale-105"
        />
      </motion.div>

      {/* Geometric shapes – black and white only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { className: "absolute top-20 right-[15%] w-32 h-32 rounded-3xl border-2 border-white/30 rotate-12", delay: 0.2 },
          { className: "absolute bottom-32 left-[10%] w-24 h-24 rounded-full border-2 border-white/25", delay: 0.35 },
          { className: "absolute top-1/2 left-[5%] w-2 h-24 bg-black/20 rounded-full rotate-[-20deg]", delay: 0.5 },
          { className: "absolute bottom-1/4 right-[8%] w-40 h-40 rounded-[2rem] border-2 border-black/10", delay: 0.4 },
          { className: "absolute top-[40%] right-[25%] w-16 h-16 rounded-xl border-2 border-black/20 rotate-45", delay: 0.55 },
        ].map((shape, i) => (
          <motion.div
            key={i}
            className={shape.className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: shape.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto w-full px-2">
        <motion.div
          className="max-w-4xl lg:max-w-5xl xl:max-w-[56rem] mx-auto text-center space-y-5 sm:space-y-6 md:space-y-8 lg:space-y-9"
          variants={staggerContainer(0.1, 0.15)}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h1
            className="font-display font-bold text-black text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.08] px-2"
            variants={fadeInUp(0.08)}
          >
            AI That{" "}
            <span className="text-black">Learns</span>
            <br className="hidden sm:block" />
            <span className="text-black"> Continuously</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-xl text-white max-w-2xl lg:max-w-[36rem] mx-auto leading-relaxed px-4 font-medium font-sans"
            variants={fadeInUp(0.12)}
          >
            Memory-augmented transformers that enable{" "}
            <span className="text-white font-semibold">real-time learning</span> and adaptation
            without expensive fine-tuning or complex infrastructure.
          </motion.p>

          <motion.div className="flex items-center justify-center pt-14 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 px-4" variants={fadeInUp(0.16)}>
            <Link to="/demo" className="w-full sm:w-auto inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-3xl">
              <motion.span
                className="group flex items-center justify-center gap-2 w-full sm:w-auto rounded-3xl min-h-[44px] sm:min-h-[48px] px-4 sm:px-5 py-2.5 sm:py-3 touch-manipulation font-semibold text-xs sm:text-sm text-white bg-black border-2 border-black hover:bg-neutral-800 hover:border-neutral-700 active:scale-[0.98] transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white text-black group-hover:bg-white/95 transition-colors duration-300">
                  <Play className="w-4 h-4 sm:w-4 sm:h-4 fill-black stroke-black" strokeWidth={2} />
                </span>
                Try Interactive Demo
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-black/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-2.5 bg-black/60 rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};
