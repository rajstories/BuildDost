import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Circle, Loader2 } from "lucide-react";

const GENERATION_STEPS = [
  { id: "understanding", text: "Understanding your idea…", duration: 2000 },
  { id: "frontend", text: "Designing frontend layout…", duration: 3000 },
  { id: "backend", text: "Building backend logic & database schema…", duration: 4000 },
  { id: "deploying", text: "Deploying preview app…", duration: 2500 },
];

interface GeneratePageProps {
  prompt?: string;
}

export default function GeneratePage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedProjectId, setGeneratedProjectId] = useState<string | null>(null);

  // Get prompt from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const prompt = urlParams.get('prompt') || "A simple web application";

  useEffect(() => {
    let stepTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Interval;

    const startGeneration = async () => {
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        setCurrentStep(i);
        setProgress((i / GENERATION_STEPS.length) * 100);

        // Simulate step progress
        const stepDuration = GENERATION_STEPS[i].duration;
        const progressStep = 100 / GENERATION_STEPS.length;
        
        progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(prev + 1, ((i + 1) / GENERATION_STEPS.length) * 100);
            return newProgress;
          });
        }, stepDuration / progressStep);

        // Wait for step to complete
        await new Promise(resolve => {
          stepTimeout = setTimeout(resolve, stepDuration);
        });

        clearInterval(progressInterval);
      }

      // Complete generation
      setProgress(100);
      setIsComplete(true);
      
      // Simulate project creation
      const projectId = `project_${Date.now()}`;
      setGeneratedProjectId(projectId);

      // Call backend to actually generate the project
      try {
        const response = await fetch('/api/projects/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.project) {
            setGeneratedProjectId(data.project.id.toString());
          }
        }
      } catch (error) {
        console.error('Generation failed:', error);
      }
    };

    startGeneration();

    return () => {
      if (stepTimeout) clearTimeout(stepTimeout);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [prompt]);

  const handleViewProject = () => {
    if (generatedProjectId) {
      setLocation(`/preview?project=${generatedProjectId}`);
    }
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        {/* Main Generation Area */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6" data-testid="generation-title">
            Creating Your App
          </h1>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-border/30">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-muted-foreground">Your Idea:</h2>
              <p className="text-xl font-medium text-foreground bg-muted/30 rounded-lg px-4 py-3" data-testid="user-prompt">
                "{prompt}"
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-3 mb-2" data-testid="generation-progress" />
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>

            {/* Status Steps */}
            <div className="space-y-4">
              {GENERATION_STEPS.map((step, index) => {
                const isActive = index === currentStep && !isComplete;
                const isCompleted = index < currentStep || isComplete;
                const isUpcoming = index > currentStep && !isComplete;

                return (
                  <div 
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-primary/10 border border-primary/20' : 
                      isCompleted ? 'bg-green-500/10 border border-green-500/20' : 
                      'bg-muted/20'
                    }`}
                    data-testid={`step-${step.id}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    
                    <span className={`font-medium ${
                      isActive ? 'text-primary' : 
                      isCompleted ? 'text-green-500' : 
                      'text-muted-foreground'
                    }`}>
                      {step.text}
                      {isActive && (
                        <span className="inline-block ml-1 animate-pulse">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span>
                          <span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Completion State */}
            {isComplete && (
              <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-500 mb-2">
                  Your app is ready! 🎉
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your full-stack application has been generated and deployed. You can now view and edit your project.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleViewProject}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl"
                    data-testid="button-view-project"
                  >
                    View & Edit Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleBackToHome}
                    className="border-border/50 hover:bg-muted/50 px-6 py-3 rounded-xl"
                    data-testid="button-create-another"
                  >
                    Create Another App
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}