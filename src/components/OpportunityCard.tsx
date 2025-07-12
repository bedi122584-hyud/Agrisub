import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Award, MapPin } from 'lucide-react';

export interface OpportunityProps {
  id: string;
  title: string;
  description: string;
  organization: string;
  type: string;
  sector: string;
  location: string;
  deadline: string;
  daysLeft: number;
  totalDays: number;
  logoUrl: string;
}

interface OpportunityCardProps {
  opportunity: OpportunityProps;
  view?: 'grid' | 'list';
}

const typeColors: Record<string, string> = {
  subvention: 'bg-green-100 text-green-800 border-green-300',
  concours: 'bg-blue-100 text-blue-800 border-blue-300',
  formation: 'bg-purple-100 text-purple-800 border-purple-300',
  projet: 'bg-orange-100 text-orange-800 border-orange-300',
  ia: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'non spécifié': 'bg-gray-100 text-gray-800 border-gray-300'
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  view = 'grid',
}) => {
  const { id, title, organization, type, location, sector, deadline, daysLeft, totalDays, logoUrl } = opportunity;
  const progressValue = Math.round(((totalDays - daysLeft) / totalDays) * 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/opportunites/${id}`}
        className={clsx(
          'group bg-background rounded-xl border border-border transition-all hover:shadow-lg hover:border-primary overflow-hidden',
          view === 'grid' ? 'flex flex-col h-full' : 'flex items-center p-6 gap-6'
        )}
      >
        <div className={clsx(
          'bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border-b border-border',
          view === 'grid' 
            ? 'w-full h-48 p-4' 
            : 'w-32 h-32 rounded-lg flex-shrink-0 p-2'
        )}>
          <img
            src={logoUrl}
            alt={title}
            className={clsx(
              'object-contain',
              view === 'grid' ? 'max-h-40' : 'max-h-24'
            )}
          />
        </div>

        <div
          className={clsx(
            'flex-1 p-4 space-y-3',
            view === 'list' && 'flex flex-col justify-between h-full'
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge className={clsx(typeColors[type], 'capitalize border')}>
                {type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {daysLeft} jours restants
              </span>
            </div>

            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{organization}</p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-primary" /> {location}
              </span>
              <span className="text-muted-foreground flex items-center">
                <Award className="w-4 h-4 mr-1 text-primary" /> {sector}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Échéance: {deadline}</span>
                <span className="text-primary font-medium">{progressValue}%</span>
              </div>
              <Progress 
                value={progressValue} 
                className="h-2 bg-muted bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default OpportunityCard;