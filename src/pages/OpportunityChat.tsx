// src/components/OpportunityChat.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface OpportunityChatProps {
  context: string;        // résumé IA de l'opportunité
  profileType: string;    // id du profil utilisateur, ex. 'cooperative'
  profileCompleted: boolean; // si le profil est complet
}

const profileLabels: Record<string, string> = {
  entrepreneur: "Entrepreneur Agricole",
  cooperative: "Coopérative",
  investor: "Investisseur",
  incubator: "Incubateur",
  institution: "Institution Publique",
};

const OpportunityChat: React.FC<OpportunityChatProps> = ({
  context,
  profileType,
  profileCompleted,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const newMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    // Construction du prompt système en incluant le profil
    const profileLabel = profileLabels[profileType] || profileType;
    const systemContent = 
      `Tu es un assistant expert pour la plateforme Agrosub. ` +
      `L'utilisateur a le profil : ${profileLabel}. ` +
      `Le profil est ${profileCompleted ? "complet" : "incomplet"}. ` +
      `Réponds uniquement en te basant sur le résumé suivant de l'opportunité agricole :\n\n` +
      context;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openai.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: 0.4,
          messages: [
            { role: "system", content: systemContent },
            ...updatedMessages.map(msg => ({ role: msg.role, content: msg.content })),
          ],
        }),
      });

      const data = await res.json();
      const assistantMessage = data.choices?.[0]?.message;
      if (assistantMessage) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: assistantMessage.content,
            timestamp: new Date()
          }
        ]);
      } else {
        setError("Aucune réponse reçue de l'assistant IA");
      }
    } catch (err) {
      setError("Erreur de connexion avec le service IA");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-border p-6 mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-full">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold">
          Assistant IA pour cette opportunité
        </h3>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto p-2 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            Posez des questions spécifiques sur cette opportunité de financement
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-background border border-border rounded-bl-none"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-primary-foreground" />
                )}
                <span className="text-xs opacity-80">
                  {msg.role === "assistant" ? "Assistant Agrosub" : "Vous"} • {formatTime(msg.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-background border border-border p-4 rounded-2xl rounded-bl-none max-w-[80%]">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Assistant Agrosub</span>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-center py-2 text-destructive text-sm">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          placeholder={`Posez votre question sur cette opportunité...`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="mt-4 text-xs text-muted-foreground flex justify-between">
        <span>Profil: {profileLabels[profileType] || profileType}</span>
        <span>Statut: {profileCompleted ? "Complet" : "À compléter"}</span>
      </div>
    </motion.div>
  );
};

export default OpportunityChat;