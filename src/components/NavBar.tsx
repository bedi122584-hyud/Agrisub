import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, Briefcase, FileText, BookOpen, Home, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🚧 Bannière déploiement temporaire */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-yellow-100 text-yellow-900 text-center text-xs sm:text-sm font-medium py-1 border-b border-yellow-300 relative"
          >
            🚧 Le site AgroSub est actuellement en déploiement temporaire. Certaines parties affichent des valeurs fictives pour démontrer l’implémentation future. Seuls les profils <strong>Investisseur</strong> et <strong>Coopérative</strong> sont disponibles pour l’inscription.
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-800 hover:text-yellow-900 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-[4.5rem]">

          {/* Logo Agrosub + $ */}
          <Link to="/" onClick={closeAllMenus} className="flex items-center flex-shrink-0 z-50">
            <span className="relative inline-flex items-center font-extrabold text-xl sm:text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Agrosub
              <span className="absolute -right-3 -top-1 text-[12px] sm:text-[14px] font-bold text-secondary">
                $
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link 
              to="/" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </Link>
            <Link 
              to="/opportunites" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Financements
            </Link>

            <div className="relative">
              <button 
                className="flex items-center text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <FileText className="h-4 w-4 mr-1" />
                <span>Outils</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-background rounded-lg shadow-lg py-2 z-20 border border-border"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link 
                      to="/business-plan" 
                      className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Modèles de dossiers
                    </Link>
                    <Link 
                      to="/guides" 
                      className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Guides de montage
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/a-propos" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              À propos
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link 
                  to="/tableau-de-bord" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors"
                  title="Mon tableau de bord"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                    <div className="bg-background rounded-full w-full h-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5 flex items-center text-xs xl:text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link to="/connexion">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary text-primary hover:bg-primary/5 text-xs xl:text-sm"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white text-xs xl:text-sm whitespace-nowrap"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            {user ? (
              <Link 
                to="/tableau-de-bord" 
                className="flex items-center"
                onClick={closeAllMenus}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                  <div className="bg-background rounded-full w-full h-full flex items-center justify-center">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link to="/connexion" onClick={closeAllMenus}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  Connexion
                </Button>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground/80 hover:text-primary transition-colors p-1 touch-manipulation"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              {/* ... Le reste du menu mobile reste inchangé ... */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
✅ Ce code :

Affiche la bannière jaune en haut avec un bouton ✕ pour la fermer.

Garde ton logo Agrosub avec $ en exposant.

Conserve toutes tes animations motion.div et AnimatePresence.

Respecte tes couleurs existantes (from-primary, to-secondary, bg-background, text-foreground, etc.).

Si tu veux, je peux aussi faire disparaître automatiquement la bannière après 8-10 secondes pour que ce soit moins intrusif sur mobile.

Veux‑tu que je fasse ça ?







Vous avez dit :
non pas de crois pour fermé, diminue la taille de la police, il disparait quand on scroll pour descendre, et il reaparait a la monté je prefaire ça 




2/2

ChatGPT a dit :
Parfait ! On peut faire exactement ça :

Pas de bouton ✕

Police plus petite

La bannière disparaît quand on scroll vers le bas et réapparaît quand on scroll vers le haut

Pour ça, on va :

Suivre la position du scroll (window.scrollY) et comparer avec la dernière position.

Définir un état bannerVisible qui contrôle l’apparition/disparition de la bannière.

Animer avec framer-motion pour un effet fluide.

Voici le code complet mis à jour pour ton NavBar :

