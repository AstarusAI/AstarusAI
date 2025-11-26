import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Rocket, Target, ArrowRight, CheckCircle2, Sparkles, Building2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { Link } from "react-router-dom";

const valueProps = [
  {
    icon: TrendingUp,
    title: "Huge Market",
    description: "$1.3T AI market by 2032, with personalization as a key driver",
    color: "primary",
  },
  {
    icon: Rocket,
    title: "First Mover",
    description: "Novel architecture with proven results and defensible IP",
    color: "secondary",
  },
  {
    icon: Target,
    title: "Clear Path",
    description: "B2B and B2C opportunities across multiple verticals",
    color: "primary",
  },
  {
    icon: Users,
    title: "Strong Team",
    description: "Experienced AI researchers with deep technical expertise",
    color: "secondary",
  },
];

const roadmapItems = [
  {
    phase: "Current",
    title: "Working Prototype",
    description: "Proven benchmarks across model sizes (1.6M - 78M parameters)",
    icon: CheckCircle2,
    color: "success",
  },
  {
    phase: "6 Months",
    title: "Enterprise Pilots",
    description: "API development and partnership discussions with major providers",
    icon: Building2,
    color: "primary",
  },
  {
    phase: "12 Months",
    title: "Commercial Launch",
    description: "Initial revenue, IP filings, and Series A preparation",
    icon: Rocket,
    color: "secondary",
  },
];

const marketSegments = [
  {
    title: "Enterprise (B2B)",
    items: ["Legal firms", "Financial services", "Healthcare", "Consulting"],
    color: "primary",
  },
  {
    title: "Consumer (B2C)",
    items: ["Personal AI assistants", "Content creators", "Developers", "Students"],
    color: "secondary",
  },
];

export default function Investors() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section
        className="relative pt-28 pb-16 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp(0.1)} className="space-y-6">
            <div className="section-badge mx-auto">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-secondary">Investment Opportunity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="text-foreground">Join the </span>
              <span className="text-gradient-secondary">AI Revolution</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Partner with us to build the next generation of continuously learning 
              AI systems that adapt in real-time.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer(0.1, 0.1)}
          >
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              const isPrimary = prop.color === "primary";
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp(index * 0.1)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group ${
                    isPrimary 
                      ? "bg-gradient-to-br from-primary/5 to-primary/10" 
                      : "bg-gradient-to-br from-secondary/5 to-secondary/10"
                  }`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform ${
                      isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isPrimary ? "group-hover:text-primary" : "group-hover:text-secondary"} transition-colors`}>
                      {prop.title}
                    </h3>
                    <p className="text-muted-foreground">{prop.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-gradient-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp(0.1)}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Why Invest in <span className="text-gradient">Astarus</span>?
            </h2>
          </motion.div>

          <motion.div className="space-y-6" variants={staggerContainer(0.1, 0.1)}>
            <motion.div variants={fadeInUp(0.1)}>
              <Card className="p-8 bg-white/5 border-white/10">
                <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  The Problem We Solve
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Current AI models are static after training. They can't adapt to individual users 
                  or company-specific data without expensive retraining or complex external systems.
                </p>
                <p className="text-white/70 leading-relaxed">
                  This limits personalization, increases costs, and creates barriers to enterprise adoption.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp(0.2)}>
              <Card className="p-8 bg-white/5 border-white/10">
                <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Our Solution
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Memory-augmented transformers that learn continuously in real-time, 
                  adapting to users and enterprises in seconds instead of weeks.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { value: "75%", label: "Perplexity reduction" },
                    { value: "<20s", label: "Update time" },
                    { value: "<1%", label: "Cost vs fine-tuning" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-white/5">
                      <div className="text-2xl font-bold text-gradient-secondary">{stat.value}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp(0.3)}>
              <Card className="p-8 bg-white/5 border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  Market Opportunity
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {marketSegments.map((segment, i) => (
                    <div key={i} className={`p-5 rounded-xl ${
                      segment.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                    }`}>
                      <h4 className={`font-bold mb-3 ${
                        segment.color === "primary" ? "text-primary" : "text-secondary"
                      }`}>
                        {segment.title}
                      </h4>
                      <ul className="space-y-2">
                        {segment.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-white/70">
                            <CheckCircle2 className={`w-4 h-4 ${
                              segment.color === "primary" ? "text-primary" : "text-secondary"
                            }`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp(0.1)}>
            <div className="section-badge mx-auto mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-primary">Roadmap</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Traction & <span className="text-gradient">Timeline</span>
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={staggerContainer(0.1, 0.1)}
          >
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp(index * 0.1)}
                  className="relative"
                >
                  {index < roadmapItems.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent hidden md:block" />
                  )}
                  <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        item.color === "success" 
                          ? "bg-green-500" 
                          : item.color === "primary" 
                            ? "bg-gradient-primary" 
                            : "bg-gradient-secondary"
                      }`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-semibold uppercase tracking-wide ${
                          item.color === "success" 
                            ? "text-green-600" 
                            : item.color === "primary" 
                              ? "text-primary" 
                              : "text-secondary"
                        }`}>
                          {item.phase}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mt-1">{item.title}</h3>
                        <p className="text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-gradient-primary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn()}
      >
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp(0.1)}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Build the Future Together
            </h2>
            <p className="text-lg text-white/80 mb-8">
              We're seeking strategic investors who share our vision for 
              continuously learning AI systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 h-auto text-base shadow-lg group">
                  <span>Request Investor Deck</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 h-auto text-base">
                  Schedule a Call
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
