import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/technology", label: "Technology" },
  { to: "/team", label: "Team" },
  { to: "/investors", label: "Investors" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 ${
            scrolled
              ? "glass-dark glass-border shadow-2xl"
              : "bg-black/30 backdrop-blur-sm border border-white/10"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/Astarus Logo.jpeg"
              alt="Astarus Logo"
              className="h-7 sm:h-8 w-auto rounded-lg"
            />
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Astarus
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-xl ${
                  location.pathname === link.to
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/chat">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 font-medium"
              >
                Try Demo
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/30 px-6">
                Get in Touch
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-2 overflow-hidden"
            >
              <div className="glass-dark glass-border rounded-2xl p-4 space-y-1 shadow-2xl">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl font-medium transition-colors ${
                        location.pathname === link.to
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                  <Link to="/chat" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 font-medium"
                    >
                      Try Demo
                    </Button>
                  </Link>
                  <Link to="/contact" className="block">
                    <Button className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-lg py-6">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
