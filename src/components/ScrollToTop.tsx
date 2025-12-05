import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    
    // Also use scrollTo with 0,0 as fallback for older browsers
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      // Ensure document elements are also at top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

