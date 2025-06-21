// src/pages/Opportunities.tsx
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import OpportunityCard, { OpportunityProps } from '@/components/OpportunityCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X, List, Grid } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from 'react-router-dom';

const Opportunities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    sector: '',
    location: '',
    daysRange: [0, 90] as [number, number]
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [opportunities, setOpportunities] = useState<OpportunityProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');

  // Styles des types
  const typeStyles = {
    subvention: 'bg-green-100 text-green-800',
    concours: 'bg-blue-100 text-blue-800',
    formation: 'bg-purple-100 text-purple-800',
    projet: 'bg-orange-100 text-orange-800',
    ia: 'bg-indigo-100 text-indigo-800',
    'non spécifié': 'bg-gray-100 text-gray-800'
  };

  // Formatage des données depuis Supabase
  const formatOpportunity = (o: any): OpportunityProps => {
    const deadlineDate = o.deadline ? parseISO(o.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const createdDate = parseISO(o.created_at);
    
    return {
      id: o.id,
      title: o.title || 'Opportunité sans titre',
      description: o.description || '',
      organization: o.organization || 'Organisme non spécifié',
      type: (o.type || 'ia').toLowerCase(),
      sector: o.specific_data?.sector || 'Agriculture',
      location: o.specific_data?.location || 'National',
      deadline: format(deadlineDate, 'dd MMMM yyyy', { locale: fr }),
      daysLeft: Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 3600 * 24))),
      totalDays: Math.ceil((deadlineDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)),
      logoUrl: '/images/demo-cover.png'


    };
  };

  // Chargement des données
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('status', 'publié')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedData = data?.map(formatOpportunity) || [];
        setOpportunities(formattedData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Génération des filtres
  const types = Array.from(new Set(opportunities.map(o => o.type)));
  const sectors = Array.from(new Set(opportunities.map(o => o.sector)));
  const locations = Array.from(new Set(opportunities.map(o => o.location)));

  // Filtrage des opportunités
  const filteredOpportunities = opportunities.filter(o => {
    const searchMatch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const typeMatch = !filters.type || o.type === filters.type;
    const sectorMatch = !filters.sector || o.sector === filters.sector;
    const locationMatch = !filters.location || o.location === filters.location;
    const daysMatch = o.daysLeft >= filters.daysRange[0] && o.daysLeft <= filters.daysRange[1];

    return searchMatch && typeMatch && sectorMatch && locationMatch && daysMatch;
  });

  return (
    <>
      <Helmet>
        <title>Opportunités Agricoles | AgroSub</title>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-1 container py-8 px-4 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Opportunités Agricoles</h1>
            <p className="text-muted-foreground">Subventions, formations et concours pour le secteur agricole</p>
          </div>

          {/* Contrôles */}
          <div className="mb-8 space-y-4">
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par mot-clé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                >
                  Toutes
                </Button>
                {types.map(type => (
                  <Button
                    key={type}
                    variant={activeTab === type ? 'default' : 'outline'}
                    onClick={() => setActiveTab(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      type: '',
                      sector: '',
                      location: '',
                      daysRange: [0, 90]
                    });
                    setActiveTab('all');
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(m => m === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Filtres avancés */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Select 
                value={filters.type}
                onValueChange={v => setFilters(f => ({ ...f, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type d'opportunité" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem 
                      key={type} 
                      value={type} 
                      className="capitalize"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.sector}
                onValueChange={v => setFilters(f => ({ ...f, sector: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Secteur d'activité" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.location}
                onValueChange={v => setFilters(f => ({ ...f, location: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Échéance</span>
                  <span>{filters.daysRange[0]} - {filters.daysRange[1]} jours</span>
                </div>
                <Slider
                  value={filters.daysRange}
                  onValueChange={v => setFilters(f => ({ ...f, daysRange: v as [number, number] }))}
                  min={0}
                  max={90}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune opportunité ne correspond à vos critères
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'}
            >
              {filteredOpportunities.map(opportunity => (
                viewMode === 'grid' ? (
                  <div
                    key={opportunity.id}
                    onClick={() => navigate(`/opportunites/${opportunity.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <OpportunityCard 
                      opportunity={opportunity} 
                    />
                  </div>
                ) : (
                  <div 
                    key={opportunity.id}
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={opportunity.logoUrl}
                        alt={opportunity.organization}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {opportunity.title}
                          </h3>
                          <Badge className={`${typeStyles[opportunity.type]} capitalize`}>
                            {opportunity.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {opportunity.organization}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="flex items-center gap-1">
                            📍 {opportunity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            🕒 {opportunity.daysLeft} jours restants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Opportunities;