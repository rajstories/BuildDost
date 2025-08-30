import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useNavigationLoading() {
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string>("");

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsNavigating(true);
      setTargetPath("back");
      
      // Add a delay to show loading state for back/forward navigation
      setTimeout(() => {
        setIsNavigating(false);
        setTargetPath("");
      }, 800);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateWithLoading = async (path: string, delay = 300) => {
    setIsNavigating(true);
    setTargetPath(path);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, delay));
    
    setLocation(path);
    
    // Reset loading state after navigation
    setTimeout(() => {
      setIsNavigating(false);
      setTargetPath("");
    }, 100);
  };

  return {
    isNavigating,
    targetPath,
    navigateWithLoading
  };
}