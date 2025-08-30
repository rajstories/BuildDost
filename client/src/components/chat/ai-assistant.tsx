import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Code,
  Database,
  Palette,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  currentProject?: any;
  onCodeSuggestion?: (code: string) => void;
  onComponentAdd?: (component: any) => void;
}

export default function AIAssistant({ currentProject, onCodeSuggestion, onComponentAdd }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "👋 Hi! I'm your AI assistant. I can help you build your app, suggest improvements, generate components, and answer any questions!",
      timestamp: new Date(),
      suggestions: [
        "Add a contact form",
        "Create a user dashboard", 
        "Generate a pricing section",
        "Build an authentication system"
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Send to AI assistant API
      const response = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          context: {
            currentProject,
            previousMessages: messages.slice(-5) // Last 5 messages for context
          }
        })
      });

      const result = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: result.response || "I'm having trouble processing that request. Could you try rephrasing?",
        timestamp: new Date(),
        suggestions: result.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle special actions
      if (result.code) {
        onCodeSuggestion?.(result.code);
      }
      if (result.component) {
        onComponentAdd?.(result.component);
      }

    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    inputRef.current?.focus();
  };

  const quickActions = [
    { icon: Code, label: "Generate Component", prompt: "Generate a new React component for my app" },
    { icon: Database, label: "Add Database", prompt: "Add a database schema to my project" },
    { icon: Palette, label: "Improve Design", prompt: "Suggest design improvements for my app" },
    { icon: Zap, label: "Add Features", prompt: "What features should I add to make my app better?" }
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
            data-testid="button-open-chat"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
              data-testid="button-close-chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div className={`rounded-2xl px-3 py-2 text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs px-2 py-1 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-muted rounded-2xl px-3 py-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-3 border-t border-border">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(action.prompt)}
                    className="flex items-center space-x-2 text-xs p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    data-testid={`quick-action-${action.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 text-sm"
                data-testid="input-chat-message"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                size="sm"
                className="px-3"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}