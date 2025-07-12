// src/pages/Messages.tsx
import React from "react";
import OpportunitiesChat from "@/pages/OpportunitiesChat";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

export default function Messages() {
  return (
    <>
      <Helmet>
        <title>Messagerie | SubIvoir</title>
        <meta name="description" content="Discutez avec l'assistant SubIvoir pour découvrir les opportunités de financement agricole en Côte d'Ivoire." />
      </Helmet>
      
      <div className="flex min-h-screen bg-gradient-to-b from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6 h-full"
          >
            <OpportunitiesChat />
          </motion.div>
        </div>
      </div>
    </>
  );
}