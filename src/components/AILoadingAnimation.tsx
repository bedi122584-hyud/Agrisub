import React from 'react'
import { Leaf } from 'lucide-react'

export const AILoadingAnimation: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-32 space-y-2">
    <div className="relative">
      {/* Feuille verte pulsante */}
      <Leaf size={28} className="text-green-500 animate-pulse" />

      {/* Étincelles animées autour */}
      <span className="absolute -top-2 -left-2 w-2 h-2 bg-green-300 rounded-full animate-ping" />
      <span className="absolute -top-2 -right-2 w-2 h-2 bg-green-300 rounded-full animate-ping delay-200" />
      <span className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-300 rounded-full animate-ping delay-400" />
      <span className="absolute -bottom-2 -right-2 w-2 h-2 bg-green-300 rounded-full animate-ping delay-600" />
    </div>

    {/* Texte explicatif */}
    <p className="text-gray-700 font-medium">Analyse des recommandation</p>
  </div>
)