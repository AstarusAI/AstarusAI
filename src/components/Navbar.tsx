import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="rounded-b-3xl bg-background/85 backdrop-blur-lg border border-border/70 border-t-0 shadow-sm px-6">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold gradient-text-colorful">
            Astarus
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/technology" className="text-foreground hover:text-primary transition-colors">
              Technology
            </Link>
            <Link to="/team" className="text-foreground hover:text-primary transition-colors">
              Team
            </Link>
            <Link to="/investors" className="text-foreground hover:text-primary transition-colors">
              Investors
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact">
              <Button className="gradient-bg">Get in Touch</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
            <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/technology"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Technology
            </Link>
            <Link
              to="/team"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/investors"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Investors
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              <Button className="w-full gradient-bg">Get in Touch</Button>
            </Link>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};
