// src/components/AdminRouteGuard.tsx
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: Props) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      try {
        // 🔄 Récupère la session (avec user et tokens)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          throw new Error('Non authentifié');
        }

        // 🔒 Vérification en base que cet user est bien un admin
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (adminError || !admin) {
          throw new Error('Non autorisé');
        }

        if (isMounted) setStatus('authorized');
      } catch {
        if (isMounted) setStatus('unauthorized');
      }
    };

    // 1) Vérification initiale
    verifyAdmin();

    // 2) Écoute des événements (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        verifyAdmin();
      }
      if (event === 'SIGNED_OUT') {
        if (isMounted) setStatus('unauthorized');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Quand on a conclu que ce n'est pas autorisé, on envoie vers le login
  useEffect(() => {
    if (status === 'unauthorized') {
      navigate('/admin/login', { replace: true });
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5DC]">
        <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return status === 'authorized' ? <>{children}</> : null;
};

export default AdminRouteGuard;
