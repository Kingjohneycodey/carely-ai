import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, Bot, User, Stethoscope } from "lucide-react";

const initialMessages = [
  { role: "assistant", content: "Hello Adebayo! 👋 I'm your Care AI health assistant. I have access to your health profile and recent records. How can I help you today?" },
];

const suggestions = [
  "Is this safe with my medication?",
  "What does my last lab value mean?",
  "I have a recurring headache",
  "Tips for managing blood pressure",
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages,
      { role: "user", content: input },
      { role: "assistant", content: "Based on your health profile and recent records, I can see you're currently taking Metformin and Amlodipine. Let me analyze your question and provide a personalized response. For your current symptoms, I'd recommend monitoring and if they persist beyond 48 hours, consider booking a consultation with a doctor who can review your full history." },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-3xl h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold mb-1">AI Health Assistant</h1>
        <p className="text-muted-foreground text-sm">Context-aware health guidance based on your profile</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "assistant" ? "bg-primary/10" : "bg-muted"
            }`}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="px-3 py-1.5 rounded-full border border-border text-xs hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <Card>
        <CardContent className="p-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0"><Mic className="h-5 w-5" /></Button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your health..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="text-center mt-2">
        <Button variant="link" size="sm" className="text-xs">
          <Stethoscope className="h-3 w-3 mr-1" /> Talk to a real doctor
        </Button>
      </div>
    </div>
  );
}
