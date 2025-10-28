import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const AdminLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error('Aucun utilisateur trouvé');

      // Vérification des droits admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Accès réservé aux administrateurs autorisés');
      }

      toast({
        title: 'Connexion réussie 🎉',
        description: `Bienvenue sur Agrosub, ${data.user.email}`,
      });

      navigate('/admin/dashboard');
    } catch (err: any) {
      setPassword('');
      toast({
        variant: 'destructive',
        title: 'Échec de connexion',
        description: err.message || 'Identifiants invalides ou accès non autorisé',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] dark:from-[#0d2819] dark:to-[#0a1f12]">
      <div className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] h-2 w-full"></div>
      
      <CardHeader className="space-y-1 pt-6">
        <CardTitle className="text-2xl text-center font-bold text-[#1b5e20] dark:text-[#81c784]">
          Administration Agrosub
        </CardTitle>
        <CardDescription className="text-center text-[#2e7d32] dark:text-[#a5d6a7]">
          Accès sécurisé à l'interface de gestion
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-6 pb-4">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[#1b5e20] dark:text-[#81c784]">
              Email administratif
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@Agrosub.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="bg-white/90 dark:bg-[#0e291a] border-[#a5d6a7] dark:border-[#2e7d32] focus:ring-2 focus:ring-[#2e7d32]"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-[#1b5e20] dark:text-[#81c784]">
                Mot de passe
              </Label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#2e7d32] dark:text-[#a5d6a7] hover:underline"
              >
                {showPassword ? 'Cacher' : 'Afficher'}
              </button>
            </div>
            
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="bg-white/90 dark:bg-[#0e291a] border-[#a5d6a7] dark:border-[#2e7d32] focus:ring-2 focus:ring-[#2e7d32] pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2e7d32] dark:text-[#a5d6a7] hover:text-[#1b5e20] dark:hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2e7d32] to-[#388e3c] hover:from-[#1b5e20] hover:to-[#2e7d32] text-white font-bold py-5 rounded-lg shadow-md transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Accéder au tableau de bord'
            )}
          </Button>
        </CardFooter>
      </form>
      
      <div className="px-6 pb-4 text-center">
        <p className="text-xs text-[#4caf50] dark:text-[#a5d6a7]">
          ⚠️ Cet accès est strictement réservé au personnel autorisé
        </p>
      </div>
    </Card>
  );
};

export default AdminLoginForm;