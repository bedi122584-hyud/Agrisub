import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Calendar, ArrowRight, Leaf, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Exemples de projets à mettre en avant
const featuredProjects = [
  {
    id: 1,
    title: "Cacaoyère durable en agroforesterie",
    description: "Production de cacao certifié avec des techniques agroécologiques innovantes",
    location: "Région du Moronou",
    sector: "Cacao",
    members: 12,
    createdAt: "Mars 2025",
    author: {
      name: "Kouassi Konan",
      image: "/avatars/user1.jpg",
      initials: "KK"
    },
    badges: ["Bio", "Export", "Certifié"],
    funding: "15M FCFA",
    status: "En cours"
  },
  {
    id: 2,
    title: "Riziculture mécanisée moderne",
    description: "Production et transformation locale de riz avec système d'irrigation innovant",
    location: "Yamoussoukro",
    sector: "Riz",
    members: 35,
    createdAt: "Janvier 2025",
    author: {
      name: "Coopérative RIZAGRI",
      image: "/avatars/coop1.jpg",
      initials: "RA"
    },
    badges: ["Coopérative", "Transformation"],
    funding: "28M FCFA",
    status: "Terminé"
  },
  {
    id: 3,
    title: "Aviculture 4.0 intégrée",
    description: "Élevage de volailles avec technologie IoT et biosécurité renforcée",
    location: "Bouaké",
    sector: "Aviculture",
    members: 8,
    createdAt: "Avril 2025",
    author: {
      name: "François Koné",
      image: "/avatars/user2.jpg",
      initials: "FK"
    },
    badges: ["Innovation", "Tech"],
    funding: "9.5M FCFA",
    status: "En cours"
  }
];

const FeaturedProjects: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Projets <span className="text-primary">phares</span> financés
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Découvrez des initiatives qui ont transformé leur secteur grâce à SubIvoir
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <Card className="h-full border border-border/40 overflow-hidden group">
                <CardHeader className="pb-0 relative">
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={project.status === "Terminé" ? "secondary" : "default"} 
                      className="font-medium"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-primary">
                      <AvatarImage src={project.author.image} alt={project.author.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {project.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.author.name}</p>
                      <p className="text-sm text-muted-foreground">{project.sector}</p>
                    </div>
                  </div>
                  
                  <CardTitle className="mt-5 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-5">
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-background border-primary/30 text-foreground"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{project.members} membres</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Lancé en {project.createdAt}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <p className="font-medium text-primary flex items-center">
                      <Leaf className="h-4 w-4 mr-2" />
                      <span>Financement obtenu: <span className="font-bold">{project.funding}</span></span>
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <a 
                    href={`/projets/${project.id}`} 
                    className="text-primary font-medium flex items-center group-hover:underline"
                  >
                    Voir les détails du projet
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <a 
            href="/projets" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Explorer tous les projets financés
            <ChevronRight className="h-5 w-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;