tsx
Copier le code
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, Briefcase, FileText, BookOpen, Home, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll vers le bas → cacher la bannière
        setBannerVisible(false);
      } else {
        // Scroll vers le haut → montrer la bannière
        setBannerVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🚧 Bannière déploiement temporaire */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-yellow-100 text-yellow-900 text-center text-[10px] sm:text-xs font-medium py-1 border-b border-yellow-300"
          >
            🚧 Le site AgroSub est actuellement en déploiement temporaire. Certaines parties affichent des valeurs fictives pour démontrer l’implémentation future. Seuls les profils <strong>Investisseur</strong> et <strong>Coopérative</strong> sont disponibles pour l’inscription.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-[4.5rem]">

          {/* Logo Agrosub + $ */}
          <Link to="/" onClick={closeAllMenus} className="flex items-center flex-shrink-0 z-50">
            <span className="relative inline-flex items-center font-extrabold text-xl sm:text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Agrosub
              <span className="absolute -right-3 -top-1 text-[12px] sm:text-[14px] font-bold text-secondary">
                $
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link 
              to="/" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </Link>
            <Link 
              to="/opportunites" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Financements
            </Link>

            <div className="relative">
              <button 
                className="flex items-center text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <FileText className="h-4 w-4 mr-1" />
                <span>Outils</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-background rounded-lg shadow-lg py-2 z-20 border border-border"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link 
                      to="/business-plan" 
                      className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Modèles de dossiers
                    </Link>
                    <Link 
                      to="/guides" 
                      className="flex items-center px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Guides de montage
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/a-propos" 
              className="text-sm xl:text-base text-foreground/80 hover:text-primary transition-colors flex items-center whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              À propos
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link 
                  to="/tableau-de-bord" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors"
                  title="Mon tableau de bord"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                    <div className="bg-background rounded-full w-full h-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5 flex items-center text-xs xl:text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 xl:h-4 xl:w-4 mr-1" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link to="/connexion">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary text-primary hover:bg-primary/5 text-xs xl:text-sm"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white text-xs xl:text-sm whitespace-nowrap"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            {user ? (
              <Link 
                to="/tableau-de-bord" 
                className="flex items-center"
                onClick={closeAllMenus}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                  <div className="bg-background rounded-full w-full h-full flex items-center justify-center">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link to="/connexion" onClick={closeAllMenus}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  Connexion
                </Button>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground/80 hover:text-primary transition-colors p-1 touch-manipulation"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile/Tablet navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-1 py-3 sm:py-4 border-t border-border mt-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <Link 
                  to="/" 
                  className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-muted/50 touch-manipulation"
                  onClick={closeAllMenus}
                >
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Accueil
                </Link>
                
                <Link 
                  to="/opportunites" 
                  className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-muted/50 touch-manipulation"
                  onClick={closeAllMenus}
                >
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  Financements
                </Link>
                
                <div>
                  <button 
                    className="flex items-center w-full text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-muted/50 touch-manipulation"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="flex-1 text-left">Outils</span>
                    <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-8 sm:pl-12 pr-3 sm:pr-4 space-y-1 mt-1"
                      >
                        <Link 
                          to="/business-plan" 
                          className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 touch-manipulation"
                          onClick={closeAllMenus}
                        >
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
                          Modèles de dossiers
                        </Link>
                        <Link 
                          to="/guides" 
                          className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-muted/50 touch-manipulation"
                          onClick={closeAllMenus}
                        >
                          <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 flex-shrink-0" />
                          Guides de montage
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Link 
                  to="/a-propos" 
                  className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-muted/50 touch-manipulation"
                  onClick={closeAllMenus}
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  À propos
                </Link>
                
                {user ? (
                  <>
                    <Link 
                      to="/tableau-de-bord" 
                      className="flex items-center text-sm sm:text-base text-foreground/80 hover:text-primary transition-colors px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-muted/50 touch-manipulation"
                      onClick={closeAllMenus}
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                      Mon espace
                    </Link>
                    <div className="pt-2 px-3 sm:px-4">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          closeAllMenus();
                        }}
                        className="w-full border-primary text-primary hover:bg-primary/5 flex items-center justify-center text-sm sm:text-base h-10 sm:h-11 touch-manipulation"
                      >
                        <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 px-3 sm:px-4">
                    <Link 
                      to="/inscription"
                      onClick={closeAllMenus}
                    >
                      <Button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white text-sm sm:text-base h-10 sm:h-11 touch-manipulation">
                        Créer un compte
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
