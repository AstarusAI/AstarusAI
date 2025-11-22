import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="rounded-b-3xl bg-black backdrop-blur-xl border border-primary/20 border-t-0 shadow-2xl px-6">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-primary transition-colors">
            Astarus
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/90 hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/technology" className="text-white/90 hover:text-primary transition-colors font-medium">
              Technology
            </Link>
            <Link to="/team" className="text-white/90 hover:text-primary transition-colors font-medium">
              Team
            </Link>
            <Link to="/investors" className="text-white/90 hover:text-primary transition-colors font-medium">
              Investors
            </Link>
            <Link to="/contact" className="text-white/90 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <Link to="/chat" className="text-foreground hover:text-primary transition-colors">
              Try it
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact">
              <Button className="bg-primary text-white hover:bg-primary/90 font-semibold shadow-lg hover:shadow-primary/50 transition-all">Get in Touch</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
            <div className="md:hidden py-4 space-y-4 animate-fade-in bg-black backdrop-blur-xl rounded-b-3xl border-t border-primary/20">
            <Link
              to="/"
              className="block py-2 px-6 text-white/90 hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/technology"
              className="block py-2 px-6 text-white/90 hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Technology
            </Link>
            <Link
              to="/team"
              className="block py-2 px-6 text-white/90 hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/investors"
              className="block py-2 px-6 text-white/90 hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Investors
            </Link>
            <Link
              to="/contact"
              className="block py-2 px-6 text-white/90 hover:text-primary transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="px-6">
              <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-lg">Get in Touch</Button>
            </Link>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};
