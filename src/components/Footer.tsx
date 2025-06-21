
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-agro-dark text-white pt-12 pb-6">
      <div className="agro-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/agrosub-logo.svg" 
                alt="AgroSub Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40x40?text=AS";
                }}
              />
              <span className="ml-2 text-2xl font-heading font-bold text-white">AgroSub</span>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              La plateforme qui connecte les acteurs agricoles ivoiriens avec les opportunités de financement et d'accompagnement.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-agro-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-agro-secondary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-agro-secondary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-agro-secondary transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/opportunites" className="text-gray-300 hover:text-agro-secondary transition-colors">Opportunités</Link>
              </li>
              <li>
                <Link to="/business-plan" className="text-gray-300 hover:text-agro-secondary transition-colors">Générateur de Business Plan</Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-agro-secondary transition-colors">À propos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Aide & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-agro-secondary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-agro-secondary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-agro-secondary transition-colors">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="/conditions" className="text-gray-300 hover:text-agro-secondary transition-colors">Conditions d'utilisation</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span className="text-gray-300">Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span className="text-gray-300">+225 0123456789</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contact@agrosub.ci" className="text-gray-300 hover:text-agro-secondary transition-colors">contact@agrosub.ci</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AgroSub. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
