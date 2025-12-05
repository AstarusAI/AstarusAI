import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send, MessageCircle, HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import { useState } from "react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general inquiries and partnerships",
    contact: "rafayel.latif@gmail.com",
    href: "mailto:rafayel.latif@gmail.com",
    color: "primary",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Monday to Friday, 9am - 5pm GMT",
    contact: "+44 7957 456969",
    href: "tel:+447957456969",
    color: "secondary",
  },
];

const faqs = [
  {
    question: "How can I invest in Astarus?",
    answer: "We're currently in discussions with strategic investors. Please reach out via the contact form selecting 'Investment Opportunities' and we'll be in touch to share our investor deck and schedule a call.",
  },
  {
    question: "Is the technology available for licensing?",
    answer: "We're open to strategic partnerships and technology licensing discussions with select organizations. Contact us to explore collaboration opportunities.",
  },
  {
    question: "Are you hiring?",
    answer: "Yes! We're always looking for talented AI researchers and engineers. Select 'Career Opportunities' in the form or visit our Team page for more information.",
  },
];

const interestOptions = [
  "Investment Opportunities",
  "Technology Partnership",
  "General Inquiry",
  "Career Opportunities",
  "Media & Press",
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("Investment Opportunities");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email subject
    const subject = encodeURIComponent(`Contact Form: ${interest} - ${firstName} ${lastName}`);
    
    // Create email body with all form data
    const body = encodeURIComponent(
      `Hello,\n\n` +
      `I would like to get in touch regarding: ${interest}\n\n` +
      `--- Contact Information ---\n` +
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n` +
      `${company ? `Company: ${company}\n` : ''}` +
      `\n--- Message ---\n` +
      `${message}\n\n` +
      `Best regards,\n` +
      `${firstName} ${lastName}`
    );
    
    // Create mailto link
    const mailtoLink = `mailto:rafayel.latif@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
  };

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
        <div className="absolute inset-0">
          <img 
            src="/customer_support_con_ca1f1e80.jpg" 
            alt="Contact Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/50" />
        </div>
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container relative z-10 max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp(0.1)} className="space-y-6">
            <div className="section-badge mx-auto">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-primary">Get in Touch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              <span className="text-foreground">Let's Start a </span>
              <span className="text-gradient">Conversation</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're an investor, potential partner, or just curious about 
              our technology, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            <motion.div
              className="space-y-6"
              variants={staggerContainer(0.1, 0.1)}
            >
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                const isPrimary = method.color === "primary";
                return (
                  <motion.div key={index} variants={fadeInUp(index * 0.1)}>
                    <Card className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${
                      isPrimary 
                        ? "bg-gradient-to-br from-primary/5 to-primary/10" 
                        : "bg-gradient-to-br from-secondary/5 to-secondary/10"
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform ${
                        isPrimary ? "bg-gradient-primary" : "bg-gradient-secondary"
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{method.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{method.description}</p>
                      <a
                        href={method.href}
                        className={`font-semibold hover:underline ${
                          isPrimary ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {method.contact}
                      </a>
                    </Card>
                  </motion.div>
                );
              })}

              <motion.div variants={fadeInUp(0.3)}>
                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-muted/50 to-muted">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground">Quick Response</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    We typically respond within 24-48 hours during business days. 
                    For urgent matters, please call us directly.
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:col-span-2"
              variants={fadeInUp(0.2)}
            >
              <Card className="p-8 border-0 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
                    <p className="text-muted-foreground text-sm">We'll get back to you shortly</p>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <Input 
                        placeholder="John" 
                        className="h-12 border-2 focus:border-primary/50"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <Input 
                        placeholder="Doe" 
                        className="h-12 border-2 focus:border-primary/50"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12 border-2 focus:border-primary/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Company (Optional)</label>
                    <Input 
                      placeholder="Your company name" 
                      className="h-12 border-2 focus:border-primary/50"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">I'm interested in...</label>
                    <select 
                      className="w-full h-12 px-4 border-2 border-input rounded-lg bg-background focus:outline-none focus:border-primary/50 transition-colors"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      required
                    >
                      {interestOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <Textarea
                      placeholder="Tell us about your interest in Astarus..."
                      rows={5}
                      className="border-2 focus:border-primary/50 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full cta-button h-14 text-base"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn()}
      >
        <div className="container max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp(0.1)}>
            <div className="section-badge mx-auto mb-6">
              <HelpCircle className="w-4 h-4 text-secondary" />
              <span className="text-secondary">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked <span className="text-gradient-secondary">Questions</span>
            </h2>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={staggerContainer(0.1, 0.1)}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp(index * 0.1)}>
                <Card 
                  className={`overflow-hidden border-0 shadow-lg transition-all duration-300 ${
                    openFaq === index ? "shadow-xl" : ""
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <h3 className="font-bold text-foreground">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
