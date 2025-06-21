import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  PlusCircle,
  Search,
  Calendar,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  children?: { label: string; href: string }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  href, 
  active, 
  children 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  if (children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center w-full py-3 px-4 rounded-lg text-sm font-medium",
            active 
              ? "text-white bg-agro-primary" 
              : "text-agro-dark hover:bg-agro-secondary/20"
          )}
        >
          {icon}
          <span className="ml-3 flex-1">{label}</span>
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {expanded && (
          <div className="mt-1 ml-4 pl-4 border-l border-gray-200">
            {children.map((child, i) => (
              <Link
                key={i}
                to={child.href}
                className="flex items-center py-2 px-4 rounded-lg text-sm text-agro-dark hover:bg-agro-secondary/20"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Link
      to={href || '#'}
      className={cn(
        "flex items-center py-3 px-4 rounded-lg text-sm font-medium",
        active 
          ? "text-white bg-agro-primary" 
          : "text-agro-dark hover:bg-agro-secondary/20"
      )}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </Link>
  );
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/connexion');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/');
    }
  };
  
  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Tableau de bord",
      href: "/tableau-de-bord",
    },
    {
      icon: <Search size={20} />,
      label: "Opportunités",
      href: "/opportunites",
    },
    {
      icon: <FileText size={20} />,
      label: "Mes projets",
      children: [
        { label: "Tous les projets", href: "/mes-projets" },
        { label: "Créer un projet", href: "/mes-projets/nouveau" },
      ],
    },
    {
      icon: <Calendar size={20} />,
      label: "Candidatures",
      children: [
        { label: "En cours", href: "/candidatures/en-cours" },
        { label: "Historique", href: "/candidatures/historique" },
      ],
    },
    {
      icon: <Lightbulb size={20} />,
      label: "Business Plan IA",
      href: "/business-plan",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      href: "/tableau-de-bord/messages",
    },
    {
      icon: <Users size={20} />,
      label: "Réseau",
      href: "/reseau",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Statistiques",
      href: "/statistiques",
    },
    {
      icon: <Settings size={20} />,
      label: "Paramètres",
      href: "/tableau-de-bord/parametres", // Chemin complet
    },
  ];
  if (loading) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="px-4 py-6">
        {/* En-tête */}
        <div className="flex items-center mb-8">
          <img 
            src="/agrosub-logo.svg" 
            alt="AgroSub Logo" 
            className="h-8 w-8"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/32x32?text=AS";
            }}
          />
          <span className="ml-2 text-xl font-bold text-agro-primary">AgroSub</span>
        </div>

        
        {/* Profil utilisateur */}
        {profile && (
          <div className="mb-6 p-4 bg-agro-light/50 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-agro-primary text-white flex items-center justify-center font-bold">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-agro-dark">{profile.name}</h3>
                <p className="text-xs text-gray-500 capitalize">{profile.profile_type}</p>
              </div>
            </div>
            <Link 
              to="/mes-projets/nouveau" 
              className="flex items-center text-sm text-agro-primary hover:underline"
            >
              <PlusCircle size={16} className="mr-2" />
              Nouveau projet
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item, i) => (
            <SidebarItem
              key={i}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
              children={item.children}
            />
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
          >
            <LogOut size={20} />
            <span className="ml-3">Se déconnecter</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;