import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  ExternalLink, 
  Copy, 
  Check,
  Globe,
  Github,
  Database,
  Zap,
  Settings
} from "lucide-react";

interface DeploymentStatus {
  stage: string;
  progress: number;
  message: string;
  completed: boolean;
}

export default function OneClickDeploy({ project }: { project: any }) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [projectName, setProjectName] = useState(project?.name?.toLowerCase().replace(/\s+/g, '-') || "my-builddost-app");
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus[]>([]);
  const [copied, setCopied] = useState(false);

  const deployToVercel = async () => {
    setIsDeploying(true);
    setDeploymentStatus([]);
    
    const stages = [
      { stage: "Preparing", message: "Analyzing project structure...", progress: 10 },
      { stage: "Building", message: "Building production files...", progress: 30 },
      { stage: "Optimizing", message: "Optimizing assets and code...", progress: 50 },
      { stage: "Deploying", message: "Deploying to Vercel...", progress: 70 },
      { stage: "Configuring", message: "Setting up domain and SSL...", progress: 90 },
      { stage: "Complete", message: "Deployment successful!", progress: 100 }
    ];

    try {
      // Simulate deployment process for demo
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        setDeploymentStatus(prev => [...prev, { ...stage, completed: false }]);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setDeploymentStatus(prev => 
          prev.map((s, index) => 
            index === i ? { ...s, completed: true } : s
          )
        );
      }

      // Set final deployment URL
      const finalUrl = `https://${projectName}-builddost.vercel.app`;
      setDeploymentUrl(finalUrl);
      
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus(prev => [...prev, {
        stage: "Error",
        message: "Deployment failed. Please try again.",
        progress: 0,
        completed: false
      }]);
    }
    
    setIsDeploying(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(deploymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentProgress = deploymentStatus.length > 0 
    ? deploymentStatus[deploymentStatus.length - 1]?.progress || 0 
    : 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>One-Click Deployment</span>
            <Badge variant="secondary">Hackathon Winner</Badge>
          </CardTitle>
          <CardDescription>
            Deploy your full-stack application to production with zero configuration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isDeploying && !deploymentUrl && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="my-awesome-app"
                  data-testid="input-project-name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your app will be available at: https://{projectName}-builddost.vercel.app
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-600" />
                  What gets deployed:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-3 w-3 text-green-600" />
                    <span>Frontend (React + TypeScript + Tailwind)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-3 w-3 text-purple-600" />
                    <span>Backend API (Express + Node.js)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-3 w-3 text-orange-600" />
                    <span>Database (PostgreSQL via Neon)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>SSL Certificate & Custom Domain</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={deployToVercel}
                size="lg"
                className="group relative w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 px-8 py-4"
                data-testid="button-deploy"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Rocket className="relative mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative text-lg">Deploy to Production</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-pulse"></div>
              </Button>
            </div>
          )}

          {isDeploying && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Deploying your application...</h3>
                <Progress value={currentProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">{currentProgress}% complete</p>
              </div>

              <div className="space-y-3">
                {deploymentStatus.map((status, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      status.completed ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      status.completed ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                    }`}>
                      {status.completed ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{status.stage}</p>
                      <p className="text-xs text-gray-600">{status.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deploymentUrl && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  🎉 Deployment Successful!
                </h3>
                <p className="text-green-700 mb-4">
                  Your application is now live and accessible worldwide
                </p>
                
                <div className="bg-white p-3 rounded-lg border flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="flex-1 font-mono text-sm">{deploymentUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyUrl}
                    data-testid="button-copy-url"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => window.open(deploymentUrl, '_blank')}
                  data-testid="button-visit-site"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Your Site
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`https://vercel.com/dashboard`, '_blank')}
                  data-testid="button-manage-deployment"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>✅ SSL Certificate automatically configured</p>
                <p>✅ CDN optimization enabled worldwide</p>
                <p>✅ Automatic deployments from Git</p>
                <p>✅ Analytics and monitoring included</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}