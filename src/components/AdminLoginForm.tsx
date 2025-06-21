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
      // 1️⃣ Authentification Supabase native
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error('Aucun utilisateur trouvé');

      // 2️⃣ Vérification des droits admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        // Si ce n’est pas un admin, on déconnecte immédiatement
        await supabase.auth.signOut();
        throw new Error('Accès réservé aux administrateurs autorisés');
      }

      // 3️⃣ Toast de succès
      toast({
        title: 'Connexion réussie 🎉',
        description: `Bienvenue, ${data.user.email}`,
      });

      // 4️⃣ Navigation vers le dashboard admin
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Vide le champ mot de passe pour plus de sécurité UX
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Administration AgroSub</CardTitle>
        <CardDescription>
          Connectez-vous avec vos identifiants administrateur
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email administratif</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@agrosub.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Accéder au tableau de bord'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminLoginForm;
