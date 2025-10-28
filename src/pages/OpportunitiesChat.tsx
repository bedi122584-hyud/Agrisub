"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

type Opportunity = { id: string | number; title: string; description: string };
type Message = { role: "user" | "assistant"; content: string };

export default function OpportunitiesChat() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typeProfile, setTypeProfile] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: oppData, error: oppError }, { data: userData }] = await Promise.all([
        supabase.from("opportunities").select("*"),
        supabase.auth.getUser()
      ]);

      if (oppError) {
        console.error("Erreur chargement opportunités :", oppError.message);
      } else {
        setOpportunities(oppData || []);
      }

      if (userData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("profile_type")
          .eq("id", userData.user.id)
          .single();

        if (profileError) {
          console.error("Erreur récupération profil :", profileError.message);
        } else {
          setTypeProfile(profileData?.profile_type || null);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  function buildContextPrompt(userMessage: string) {
    const profileInfo = typeProfile
      ? `L'utilisateur a le profil suivant : ${typeProfile}.`
      : "Le profil de l'utilisateur est inconnu.";

    const isGreeting = /bonjour|salut|coucou|hello|hi/i.test(userMessage.toLowerCase());

    return [
      "Tu es un assistant expert en opportunités agricoles en Côte d'Ivoire.",
      profileInfo,
      "Voici la liste des opportunités disponibles :",
      ...opportunities.map((op, i) => `#${i + 1} — ${op.title}\n${op.description}`),
      "\n\nÀ partir du profil utilisateur :",
      isGreeting 
        ? "1. Réponds au salut de manière naturelle et amicale\n" +
          "2. Liste les opportunités pertinentes avec le format demandé\n" +
          "3. Encourage l'utilisateur à poser des questions"
        : "Sélectionne et présente uniquement les opportunités pertinentes pour la demande utilisateur",
      "Format de réponse REQUIS :\n" +
      "**Titre opportunité**  \n" +
      "👉 Description concise (1-2 phrases)\n\n" +
      "Contraintes :\n" +
      "- Toujours garder les titres en gras\n" +
      "- 👉 aligné sous le titre\n" +
      "- 1 saut de ligne entre titre et description\n" +
      "- 2 sauts de ligne entre chaque opportunité\n" +
      "- Ajouter une phrase d'introduction contextuelle avant la liste"
    ].join("\n\n");
  }

  const handleSend = async (textToSend?: string) => {
    const contentToSend = textToSend ?? input;
    if (!contentToSend.trim() || sending) return;

    setMessages(prev => [...prev, { role: "user", content: contentToSend }]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer REMOVED",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 0.3,
          messages: [
            { role: "system", content: buildContextPrompt(contentToSend) },
            { role: "user", content: contentToSend },
          ],
        }),
      });

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;

      if (!answer) throw new Error("Réponse vide");

      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: answer.replace(/\n+/g, '\n\n') 
      }]);

    } catch (err) {
      console.error("Erreur OpenAI :", err);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "Désolé, une erreur est survenue. Veuillez reformuler votre demande."
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.current, { 
            type: "audio/webm; codecs=opus" 
          });
          
          if (audioBlob.size === 0) {
            throw new Error("Aucun son détecté");
          }

          const formData = new FormData();
          formData.append("file", audioBlob, "enregistrement.webm");

          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur ${response.status}: ${errorText}`);
          }

          const contentType = response.headers.get("content-type");
          if (!contentType?.includes("application/json")) {
            const rawResponse = await response.text();
            throw new Error(`Réponse invalide: ${rawResponse.substring(0, 100)}`);
          }

          const data = await response.json();
          
          if (data.text?.trim()) {
            handleSend(data.text);
          } else {
            alert("Aucune transcription disponible");
          }

        } catch (err) {
          console.error("Échec transcription:", err);
          alert(err instanceof Error ? err.message : "Erreur inconnue");
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);

      // Timeout après 30 secondes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          handleStopRecording();
        }
      }, 30000);

    } catch (err) {
      console.error("Erreur enregistrement:", err);
      alert("Accès au microphone refusé ou non supporté");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
    setRecording(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <span className="text-white font-bold text-sm">💬</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Assistant Agrosub
          </h1>
        </div>
        <p className="text-muted-foreground">
          Discutez avec notre assistant pour découvrir les opportunités de financement adaptées à votre profil
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3 mb-4 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="bg-gradient-to-r from-primary to-secondary w-8 h-8 rounded-full animate-pulse" />
            </div>
            <p className="text-muted-foreground">Chargement des opportunités...</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gradient-to-b from-muted/10 to-background rounded-xl p-4 border border-border/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="bg-gradient-to-r from-primary to-secondary text-background p-1 rounded mr-2">📋</span>
            Opportunités disponibles ({opportunities.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-2">
            {opportunities.map((opp) => (
              <motion.div
                key={opp.id}
                whileHover={{ y: -5 }}
                className="border border-border/30 p-3 rounded-lg bg-gradient-to-b from-background to-muted/5 hover:shadow-md transition-all"
              >
                <h5 className="font-medium text-foreground mb-1">{opp.title}</h5>
                <p className="text-muted-foreground text-sm">
                  {opp.description.length > 100
                    ? `${opp.description.slice(0, 100)}...`
                    : opp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/5 p-4 mb-4 rounded-xl border border-border/30 shadow-inner"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <div className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-full">
              <div className="text-4xl">💬</div>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Commencez la conversation</h3>
            <p>Posez votre première question à l'assistant Agrosub</p>
            <p className="mt-2 text-sm">Ex: "Quelles opportunités correspondent à mon profil?"</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`my-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-4 rounded-2xl max-w-3xl break-words shadow-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 ml-auto border border-primary/20"
                  : "bg-gradient-to-b from-background to-muted/5 border border-border/30"
              } transition-colors`}
            >
              {msg.role === "assistant" ? (
                <div className="space-y-3">
                  <ReactMarkdown
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong className="text-primary font-semibold" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-3 last:mb-0 leading-relaxed text-foreground" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-foreground">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Écrivez votre message ici..."
            className="w-full border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={sending}
          />
          <button
            onClick={recording ? handleStopRecording : handleStartRecording}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              recording ? "text-red-500 animate-pulse" : "text-muted-foreground"
            }`}
          >
            {recording ? "⏺️" : "🎤"}
          </button>
        </div>
        
        <button
          onClick={() => handleSend()}
          disabled={sending || recording}
          className="px-5 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
        >
          {sending ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>📬</span>
          )}
          {sending ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}