import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const AILoadingAnimation: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-40 space-y-4">
    {/* Conteneur principal avec animation de pulsation subtile */}
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative"
    >
      {/* Feuille centrale avec dégradé */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Leaf 
          size={40} 
          className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        />
      </motion.div>

      {/* Particules animées */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ 
            opacity: 0, 
            scale: 0 
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.sin((i * Math.PI) / 3) * 40}px`,
            left: `${Math.cos((i * Math.PI) / 3) * 40}px`,
          }}
        />
      ))}
    </motion.div>

    {/* Texte avec animation de dégradé */}
    <motion.p
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
      }}
      className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary bg-[length:200%_auto]"
    >
      Recherche des meilleures opportunités
    </motion.p>

    {/* Barre de progression animée */}
    <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-secondary"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  </div>
);