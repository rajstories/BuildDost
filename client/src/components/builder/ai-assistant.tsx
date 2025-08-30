import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "pending" | "success" | "error";
}

interface AiAssistantProps {
  onComponentGenerated: (component: any) => void;
}

export default function AiAssistant({ onComponentGenerated }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content: "Hi! I'm your AI assistant. I can help you generate components, create layouts, or build entire sections. What would you like to create?",
      timestamp: new Date(),
      status: "success",
    },
  ]);
  const [input, setInput] = useState("");

  const generateComponentMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/ai/generate-component", {
        description: prompt,
        save: false,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === prev.length ? { ...msg, status: "success" } : msg
      ));
      
      // Add success message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "assistant",
        content: `✅ Generated ${data.name} component! I've added it to your canvas.`,
        timestamp: new Date(),
        status: "success",
      }]);

      onComponentGenerated(data);
    },
    onError: (error) => {
      setMessages(prev => prev.map(msg => 
        msg.id === prev.length ? { ...msg, status: "error" } : msg
      ));
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "assistant",
        content: `❌ Sorry, I couldn't generate that component. ${error.message}`,
        timestamp: new Date(),
        status: "error",
      }]);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add pending assistant message
    const assistantMessage: Message = {
      id: Date.now() + 1,
      type: "assistant",
      content: `Generating component based on: "${input}"...`,
      timestamp: new Date(),
      status: "pending",
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Generate component
    generateComponentMutation.mutate(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full glow-effect shadow-lg z-50"
          onClick={() => setIsOpen(true)}
          data-testid="button-open-ai-assistant"
        >
          <Bot className="h-5 w-5" />
        </Button>
      )}

      {/* AI Assistant Panel */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-96 glass-effect shadow-xl z-50 flex flex-col" data-testid="ai-assistant-panel">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Bot className="text-primary-foreground" size={12} />
              </div>
              <span className="text-sm font-medium text-foreground" data-testid="ai-assistant-title">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-testid="ai-status-online"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-ai-assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" data-testid="ai-messages">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.id}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 text-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "assistant" && (
                        <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      )}
                      {message.type === "user" && (
                        <User className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p data-testid={`message-content-${message.id}`}>{message.content}</p>
                        {message.status === "pending" && (
                          <Loader2 className="h-3 w-3 animate-spin mt-1" />
                        )}
                        {message.status === "success" && (
                          <Check className="h-3 w-3 text-green-500 mt-1" />
                        )}
                        {message.status === "error" && (
                          <X className="h-3 w-3 text-red-500 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                placeholder="Describe what you want to build..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={generateComponentMutation.isPending}
                data-testid="input-ai-prompt"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || generateComponentMutation.isPending}
                className="glow-effect"
                data-testid="button-send-prompt"
              >
                {generateComponentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
