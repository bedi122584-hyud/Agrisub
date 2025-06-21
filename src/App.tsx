// src/App.tsx
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Opportunities from "./pages/Opportunities";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import EmailConfirmation from "./pages/EmailConfirmation";
import SettingsPage from "./pages/SettingsPage";
import DashboardContent from "./pages/DashboardContent";
import InvestorSettingsPage from "./pages/InvestorSettingsPage"; // Nouvelle importation

import AdminRouteGuard from "./components/AdminRouteGuard";
import AdminOpportunities from "./pages/admin/opportunities/index";
import NewSubvention from "./pages/admin/opportunities/NewSubvention";
import NewConcours from "./pages/admin/opportunities/NewConcours";
import NewProjet from "./pages/admin/opportunities/NewProjet";
import NewFormation from "./pages/admin/opportunities/NewFormation";
import EditOpportunity from "./pages/admin/opportunities/EditOpportunity";
import OpportunityDetails from './pages/OpportunityDetails';
import Messages from "./pages/Messages";
import OpportunitiesChat from './pages/OpportunitiesChat';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/opportunites" element={<Opportunities />} />
            <Route path="/opportunites/:id" element={<OpportunityDetails />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/confirmation" element={<EmailConfirmation />} />
            <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />


            {/* Authentification admin */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Routes protégées utilisateur */}
            <Route path="/tableau-de-bord" element={<RequireAuth><Dashboard /></RequireAuth>}>
              <Route index element={<DashboardContent />} />
              <Route path="parametres" element={<SettingsPage />} />
              <Route path="parametres-investisseur" element={<InvestorSettingsPage />} />
              <Route path="messages" element={<OpportunitiesChat />} />
            </Route>


            {/* Dashboard admin protégé */}
            <Route path="/admin/dashboard" element={
              <AdminRouteGuard><AdminDashboard /></AdminRouteGuard>
            }/>

            {/* Routes admin/opportunities */}
            <Route path="/admin/opportunities" element={
              <AdminRouteGuard><Outlet /></AdminRouteGuard>
            }>
              <Route index element={<AdminOpportunities />} />
              <Route path="subvention/nouvelle" element={<NewSubvention />} />
              <Route path="concours/nouveau" element={<NewConcours />} />
              <Route path="projet/nouveau" element={<NewProjet />} />
              <Route path="formation/nouvelle" element={<NewFormation />} />
              <Route path=":type/:id/modifier" element={<EditOpportunity />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;