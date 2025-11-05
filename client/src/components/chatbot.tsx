import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest<{ response: string }>(
        "POST",
        "/api/chat",
        { 
          message,
          history: messages.slice(-10)
        }
      );
      return response.response;
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    chatMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = user?.user_metadata?.userType === "owner" 
    ? [
        "How do I book an appointment?",
        "What vaccinations does my pet need?",
        "How can I add a new pet?",
        "What should I do in an emergency?"
      ]
    : [
        "How do I manage appointments?",
        "How can I view patient records?",
        "What's the best way to organize my schedule?",
        "How do I add medical notes?"
      ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          data-testid="chatbot-trigger"
        >
          <MessageCircle className="h-6 w-6" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Vetcepi Assistant
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Ask me anything about {user?.user_metadata?.userType === "owner" ? "pet care and appointments" : "managing your clinic"}
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Welcome! I'm here to help you with Vetcepi. Try one of these:
              </p>
              <div className="grid gap-2">
                {quickPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left"
                    onClick={() => {
                      setInput(prompt);
                      setMessages([{ role: "user", content: prompt }]);
                      chatMutation.mutate(prompt);
                    }}
                    data-testid={`quick-prompt-${i}`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${i}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={chatMutation.isPending}
              data-testid="chat-input"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || chatMutation.isPending}
              data-testid="chat-send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
