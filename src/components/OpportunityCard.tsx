import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import clsx from 'clsx';

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
  subvention: 'bg-green-100 text-green-800',
  concours:   'bg-blue-100 text-blue-800',
  formation:  'bg-purple-100 text-purple-800',
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  view = 'grid',
}) => {
  const { id, title, organization, type, location, sector, deadline, daysLeft, totalDays, logoUrl } = opportunity;
  const progressValue = Math.round(((totalDays - daysLeft) / totalDays) * 100);

  return (
    <Link
      to={`/opportunites/${id}`}
      className={clsx(
        'group bg-white rounded-xl border transition-all hover:shadow-lg hover:border-transparent',
        view === 'grid' ? 'flex flex-col' : 'flex items-center p-6 gap-6'
      )}
    >
      <img
        src={logoUrl}
        alt={title}
        className={clsx(
          'object-cover bg-gray-50',
          view === 'grid'
            ? 'w-full h-48 rounded-t-xl'
            : 'w-32 h-32 rounded-lg flex-shrink-0'
        )}
      />

      <div
        className={clsx(
          'flex-1 p-4 space-y-3',
          view === 'list' && 'flex flex-col justify-between h-full'
        )}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge className={clsx(typeColors[type], 'capitalize')}>
              {type}
            </Badge>
            <span className="text-sm text-gray-500">
              {daysLeft} jours restants
            </span>
          </div>

          <h3 className="text-lg font-semibold group-hover:text-primary">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{organization}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">📍 {location}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">🏷️ {sector}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Échéance: {deadline}</span>
              <span className="text-gray-500">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OpportunityCard;
