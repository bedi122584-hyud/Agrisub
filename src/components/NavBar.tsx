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

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 h-navbar transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-secondary p-1.5 rounded-lg mr-2">
                <div className="bg-background p-1 rounded-md">
                  <div className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-r from-primary to-secondary">
                    <span className="text-white font-bold text-xs">SV</span>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                SubIvoir
              </span>
            </div>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary transition-colors flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </Link>
            <Link 
              to="/opportunites" 
              className="text-foreground/80 hover:text-primary transition-colors flex items-center"
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Financements
            </Link>
            
            <div className="relative">
              <button 
                className="flex items-center text-foreground/80 hover:text-primary transition-colors"
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
              className="text-foreground/80 hover:text-primary transition-colors flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              À propos
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/tableau-de-bord" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors"
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
                  className="border-primary text-primary hover:bg-primary/5 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/connexion">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-primary" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 py-4 border-t border-border mt-2">
                <Link 
                  to="/" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Accueil
                </Link>
                
                <Link 
                  to="/opportunites" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  Financements
                </Link>
                
                <div>
                  <button 
                    className="flex items-center w-full text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">Outils</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-12 pr-4 space-y-2 mt-1"
                    >
                      <Link 
                        to="/business-plan" 
                        className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                        onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        Modèles de dossiers
                      </Link>
                      <Link 
                        to="/guides" 
                        className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                        onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}
                      >
                        <BookOpen className="h-4 w-4 mr-3" />
                        Guides de montage
                      </Link>
                    </motion.div>
                  )}
                </div>
                
                <Link 
                  to="/a-propos" 
                  className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  À propos
                </Link>
                
                {user ? (
                  <>
                    <Link 
                      to="/tableau-de-bord" 
                      className="flex items-center text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Mon espace
                    </Link>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="border-primary text-primary hover:bg-primary/5 flex items-center justify-center mt-4"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link 
                      to="/connexion"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-primary text-primary hover:bg-primary/5"
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link 
                      to="/inscription"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white">
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