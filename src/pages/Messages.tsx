// src/pages/Messages.tsx
import React from "react";
import OpportunitiesChat from "@/pages/OpportunitiesChat";  // ou adapte le chemin

export default function Messages() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chat Opportunités</h1>
      <OpportunitiesChat />
    </div>
  );
}
