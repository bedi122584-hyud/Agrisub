import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  Mail,
  BarChart,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  PlusCircle,
  Search,
  Calendar,
  BookOpen,
  FolderPlus,
  FileSpreadsheet,
  FileStack,
  FileCheck,
  History,
  UserCircle,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

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
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  if (children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center w-full py-3 px-4 sm:px-3 rounded-xl text-sm font-medium transition-all group",
            active
              ? "text-background bg-gradient-to-r from-primary to-secondary shadow-lg"
              : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
          )}
        >
          <div className="flex items-center">
            <div
              className={cn(
                "p-1.5 rounded-lg",
                active
                  ? "bg-background/20 text-background"
                  : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
              )}
            >
              {icon}
            </div>
            <span className="ml-3 flex-1 text-left">{label}</span>
          </div>
          {expanded ? (
            <ChevronDown
              size={18}
              className={active ? "text-background/80" : "text-foreground/60"}
            />
          ) : (
            <ChevronRight
              size={18}
              className={active ? "text-background/80" : "text-foreground/60"}
            />
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 pl-4 border-l border-muted/20 overflow-hidden"
            >
              {children.map((child, i) => (
                <Link
                  key={i}
                  to={child.href}
                  className={cn(
                    "flex items-center py-2 px-4 sm:px-3 rounded-lg text-sm transition-colors",
                    location.pathname === child.href
                      ? "text-primary font-medium"
                      : "text-foreground/70 hover:text-primary"
                  )}
                >
                  <div className="w-1 h-1 rounded-full bg-muted-foreground mr-3"></div>
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      to={href || "#"}
      className={cn(
        "flex items-center py-3 px-4 sm:px-3 rounded-xl text-sm font-medium transition-colors group",
        active
          ? "text-background bg-gradient-to-r from-primary to-secondary shadow-lg"
          : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-lg",
          active
            ? "bg-background/20 text-background"
            : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
        )}
      >
        {icon}
      </div>
      <span className="ml-3">{label}</span>
    </Link>
  );
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  interface Profile {
    id: string;
    name: string;
    profile_type: string;
    avatar_url?: string;
  }

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // pour drawer mobile

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/connexion');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, name, profile_type, avatar_url')
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
    { icon: <Home size={20} />, label: "Tableau de bord", href: "/tableau-de-bord" },
    { icon: <Search size={20} />, label: "Financements", href: "/opportunites" },
    { icon: <FolderPlus size={20} />, label: "Mes dossiers", children: [
        { label: "Tous mes dossiers", href: "/mes-dossiers" },
        { label: "Nouvelle demande", href: "/mes-dossiers/nouveau" },
      ]
    },
    { icon: <FileCheck size={20} />, label: "Suivi des demandes", children: [
        { label: "En cours d'instruction", href: "/candidatures/en-cours" },
        { label: "Historique des demandes", href: "/candidatures/historique" },
      ]
    },
    { icon: <FileSpreadsheet size={20} />, label: "Modèles de dossiers", href: "/modeles-dossiers" },
    { icon: <BookOpen size={20} />, label: "Guides de montage", href: "/guides" },
    { icon: <Mail size={20} />, label: "Messagerie", href: "/messages" },
    { icon: <BarChart size={20} />, label: "Statistiques", href: "/statistiques" },
    { icon: <Settings size={20} />, label: "Paramètres", href: "/parametres" },
  ];

  if (loading) return (
    <aside className="w-64 sm:w-64 w-full max-w-[16rem] bg-background border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl animate-pulse">
            <div className="h-8 w-8 bg-background/30 rounded-md" />
          </div>
          <div className="ml-2 h-6 bg-muted rounded-md w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Drawer toggle bouton mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-primary/80 rounded-lg text-white"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden sm:flex w-64 bg-background border-r border-border h-screen sticky top-0 overflow-y-auto">
        <SidebarContent profile={profile} navItems={navItems} location={location} handleLogout={handleLogout} />
      </aside>

      {/* Drawer mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed inset-0 z-50 w-full max-w-xs bg-background border-r border-border overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <button
                className="mb-4 p-2 rounded-lg bg-muted/50 text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
              <SidebarContent profile={profile} navItems={navItems} location={location} handleLogout={handleLogout} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

interface SidebarContentProps {
  profile: any;
  navItems: any;
  location: any;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ profile, navItems, location, handleLogout }) => (
  <div>
    {/* Logo Agrosub avec $ */}
    <motion.div
      className="flex items-center mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary shadow-lg">
          <div className="bg-background p-1 rounded-md w-full h-full flex items-center justify-center" />
        </div>
        <span className="absolute -top-2 -right-2 text-[12px] sm:text-sm font-bold text-secondary">$</span>
      </div>

      <motion.span
        className="ml-3 text-xl sm:text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Agrosub
      </motion.span>
    </motion.div>

    {/* Profil utilisateur */}
    {profile && (
      <motion.div
        className="mb-6 p-4 bg-gradient-to-b from-muted/10 to-background rounded-xl border border-border shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center mb-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-background flex items-center justify-center font-bold shadow-sm">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="ml-3">
            <h3 className="font-medium text-foreground">{profile.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.profile_type === 'agriculteur' ? 'Exploitant agricole' : profile.profile_type}
            </p>
          </div>
        </div>
        <Link
          to="/mes-dossiers/nouveau"
          className="flex items-center text-sm font-medium transition-colors group"
        >
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-1 rounded-lg group-hover:from-primary/30">
            <PlusCircle size={16} className="text-primary" />
          </div>
          <span className="ml-2 text-primary group-hover:underline">Nouvelle demande</span>
        </Link>
      </motion.div>
    )}

    {/* Navigation */}
    <nav className="space-y-1">
      <AnimatePresence>
        {navItems.map((item: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="mb-1"
          >
            <SidebarItem
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href ||
                (item.children && item.children.some((child: any) =>
                  location.pathname === child.href))}
              children={item.children}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </nav>

    {/* Déconnexion */}
    <motion.button
      onClick={handleLogout}
      className="flex items-center w-full py-3 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-destructive transition-colors group mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div className="bg-destructive/10 p-1.5 rounded-lg group-hover:bg-destructive/20">
        <LogOut size={20} className="text-destructive" />
      </div>
      <span className="ml-3 group-hover:underline">Se déconnecter</span>
    </motion.button>
  </div>
);

export default DashboardSidebar;
