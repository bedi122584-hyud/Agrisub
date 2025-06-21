// src/components/OpportunityChat.tsx
import React, { useState } from "react";

const OPENAI_API_KEY = "REMOVED";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface OpportunityChatProps {
  context: string;        // résumé IA de l’opportunité
  profileType: string;    // id du profil utilisateur, ex. 'cooperative'
  profileCompleted: boolean; // si le profil est complet
}

const profileLabels: Record<string, string> = {
  entrepreneur: "Entrepreneur Agricole",
  cooperative: "Coopérative",
  investor: "Investisseur",
  incubator: "Incubateur",
  institution: "Institution",
};

const OpportunityChat: React.FC<OpportunityChatProps> = ({
  context,
  profileType,
  profileCompleted,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Construction du prompt système en incluant le profil
    const profileLabel = profileLabels[profileType] || profileType;
    let systemContent = 
      `Tu es un assistant pour la plateforme AgroSub. ` +
      `L’utilisateur a le profil : ${profileLabel}. ` +
      `Le profil est ${profileCompleted ? "complet" : "incomplet"}. ` +
      `Réponds uniquement en te basant sur le résumé suivant de l’opportunité agricole :\n\n` +
      context;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          temperature: 0.4,
          messages: [
            { role: "system", content: systemContent },
            ...updatedMessages,
          ],
        }),
      });

      const data = await res.json();
      const assistantMessage = data.choices?.[0]?.message;
      if (assistantMessage) {
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Pas de réponse reçue." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Une erreur est survenue. Réessaye plus tard.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-md p-4 mt-6 shadow-md">
      <h3 className="font-semibold mb-3 text-[#2E7D32]">
        💬 Poser une question sur cette opportunité
      </h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${
              msg.role === "user" ? "bg-green-100 text-right" : "bg-gray-100"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          value={input}
          placeholder="Pose ta question..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-[#2E7D32] text-white px-4 py-2 rounded text-sm"
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
};

export default OpportunityChat;
