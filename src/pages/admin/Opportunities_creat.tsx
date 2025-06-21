import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOpportunities(data);
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publié':
        return <Badge className="bg-green-500">Publié</Badge>;
      case 'archivé':
        return <Badge className="bg-gray-500">Archivé</Badge>;
      default:
        return <Badge className="bg-yellow-500">Brouillon</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Opportunités</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="subvention/nouvelle">
                Nouvelle Subvention
              </Link>
            </Button>
            <Button asChild>
              <Link to="concours/nouveau">
                Nouveau Concours
              </Link>
            </Button>
            <Button asChild>
              <Link to="projet/nouveau">
                Nouvel Appel à Projets
              </Link>
            </Button>
            <Button asChild>
              <Link to="formation/nouvelle">
                Nouvelle Formation
              </Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell className="font-medium">{opportunity.title}</TableCell>
                  <TableCell className="capitalize">{opportunity.type}</TableCell>
                  <TableCell>{opportunity.organization}</TableCell>
                  <TableCell>{getStatusBadge(opportunity.status)}</TableCell>
                  <TableCell>
                    {format(new Date(opportunity.created_at), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/opportunites/edit/${opportunity.id}`}>
                        Modifier
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/opportunites/${opportunity.id}`}>
                        Voir
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && opportunities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune opportunité trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOpportunities;