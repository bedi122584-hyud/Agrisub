import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  mode: 'login' | 'register';
}

const profileTypes = [
  { id: 'agriculteur', label: 'Agriculteur/Éleveur' },
  { id: 'cooperative', label: 'Coopérative agricole' },
  { id: 'pme', label: 'PME Agroalimentaire' },
  { id: 'investisseur', label: 'Investisseur' },
  { id: 'institution', label: 'Institution publique' },
];

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileType, setProfileType] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Connexion utilisateur
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Récupération du profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (!profile) throw new Error('Profil utilisateur introuvable');

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${profile.name} sur Subivoir`
        });

        navigate('/tableau-de-bord');

      } else {
        // Inscription utilisateur
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              profile_type: profileType
            }
          }
        });

        if (error) throw error;

        // Vérification de la création du profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (!profile) throw new Error('Échec de la création du profil');

        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte"
        });

        navigate('/confirmation');
      }

    } catch (error: unknown) {
      console.error('Erreur:', error);
      let message = "Une erreur est survenue";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full border border-subivoir-light/30 shadow-subivoir-light/20">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-subivoir-dark text-2xl font-bold">
          {mode === 'login' ? 'Connexion à SubIvoir' : 'Création de compte'}
        </CardTitle>
        <CardDescription className="text-subivoir-muted text-base">
          {mode === 'login' 
            ? 'Accédez à votre espace de gestion des financements agricoles' 
            : 'Rejoignez la plateforme officielle des financements agricoles'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-subivoir-dark">Nom complet</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Entrez votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-subivoir-light/50 focus:border-subivoir-primary"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-subivoir-dark">Email institutionnel</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-subivoir-light/50 focus:border-subivoir-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-subivoir-dark">Mot de passe</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-subivoir-light/50 focus:border-subivoir-primary"
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subivoir-muted hover:text-subivoir-dark"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {mode === 'register' && (
            <div className="space-y-2">
              <Label className="text-subivoir-dark">Type de profil</Label>
              <RadioGroup 
                value={profileType} 
                onValueChange={setProfileType}
                required
                className="grid grid-cols-1 gap-3"
              >
                {profileTypes.map((type) => (
                  <div 
                    key={type.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      profileType === type.id 
                        ? 'border-subivoir-primary bg-subivoir-primary/10' 
                        : 'border-subivoir-light/30 hover:border-subivoir-light/50'
                    }`}
                  >
                    <RadioGroupItem 
                      value={type.id} 
                      id={`profile-${type.id}`} 
                      className="text-subivoir-primary border-subivoir-light/50"
                    />
                    <Label 
                      htmlFor={`profile-${type.id}`} 
                      className="cursor-pointer text-subivoir-dark font-normal"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            className="w-full bg-subivoir-primary hover:bg-subivoir-dark"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Connexion en cours...' : 'Inscription en cours...'}
              </>
            ) : (
              mode === 'login' ? 'Se connecter' : "Créer mon compte"
            )}
          </Button>
          
          <div className="mt-4 text-center text-sm text-subivoir-muted">
            {mode === 'login' ? (
              <>
                <p>
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/inscription" 
                    className="text-subivoir-primary hover:underline font-medium"
                  >
                    S'inscrire
                  </Link>
                </p>
                <p className="mt-2">
                  <Link 
                    to="/mot-de-passe-oublie" 
                    className="text-subivoir-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </p>
              </>
            ) : (
              <p>
                Déjà inscrit ?{' '}
                <Link 
                  to="/connexion" 
                  className="text-subivoir-primary hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            )}
          </div>
          
          <div className="mt-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-subivoir-light/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-subivoir-muted">Ou continuer avec</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                className="border-subivoir-light/50 hover:border-subivoir-light/70 text-subivoir-dark"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                className="border-subivoir-light/50 hover:border-subivoir-light/70 text-subivoir-dark"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;