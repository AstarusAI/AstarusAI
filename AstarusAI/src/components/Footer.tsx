import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About Us", to: "/team" },
    { label: "Technology", to: "/technology" },
    { label: "Investors", to: "/investors" },
    { label: "Contact", to: "/contact" },
  ],
  resources: [
    { label: "Try Demo", to: "/chat" },
    { label: "Documentation", to: "/technology" },
    { label: "Research", to: "/technology" },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-dark py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="inline-flex items-center gap-2">
                <img
                  src="/Astarus Logo.jpeg"
                  alt="Astarus Logo"
                  className="h-8 w-auto rounded-lg"
                />
                <span className="text-2xl font-bold text-white">Astarus</span>
              </Link>
              
              <p className="text-white/60 leading-relaxed max-w-sm">
                Building the next generation of continuously learning AI systems 
                with memory-augmented transformer technology.
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/rafayel-latif-490aa724a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:rafayel.latif@gmail.com"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:rafayel.latif@gmail.com"
                    className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    rafayel.latif@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+447957456969"
                    className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    +44 7957 456969
                  </a>
                </li>
              </ul>

              <div className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
                >
                  Get in Touch
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              &copy; {currentYear} Astarus AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
