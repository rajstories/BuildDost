import { useState } from "react";
import { useLocation } from "wouter";

export function useNavigationLoading() {
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string>("");

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