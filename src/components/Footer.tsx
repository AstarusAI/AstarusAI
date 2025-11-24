import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 sm:py-12 md:py-16 px-4 border-t-2 border-gray-200 bg-white">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            {/* Company info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Astarus</h3>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Building the next generation of continuously learning AI systems.
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/team" className="text-gray-700 hover:text-primary transition-colors font-medium">About</Link></li>
                <li><Link to="/technology" className="text-gray-700 hover:text-primary transition-colors font-medium">Technology</Link></li>
                <li><Link to="/investors" className="text-gray-700 hover:text-primary transition-colors font-medium">Investors</Link></li>
                <li><Link to="/contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:Rafayel.latif@gmail.com" className="text-gray-700 hover:text-primary transition-colors font-medium">Rafayel.latif@gmail.com</a></li>
                <li><a href="tel:+44123456789" className="text-gray-700 hover:text-primary transition-colors font-medium">+44 123 456 789</a></li>
                <li><Link to="/contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact Form</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 font-medium">&copy; {currentYear} Astarus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
