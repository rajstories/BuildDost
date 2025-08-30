import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, Wand2, Trophy, FileCode, Eye, Monitor, Code, Github, Figma } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface BuildResponse {
  response: string;
  suggestions: string[];
  quickActions: Array<{ label: string; action: string; icon?: string }>;
  project?: {
    id: string;
    name: string;
    files: Record<string, string>;
    previewUrl?: string;
  };
  buildStatus?: 'starting' | 'generating' | 'completed' | 'error';
}

export default function Build() {
  const [input, setInput] = useState("");
  const [generatedProject, setGeneratedProject] = useState<BuildResponse['project'] | null>(null);
  const { toast } = useToast();

  const buildMutation = useMutation({
    mutationFn: async (description: string): Promise<BuildResponse> => {
      const response = await apiRequest("POST", "/api/chat/build", { message: description });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.project) {
        setGeneratedProject(data.project);
        toast({
          title: "🎉 Project Built Successfully!",
          description: `Created ${data.project.name} - View the live preview below`,
        });
      } else {
        toast({
          title: "AI Response",
          description: data.response,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Build Failed",
        description: "Failed to build project. Please try again.",
        variant: "destructive",
      });
      console.error("Build error:", error);
    }
  });

  const handleBuild = () => {
    if (!input.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe what you want to build",
        variant: "destructive",
      });
      return;
    }
    buildMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBuild();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            What should we build today?
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create stunning apps & websites by chatting with AI.
          </p>
        </div>

        {/* Main Build Interface */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your app idea (e.g., Food delivery website with login and cart)"
                className="flex-1 text-lg py-6 px-6 bg-white border-0 rounded-xl text-slate-900 placeholder:text-slate-500"
                disabled={buildMutation.isPending}
                data-testid="input-build-description"
              />
              <Button
                onClick={handleBuild}
                disabled={buildMutation.isPending || !input.trim()}
                className="px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl"
                data-testid="button-build"
              >
                {buildMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Building...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Build
                  </div>
                )}
              </Button>
            </div>

            {buildMutation.isPending && (
              <div className="mt-4 flex items-center justify-center text-white/70">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>AI is building your project...</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/templates">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-templates">
                <Wand2 className="w-4 h-4 mr-2" />
                Choose Templates
              </Button>
            </Link>
            
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" data-testid="button-hackathon">
              <Trophy className="w-4 h-4 mr-2" />
              🏆 Hackathon Demo
            </Button>
          </div>

          {/* Import Options */}
          <div className="text-center mt-8">
            <span className="text-slate-400 text-sm">or import from</span>
            <div className="flex justify-center gap-4 mt-3">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10" data-testid="button-figma">
                <Figma className="w-4 h-4 mr-2" />
                Figma
              </Button>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10" data-testid="button-github">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Project Display */}
        {generatedProject && (
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-2xl">
                  <Monitor className="w-6 h-6 text-blue-400" />
                  Generated Project: {generatedProject.name}
                  <div className="ml-auto flex gap-2">
                    <Link href={`/builder/${generatedProject.id}`}>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Code className="w-4 h-4 mr-2" />
                        Edit in Builder
                      </Button>
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10">
                    <TabsTrigger value="preview" className="text-white data-[state=active]:bg-white/20">
                      <Eye className="w-4 h-4 mr-2" />
                      Live Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-white data-[state=active]:bg-white/20">
                      <FileCode className="w-4 h-4 mr-2" />
                      Generated Code
                    </TabsTrigger>
                    <TabsTrigger value="files" className="text-white data-[state=active]:bg-white/20">
                      <Code className="w-4 h-4 mr-2" />
                      Project Files
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preview" className="mt-6">
                    <div className="border border-white/20 rounded-lg bg-white overflow-hidden">
                      {generatedProject.previewUrl ? (
                        <iframe
                          src={generatedProject.previewUrl}
                          className="w-full h-[600px] rounded-lg"
                          title={`Preview of ${generatedProject.name}`}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[600px] text-slate-400">
                          <div className="text-center space-y-3">
                            <Monitor className="w-16 h-16 mx-auto opacity-50" />
                            <p className="text-lg">Live preview loading...</p>
                            <p className="text-sm">Your project is being prepared</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="code" className="mt-6">
                    <ScrollArea className="h-[600px] w-full rounded-md border border-white/20 bg-slate-900/50 p-6">
                      <pre className="text-sm text-slate-300">
                        <code>
                          {Object.entries(generatedProject.files).map(([filename, content]) => (
                            <div key={filename} className="mb-8">
                              <div className="font-bold text-blue-400 mb-3 text-lg border-b border-slate-700 pb-2">
                                📄 {filename}
                              </div>
                              <div className="pl-4 text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                                {content}
                              </div>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="files" className="mt-6">
                    <div className="space-y-3">
                      {Object.keys(generatedProject.files).map((filename) => (
                        <div key={filename} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
                          <FileCode className="w-5 h-5 text-blue-400" />
                          <span className="font-mono text-white flex-1">{filename}</span>
                          <div className="text-xs text-slate-400">
                            {Math.round(generatedProject!.files[filename].length / 1024 * 10) / 10} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}