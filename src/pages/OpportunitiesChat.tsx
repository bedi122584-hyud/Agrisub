"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

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
    <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">🌱 Assistant Agro-Opportunités</h2>

      {loading ? (
        <div className="animate-pulse space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            📋 Opportunités disponibles ({opportunities.length})
          </h3>
          <ul className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {opportunities.map((opp) => (
              <li
                key={opp.id}
                className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-800 mb-1">{opp.title}</h3>
                <p className="text-gray-600 text-sm">
                  {opp.description.length > 200
                    ? `${opp.description.slice(0, 200)}...`
                    : opp.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-4 mb-4 rounded-xl border border-gray-200 shadow-inner"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-4 rounded-2xl max-w-3xl break-words ${
                msg.role === "user"
                  ? "bg-blue-100 ml-auto hover:bg-blue-50"
                  : "bg-white border-gray-200 border hover:bg-gray-50"
              } transition-colors`}
            >
              {msg.role === "assistant" ? (
                <div className="space-y-2">
                  <ReactMarkdown
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong className="text-green-800 font-semibold" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-3 last:mb-0 leading-relaxed" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-800">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Écrivez votre message ici..."
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
        />
        <button
          onClick={() => handleSend()}
          disabled={sending}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {sending ? (
            <>
              <span className="animate-spin">⏳</span>
              Envoi...
            </>
          ) : (
            <>
              <span>📬</span>
              Envoyer
            </>
          )}
        </button>
        <button
          onClick={recording ? handleStopRecording : handleStartRecording}
          className={`ml-2 px-4 py-3 rounded-xl text-white font-medium transition-colors ${
            recording ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {recording ? "⏹️ Stop" : ""}
        </button>
      </div>
    </div>
  );
}
