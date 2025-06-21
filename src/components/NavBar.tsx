import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
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

    checkAuth();
    return () => subscription?.unsubscribe();
  }, []);

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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="agro-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img 
                src="/agrosub-logo.svg" 
                alt="AgroSub Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40x40?text=AS";
                }} 
              />
              <span className="ml-2 text-2xl font-heading font-bold text-agro-primary">AgroSub</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-agro-dark hover:text-agro-primary transition-colors">Accueil</Link>
            <Link to="/opportunites" className="text-agro-dark hover:text-agro-primary transition-colors">Opportunités</Link>
            <div className="relative">
              <button 
                className="flex items-center text-agro-dark hover:text-agro-primary transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Ressources</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link 
                    to="/business-plan" 
                    className="block px-4 py-2 text-sm text-agro-dark hover:bg-agro-light"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Générateur de Business Plan
                  </Link>
                  <Link 
                    to="/guides" 
                    className="block px-4 py-2 text-sm text-agro-dark hover:bg-agro-light"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Guides pratiques
                  </Link>
                </div>
              )}
            </div>
            <Link to="/a-propos" className="text-agro-dark hover:text-agro-primary transition-colors">À propos</Link>
            
            {user ? (
              <>
                <Link to="/tableau-de-bord" className="text-agro-dark hover:text-agro-primary transition-colors">
                  Tableau de bord
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/connexion">
                  <Button variant="outline" className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white">
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button className="bg-agro-primary text-white hover:bg-agro-dark">Inscription</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-agro-dark hover:text-agro-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-agro-dark hover:text-agro-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/opportunites" 
                className="text-agro-dark hover:text-agro-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Opportunités
              </Link>
              <div>
                <button 
                  className="flex items-center text-agro-dark hover:text-agro-primary transition-colors mb-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>Ressources</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="pl-4 space-y-2">
                    <Link 
                      to="/business-plan" 
                      className="block text-agro-dark hover:text-agro-primary"
                      onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}
                    >
                      Générateur de Business Plan
                    </Link>
                    <Link 
                      to="/guides" 
                      className="block text-agro-dark hover:text-agro-primary"
                      onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}
                    >
                      Guides pratiques
                    </Link>
                  </div>
                )}
              </div>
              <Link 
                to="/a-propos" 
                className="text-agro-dark hover:text-agro-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/tableau-de-bord" 
                    className="text-agro-dark hover:text-agro-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    to="/connexion" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-agro-primary text-agro-primary hover:bg-agro-primary hover:text-white"
                    >
                      Connexion
                    </Button>
                  </Link>
                  <Link 
                    to="/inscription"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-agro-primary text-white hover:bg-agro-dark">
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;