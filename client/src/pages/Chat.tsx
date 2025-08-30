import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, Send, User, Bot, Code, Palette, Database } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  quickActions?: Array<{ label: string; action: string; icon?: string }>;
}

interface ChatResponse {
  response: string;
  suggestions: string[];
  quickActions: Array<{ label: string; action: string; icon?: string }>;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        quickActions: data.quickActions
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'create_landing': "Create a modern landing page for my business",
      'build_ecommerce': "Build an e-commerce website with shopping cart",
      'make_portfolio': "Create a portfolio website to showcase my work",
      'design_dashboard': "Design a dashboard for data visualization",
      'generate_component': "Generate a custom React component",
      'create_api': "Create a REST API with database integration"
    };

    const message = actionMessages[action as keyof typeof actionMessages] || action;
    setInput(message);
  };

  const getActionIcon = (iconName?: string) => {
    const icons: Record<string, any> = {
      'code': Code,
      'palette': Palette,
      'database': Database,
      'sparkles': Sparkles
    };
    const IconComponent = icons[iconName || 'sparkles'];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        {messages.length === 0 ? (
          // Initial State - Matches the design
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-foreground leading-tight">
                What should we build today?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Create stunning apps & websites by chatting with AI.
              </p>
            </div>

            <div className="w-full max-w-3xl space-y-6">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your app idea (e.g., Food delivery website with login and cart)"
                  className="text-lg h-14 px-6 bg-background/80 backdrop-blur-sm border-2 border-border focus:border-primary rounded-2xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  data-testid="input-chat-message"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending}
                  className="h-14 px-8 rounded-2xl text-lg font-semibold glow-effect"
                  data-testid="button-send-chat"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Build
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/5 border-2 hover:border-primary/20 transition-all"
                  onClick={() => handleQuickAction('create_landing')}
                  data-testid="button-quick-landing"
                >
                  <Palette className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">Landing Page</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/5 border-2 hover:border-primary/20 transition-all"
                  onClick={() => handleQuickAction('build_ecommerce')}
                  data-testid="button-quick-ecommerce"
                >
                  <Database className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">E-commerce</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/5 border-2 hover:border-primary/20 transition-all"
                  onClick={() => handleQuickAction('make_portfolio')}
                  data-testid="button-quick-portfolio"
                >
                  <Code className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">Portfolio</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Chat Interface
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">AI Builder Chat</h1>
              <p className="text-muted-foreground">Continue building with AI assistance</p>
            </div>

            <Card className="bg-background/50 backdrop-blur-sm border-2">
              <CardContent className="p-6">
                <ScrollArea className="h-[500px] w-full pr-4">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${message.role}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] space-y-3 ${message.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground ml-auto'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>

                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">Suggestions:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setInput(suggestion)}
                                    data-testid={`suggestion-${index}`}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.quickActions && message.quickActions.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">Quick Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.quickActions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant="default"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() => handleQuickAction(action.action)}
                                    data-testid={`action-${index}`}
                                  >
                                    {getActionIcon(action.icon)}
                                    <span className="ml-1">{action.label}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {chatMutation.isPending && (
                      <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted p-4 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-3 mt-6">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Continue the conversation..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    data-testid="input-chat-continue"
                  />
                  <Button 
                    onClick={handleSend}
                    disabled={!input.trim() || chatMutation.isPending}
                    data-testid="button-send-continue"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}