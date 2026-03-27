import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic, Send, Bot, User, Stethoscope, Loader2,
  MessageSquare, Plus, ChevronLeft, ChevronRight,
  History, Clock, MoreVertical
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Message = {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type Session = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

const initialMessages: Message[] = [
  { role: "assistant", content: "Hello there! 👋 I'm your Care AI health assistant. I can help you understand your health profile and recent records. How can I help you today?" },
];

const suggestions = [
  "Is this safe with my medication?",
  "What does my last lab value mean?",
  "I have a recurring headache",
  "Tips for managing blood pressure",
];

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await api.get("/chat/sessions");
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const selectSession = async (sessionId: number) => {
    try {
      setCurrentSessionId(sessionId);
      setIsTyping(true);
      const response = await api.get(`/chat/sessions/${sessionId}`);
      setMessages(response.data.messages);
      setIsSidebarOpen(false); // Mobile optimization
    } catch (error) {
      toast.error("Failed to load chat history");
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages(initialMessages);
    setIsSidebarOpen(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat/", {
        messages: [userMessage], // AI backend now handles history from DB
        session_id: currentSessionId
      });

      const { response: aiResponse, session_id } = response.data;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: aiResponse
      }]);

      if (!currentSessionId) {
        setCurrentSessionId(session_id);
        fetchSessions(); // Refresh list to show new session
      }
    } catch (error: any) {
      toast.error("Chat failed", {
        description: error.response?.data?.detail || "Could not connect to AI assistant",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-4 overflow-hidden relative">
      {/* Sidebar - Sessions History */}
      <div className={cn(
        "absolute lg:static inset-y-0 left-0 z-20 w-72 bg-card border-r border-border transition-transform duration-300 transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden"
      )}>
        <div className="flex flex-col h-full p-4">
          <Button
            onClick={startNewChat}
            className="w-full mb-6 gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none"
            variant="outline"
          >
            <Plus className="h-4 w-4" /> New Consultation
          </Button>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
            <Clock className="h-3 w-3" /> Recent History
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {isLoadingSessions ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-10 w-full bg-muted animate-pulse rounded-md" />
              ))
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent consultations.
              </div>
            ) : (
              sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-start gap-3 group",
                    currentSessionId === session.id
                      ? "bg-primary/10 text-primary font-medium border border-primary/20"
                      : "hover:bg-muted text-foreground/80 hover:text-foreground border border-transparent"
                  )}
                >
                  <MessageSquare className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    currentSessionId === session.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="truncate flex-1">{session.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm lg:hidden">
          <h1 className="font-display text-lg font-bold">AI Assistant</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <History className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden lg:flex items-center gap-4 p-4 border-b border-border bg-card/50">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">AI Health Assistant</h1>
            <p className="text-muted-foreground text-xs font-medium">Context-aware health guidance powered by Care AI</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4 group",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>

              <div className={cn(
                "max-w-[85%] lg:max-w-[70%] rounded-3xl px-5 py-3.5 text-sm lg:text-[15px] leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10"
                  : "bg-card border border-border rounded-tl-none shadow-sm"
              )}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-primary dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-card border border-border rounded-3xl rounded-tl-none px-6 py-4 flex gap-1.5 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Tray - Hidden on Mobile */}
        {messages.length <= 2 && !isTyping && !currentSessionId && (
          <div className="px-4 pb-2 hidden lg:block">
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); sendMessage(); }}
                  className="px-4 py-2 rounded-2xl border border-border bg-background/80 backdrop-blur-sm text-[13px] font-medium hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar - Reduced Height & Absolute Bottom */}
        <div className="p-3 bg-transparent mt-auto border-t border-border lg:border-none">
          <Card className="shadow-lg border border-primary/10 overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 rounded-2xl py-0">
            <CardContent className="p-0.5 px-2 flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all h-9 w-9">
                <Mic className="h-4 w-4" />
              </Button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask Care AI..."
                className="flex-1 bg-transparent py-3 text-sm lg:text-[15px] outline-none placeholder:text-muted-foreground/50"
                disabled={isTyping}
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "shrink-0 h-9 w-9 rounded-xl transition-all duration-300",
                  input.trim() ? "bg-primary shadow-md shadow-primary/20 scale-100" : "bg-muted scale-95"
                )}
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center mt-2 scale-75 lg:scale-90 opacity-60">
            <Button variant="link" size="sm" className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest hover:text-primary decoration-primary/30 py-0 h-auto">
              <Stethoscope className="h-3 w-3 mr-2" /> Connect with a specialist
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
