import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, Rocket, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

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
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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
        scrolled ? "py-0.5" : "py-1"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-1 transition-all duration-300 max-h-16 overflow-visible ${
            scrolled
              ? "glass-dark glass-border shadow-2xl"
              : "bg-black/70 backdrop-blur-sm border border-white/10"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/Actual Logo.png"
              alt="Astarus Logo"
              className="h-20 sm:h-24 w-auto rounded-lg -my-2"
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
            {isAuthenticated ? (
              <>
                <Link to="/spaces">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 font-medium"
                  >
                    My Spaces
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-white/80 hover:text-white hover:bg-white/10 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/demo">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 font-medium"
                  >
                    Try Demo
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/30 px-6">
                    <Rocket className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              <div className="glass-dark glass-border rounded-2xl p-3 sm:p-4 space-y-1 shadow-2xl">
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
                  {isAuthenticated ? (
                    <>
                      <Link to="/spaces" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 font-medium"
                        >
                          My Spaces
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full border-white/20 text-white hover:bg-white/10 font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/demo" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 font-medium"
                        >
                          Try Demo
                        </Button>
                      </Link>
                      <Link to="/signup" className="block">
                        <Button className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-lg py-6">
                          <Rocket className="w-4 h-4 mr-2" />
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
