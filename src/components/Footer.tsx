import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-Agrosub-dark text-white pt-12 pb-6">
      <div className="Agrosub-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              {/* Logo modifié - Plus de dépendance externe */}
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary to-secondary p-1.5 rounded-lg mr-2">
                  <div className="bg-background p-1 rounded-md">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-gradient-to-r from-primary to-secondary">
                      <span className="text-white font-bold text-xs">SV</span>
                    </div>
                  </div>
                </div>
                <span className="text-2xl font-heading font-bold text-white">Agrosub</span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Portail officiel des financements agricoles en Côte d'Ivoire - Une initiative du Ministère de l'Agriculture et du Développement Rural.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-Agrosub-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-Agrosub-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-Agrosub-secondary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Accès rapide</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/opportunites" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Financements</Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Guides de montage</Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">À propos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Assistance</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Contact institutionnel</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="/conditions" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">Mentions légales</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span className="text-gray-300">
                  Ministère de l'Agriculture<br />
                  Plateau, Abidjan
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span className="text-gray-300">+225 20 30 40 500</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contact@Agrosub.ci" className="text-gray-300 hover:text-Agrosub-secondary transition-colors">
                  contact@Agrosub.ci
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-Agrosub-light/30 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Agrosub - Plateforme officielle des financements agricoles. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Ce site est une initiative gouvernementale de la République de Côte d'Ivoire
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;