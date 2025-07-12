import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Settings,
  LogOut,
  PlusCircle,
  MessageSquare,
  Shield,
  Sparkles,
  Bot
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      setAdmin(data);
    };

    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/admin/login');
    }
  };

  const navItems = [
    { icon: <LayoutDashboard />, label: "Tableau de bord IA", href: "/admin/dashboard" },
    { icon: <Sparkles />, label: "Opportunités IA", href: "/admin/opportunities" },
    { icon: <Users />, label: "Utilisateurs", href: "/admin/utilisateurs" },
    { icon: <MessageSquare />, label: "Messages IA", href: "/admin/messages" },
    { icon: <Shield />, label: "Modération IA", href: "/admin/moderation" },
    { icon: <BarChart2 />, label: "Analyses IA", href: "/admin/analytics" },
    { icon: <Settings />, label: "Paramètres IA", href: "/admin/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed md:sticky md:top-0 w-full max-w-xs md:w-64 h-full md:h-screen transform transition-transform duration-300 ease-in-out",
        "bg-gradient-to-b from-[#0e291a] to-[#08170e] text-white z-50 flex flex-col overflow-y-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex-1 flex flex-col overflow-y-auto px-3 md:px-4 py-4 md:py-6">
        {/* En-tête mobile */}
        <div className="md:hidden flex justify-between items-center w-full mb-6">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-1 rounded-lg mr-1">
                <div className="bg-[#0e291a] p-0.5 rounded-md">
                  <div className="w-6 h-6 flex items-center justify-center rounded bg-gradient-to-r from-[#2e7d32] to-[#388e3c]">
                    <span className="text-white font-bold text-xs">SV</span>
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-white">SubIvoir IA</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo et titre desktop */}
        <div className="hidden md:flex items-center justify-center mb-8 mt-2">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] p-1.5 rounded-lg mr-2">
              <div className="bg-[#0e291a] p-1 rounded-md">
                <div className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-r from-[#2e7d32] to-[#388e3c]">
                  <span className="text-white font-bold">SV</span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">SubIvoir</span>
              <p className="text-xs text-[#81c784]">Powered by AI</p>
            </div>
          </div>
        </div>

        {/* Section profil */}
        <div className="mb-6 p-3 bg-[#1a3c29] rounded-lg border border-[#2e7d32]/30">
          <div className="flex items-center mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#2e7d32] to-[#388e3c] text-white flex items-center justify-center font-bold">
              {admin?.email?.substring(0, 1).toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium truncate text-white">{admin?.email || 'Administrateur IA'}</h3>
              <p className="text-xs text-[#a5d6a7]">Accès Premium</p>
            </div>
          </div>
          <Link
            to="/admin/opportunites"
            className="flex items-center text-sm text-[#a5d6a7] hover:text-white transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="truncate">Créer avec IA</span>
          </Link>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center py-2 md:py-3 px-3 rounded-lg text-sm",
                "hover:bg-[#2e7d32]/30 transition-colors truncate group",
                location.pathname === item.href && "bg-[#2e7d32]/20"
              )}
            >
              {React.cloneElement(item.icon, { 
                className: cn(
                  "h-5 w-5 md:h-6 md:w-6 transition-colors",
                  location.pathname === item.href 
                    ? "text-white" 
                    : "text-[#a5d6a7] group-hover:text-white"
                ) 
              })}
              <span className={cn(
                "ml-2 md:ml-3 transition-colors",
                location.pathname === item.href 
                  ? "text-white font-medium" 
                  : "text-[#a5d6a7] group-hover:text-white"
              )}>
                {item.label}
              </span>
              
              {item.label.includes("IA") && (
                <span className="ml-auto bg-[#388e3c] text-white text-xs px-1.5 py-0.5 rounded">
                  AI
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Déconnexion en bas */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center py-2 md:py-3 px-3 rounded-lg text-sm text-[#ef9a9a] hover:bg-red-900/20 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 md:h-6 md:w-6" />
            <span className="ml-2 md:ml-3">Se déconnecter</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;