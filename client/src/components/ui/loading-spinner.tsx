import { cn } from "@/lib/utils";
import logoUrl from "@assets/image_1756581060902.png";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* BuildDost Logo Animation - Replit Style */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Rotating ring around logo */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-400 animate-spin"></div>
        <div className="absolute inset-0.5 rounded-full border border-transparent border-t-blue-300 animate-spin" style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
        
        {/* Logo Image */}
        <div className="absolute inset-2 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <img 
            src={logoUrl} 
            alt="BuildDost" 
            className={cn("rounded-lg object-cover", 
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-10 h-10"
            )}
          />
        </div>
      </div>
      
      {text && (
        <p className={cn("text-muted-foreground animate-pulse", 
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base")}>
          {text}
        </p>
      )}
    </div>
  );
}

export function FullPageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}