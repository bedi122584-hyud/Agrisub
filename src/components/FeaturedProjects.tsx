
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Calendar } from 'lucide-react';

// Exemples de projets à mettre en avant
const featuredProjects = [
  {
    id: 1,
    title: "Ferme biologique de cacao",
    description: "Culture de cacao biologique certifié sur 5 hectares avec techniques agroforestières innovantes",
    location: "Région du Moronou",
    sector: "Cacao",
    members: 12,
    createdAt: "Mars 2025",
    author: {
      name: "Kouassi Konan",
      image: "/avatars/user1.jpg",
      initials: "KK"
    },
    badges: ["Bio", "Export", "Certifié"]
  },
  {
    id: 2,
    title: "Coopérative rizicole de Yamoussoukro",
    description: "Production et transformation locale de riz pour les marchés nationaux avec irrigation innovante",
    location: "Yamoussoukro",
    sector: "Riz",
    members: 35,
    createdAt: "Janvier 2025",
    author: {
      name: "Coopérative RIZAGRI",
      image: "/avatars/coop1.jpg",
      initials: "RA"
    },
    badges: ["Coopérative", "Transformation"]
  },
  {
    id: 3,
    title: "Élevage avicole moderne",
    description: "Production d'œufs et de volailles avec système automatisé et biosécurité renforcée",
    location: "Bouaké",
    sector: "Aviculture",
    members: 8,
    createdAt: "Avril 2025",
    author: {
      name: "François Koné",
      image: "/avatars/user2.jpg",
      initials: "FK"
    },
    badges: ["Innovation", "Tech"]
  }
];

const FeaturedProjects: React.FC = () => {
  return (
    <section className="agro-section bg-white">
      <div className="agro-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-agro-primary mb-4">
            Projets agricoles financés
          </h2>
          <p className="text-lg text-agro-dark max-w-3xl mx-auto">
            Découvrez des exemples de projets qui ont bénéficié de financements grâce à AgroSub. 
            Rejoignez notre plateforme pour donner vie à votre projet agricole.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={project.author.image} alt={project.author.name} />
                      <AvatarFallback>{project.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{project.author.name}</p>
                      <p className="text-xs text-muted-foreground">{project.sector}</p>
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-4">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="bg-agro-light text-agro-dark">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {project.members} membres
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Créé en {project.createdAt}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <a 
                  href={`/projets/${project.id}`} 
                  className="text-agro-primary hover:text-agro-dark text-sm font-medium"
                >
                  Voir le projet →
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/projets" className="agro-button agro-button-primary inline-flex items-center">
            Tous les projets financés
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
