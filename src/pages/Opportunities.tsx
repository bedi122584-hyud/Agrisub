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
import { Search, Filter, X, List, Grid, ArrowRight, Calendar, MapPin, Award, Clock, Leaf, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Opportunities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    sector: 'all',
    location: 'all',
    daysRange: [0, 90] as [number, number]
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [opportunities, setOpportunities] = useState<OpportunityProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sectorsCollapsed, setSectorsCollapsed] = useState(true);

  // Styles des types
  const typeStyles = {
    subvention: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    concours: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    formation: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white',
    projet: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    ia: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white',
    'non spécifié': 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
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
      logoUrl: o.logo_url || '/images/demo-cover-.png'
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
    
    const typeMatch = filters.type === 'all' || o.type === filters.type;
    const sectorMatch = filters.sector === 'all' || o.sector === filters.sector;
    const locationMatch = filters.location === 'all' || o.location === filters.location;
    const daysMatch = o.daysLeft >= filters.daysRange[0] && o.daysLeft <= filters.daysRange[1];

    return searchMatch && typeMatch && sectorMatch && locationMatch && daysMatch;
  });

  return (
    <>
      <Helmet>
        <title>Opportunités Agricoles | SubIvoir</title>
        <meta name="description" content="Découvrez toutes les opportunités de financement pour votre projet agricole en Côte d'Ivoire" />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/10">
        <NavBar />
        
        <main className="flex-1 container py-8 px-4 lg:px-8">
          {/* En-tête avec fond dégradé */}
         <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8 mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Découvrez les opportunités
              </span> pour votre exploitation
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Subventions, concours et formations pour dynamiser votre activité agricole
            </p>
          </motion.div>
        </div>
          {/* Contrôles */}
          <div className="mb-8 space-y-6">
            {/* Barre de recherche avec bouton filtre mobile */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par mot-clé, secteur, région..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-base rounded-full border-border/50 focus:border-primary"
                />
              </div>
              
              <Button 
                className="md:hidden w-full rounded-full"
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
              >
                <Filter className="mr-2 h-5 w-5" />
                Filtres avancés
              </Button>
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('all')}
                  className="rounded-full border border-border/50"
                >
                  Toutes
                </Button>
                {types.map(type => (
                  <Button
                    key={type}
                    variant={activeTab === type ? 'default' : 'outline'}
                    onClick={() => setActiveTab(type)}
                    className="rounded-full capitalize border border-border/50"
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
                      type: 'all',
                      sector: 'all',
                      location: 'all',
                      daysRange: [0, 90]
                    });
                    setActiveTab('all');
                  }}
                  className="rounded-full border border-border/50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-full border border-border/50"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-full border border-border/50"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filtres avancés (version desktop) */}
            <div className="hidden md:flex flex-wrap gap-4 bg-background p-4 rounded-2xl border border-border/30 shadow-sm">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block text-muted-foreground">Type d'opportunité</label>
                <Select 
                  value={filters.type}
                  onValueChange={v => setFilters(f => ({ ...f, type: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
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
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block text-muted-foreground">Secteur d'activité</label>
                <Select
                  value={filters.sector}
                  onValueChange={v => setFilters(f => ({ ...f, sector: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block text-muted-foreground">Localisation</label>
                <Select
                  value={filters.location}
                  onValueChange={v => setFilters(f => ({ ...f, location: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Échéance ({filters.daysRange[0]} - {filters.daysRange[1]} jours)
                </label>
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

          {/* Secteurs d'activité */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setSectorsCollapsed(!sectorsCollapsed)}>
              <h3 className="font-semibold flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-primary" />
                Secteurs d'activité
              </h3>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${sectorsCollapsed ? '' : 'rotate-180'}`} />
            </div>
            
            <AnimatePresence>
              {!sectorsCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2">
                    {sectors.map(sector => (
                      <Badge
                        key={sector}
                        variant={filters.sector === sector ? 'default' : 'outline'}
                        onClick={() => setFilters(f => ({ ...f, sector }))}
                        className="cursor-pointer border border-border/50 rounded-full px-3 py-1 text-sm font-normal"
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="border border-border/30 rounded-2xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex items-center justify-center bg-destructive/10 p-4 rounded-full mb-4">
                <X className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-destructive font-medium">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-primary to-secondary text-white rounded-full"
              >
                Réessayer
              </Button>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted/20 border border-border rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center mb-6">
                <Award className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucune opportunité correspondante</h3>
              <p className="text-muted-foreground mb-6">
                Aucun financement ne correspond à vos critères de recherche
              </p>
              <Button 
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setFilters({
                    type: 'all',
                    sector: 'all',
                    location: 'all',
                    daysRange: [0, 90]
                  });
                  setSearchTerm('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'}
              >
                {filteredOpportunities.map((opportunity, index) => (
                  viewMode === 'grid' ? (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => navigate(`/opportunites/${opportunity.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="border border-border/30 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                        <div className="relative">
                          <div className="bg-muted/20 h-48 flex items-center justify-center">
                            <img
                              src={opportunity.logoUrl}
                              alt={opportunity.organization}
                              className="w-full h-full object-cover"
                            />
                          </div>


                          
                          <div className="absolute top-4 right-4">
                            <Badge 
                              className={`${typeStyles[opportunity.type]} capitalize rounded-full px-3 py-1 text-xs font-medium`}
                            >
                              {opportunity.type}
                            </Badge>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="flex items-center text-white">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                {opportunity.daysLeft} jours restants
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">
                            {opportunity.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {opportunity.description}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-border/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {opportunity.location}
                              </div>
                              <div className="text-sm font-medium">
                                {opportunity.organization}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={opportunity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-5 border border-border/30 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => navigate(`/opportunites/${opportunity.id}`)}
                    >
                      <div className="flex items-start gap-5">
                        <div className="bg-muted/20 border border-border/30 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                          <img
                            src={opportunity.logoUrl}
                            alt={opportunity.organization}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-lg font-bold">
                              {opportunity.title}
                            </h3>
                            <Badge 
                              className={`${typeStyles[opportunity.type]} capitalize rounded-full px-3 py-1 text-xs font-medium`}
                            >
                              {opportunity.type}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {opportunity.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-primary" />
                              <span className="font-medium">{opportunity.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-primary" />
                              <span className="font-medium">{opportunity.daysLeft} jours restants</span>
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-primary" />
                              <span className="font-medium">{opportunity.organization}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            </AnimatePresence>
          )}
        </main>

        <Footer />
      </div>

      {/* Filtres mobiles */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 bg-background z-50 p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filtres avancés</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Type d'opportunité</label>
                <Select 
                  value={filters.type}
                  onValueChange={v => setFilters(f => ({ ...f, type: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Secteur d'activité</label>
                <Select
                  value={filters.sector}
                  onValueChange={v => setFilters(f => ({ ...f, sector: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Localisation</label>
                <Select
                  value={filters.location}
                  onValueChange={v => setFilters(f => ({ ...f, location: v }))}
                >
                  <SelectTrigger className="bg-background border border-border/50">
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Échéance ({filters.daysRange[0]} - {filters.daysRange[1]} jours)
                </label>
                <Slider
                  value={filters.daysRange}
                  onValueChange={v => setFilters(f => ({ ...f, daysRange: v as [number, number] }))}
                  min={0}
                  max={90}
                  step={1}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 rounded-full"
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      type: 'all',
                      sector: 'all',
                      location: 'all',
                      daysRange: [0, 90]
                    });
                    setActiveTab('all');
                  }}
                >
                  Réinitialiser
                </Button>
                <Button
                  className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Opportunities;