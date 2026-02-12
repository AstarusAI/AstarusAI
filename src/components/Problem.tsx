import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer } from "@/lib/motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const problems = [
  {
    title: "Expensive Fine-Tuning",
    description: "Traditional model adaptation requires costly compute resources and full retraining cycles that can cost thousands of dollars.",
    image: "/expensive_money_tech_cae74b9a.jpg",
    color: "primary",
  },
  {
    title: "Slow to Adapt",
    description: "Current methods can't update in real-time, making personalization impractical at scale for enterprise applications.",
    image: "/slow_clock_time_wait_12986dff.jpg",
    color: "secondary",
  },
  {
    title: "Catastrophic Forgetting",
    description: "Backpropagation-based approaches struggle with continuous learning without losing previously learned knowledge.",
    image: "/broken_memory_data_l_46a96241.jpg",
    color: "primary",
  },
  {
    title: "Complex RAG Systems",
    description: "External retrieval augmentation adds infrastructure complexity and latency without enabling true model learning.",
    image: "/complex_infrastructu_67a3236a.jpg",
    color: "secondary",
  },
];

const cardLayouts = [
  "number-hero",
  "number-hero",
  "number-hero",
  "number-hero",
];

function ProblemCard({
  problem,
  index,
  layout,
}: {
  problem: (typeof problems)[0];
  index: number;
  layout: string;
}) {
  if (layout === "split-left") {
    return (
      <Card className="group relative overflow-hidden border-0 h-full rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm flex flex-col sm:flex-row min-h-[280px]">
        <div className="relative w-full sm:w-[45%] min-h-[160px] sm:min-h-full overflow-hidden">
          <img src={problem.image} alt={problem.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-center">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">{problem.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">{problem.description}</p>
          <div className="mt-3 w-12 h-0.5 bg-primary rounded-full opacity-80" />
        </div>
      </Card>
    );
  }

  if (layout === "number-hero") {
    return (
      <Card className="group relative overflow-hidden border-0 h-full rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm">
        <div className="p-5 sm:p-6 md:p-7 lg:p-8">
          <span className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-primary/20 leading-none block mb-3">0{index + 1}</span>
          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">{problem.title}</h3>
          <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-sans mb-4">{problem.description}</p>
        </div>
        <div className="relative h-28 lg:h-32 overflow-hidden rounded-b-2xl">
          <img src={problem.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-primary" />
      </Card>
    );
  }

  return (
    <Card className={`group relative overflow-hidden border-0 h-full rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm ${index === 2 ? "rounded-br-[3rem]" : ""}`}>
      <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
        <img src={problem.image} alt={problem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/55" />
        {index === 2 && <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/30 rounded-tl-full" />}
        <h3 className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 font-display text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">
          {problem.title}
        </h3>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
          {problem.description}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-primary" />
    </Card>
  );
}

export const Problem = () => {
  const [api, setApi] = useState<CarouselApi>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <motion.section
      className="relative py-16 sm:py-20 md:py-24 lg:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-10 bg-white overflow-hidden rounded-t-[4rem] -mt-16 z-10 bg-grid-subtle"
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={fadeIn()}
    >
      {/* More visible grid overlay */}
      <div className="absolute inset-0 bg-grid-visible pointer-events-none z-0" aria-hidden />

      {/* Soft shape */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="container relative z-10 max-w-5xl lg:max-w-6xl xl:max-w-[72rem] mx-auto">
        <motion.div
          className="max-w-3xl lg:max-w-4xl xl:max-w-[42rem] mx-auto text-center mb-10 sm:mb-14 lg:mb-16 xl:mb-20 space-y-3 sm:space-y-4 lg:space-y-5"
          variants={staggerContainer(0.08, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase mx-auto font-accent" variants={fadeInUp(0)}>
            <span className="text-primary">The Challenge</span>
          </motion.div>
          <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-foreground px-2" variants={fadeInUp(0)}>
            Why Current AI{" "}
            <span className="text-primary">Falls Short</span>
          </motion.h2>
          <motion.p className="text-base sm:text-lg text-muted-foreground max-w-2xl lg:max-w-[38rem] mx-auto px-4 font-sans" variants={fadeInUp(0)}>
            Modern LLMs lack the ability to learn continuously and adapt in real-time — a fundamental limitation that hinders personalization and enterprise adoption.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-2xl md:max-w-3xl lg:max-w-[40rem] xl:max-w-[44rem] mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true, skipSnaps: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {problems.map((problem, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4 basis-full">
                  <motion.div
                    className="h-full"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProblemCard
                      problem={problem}
                      index={index}
                      layout={cardLayouts[index]}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot / row navigation */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full shrink-0 border-2 border-border"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            </motion.div>
            <motion.div className="flex items-center gap-1.5 mx-2" role="tablist" aria-label="Card navigation" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer(0.05)}>
              {problems.map((_, index) => (
                <motion.button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={selectedIndex === index}
                  aria-label={`Go to card ${index + 1}`}
                  onClick={() => scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-200 touch-manipulation ${
                    selectedIndex === index
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  variants={fadeInUp(0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full shrink-0 border-2 border-border"
              onClick={() => api?.scrollNext()}
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
