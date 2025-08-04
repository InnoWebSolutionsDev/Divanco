import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Navegación lado izquierdo
  const leftNavigation = [
    { name: 'Showrooms', href: '/showrooms' },
    { name: 'About', href: '/about' },
  ];

  // Navegación lado derecho
  const rightNavigation = [
    { name: 'Proyectos', href: '/proyectos' },
    { name: 'Ediciones', href: '/ediciones' },
    { name: 'Blog', href: '/blog' },
  ];

  // Toda la navegación para móvil
  const allNavigation = [...leftNavigation, ...rightNavigation];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  // Detectar si estamos en la homepage
  const isHomepage = location.pathname === '/';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomepage 
        ? 'bg-transparent' // Transparente en homepage
        : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' // Normal en otras páginas
    }`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Navegación Izquierda */}
          <div className="hidden lg:flex lg:space-x-12">
            {leftNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-light uppercase tracking-wider transition-colors duration-300 ${
                  isActive(item.href)
                    ? `${isHomepage ? 'text-white border-b border-white' : 'text-black border-b border-black'}`
                    : `${isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo Central */}
          <Link to="/" className="flex items-center group">
            <span className={`text-2xl font-light tracking-[0.2em] uppercase transition-all duration-300 group-hover:opacity-70 ${
              isHomepage ? 'text-white' : 'text-black'
            }`}>
              Divanco
            </span>
          </Link>

          {/* Navegación Derecha */}
          <div className="hidden lg:flex lg:space-x-12 items-center">
            {rightNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-light uppercase tracking-wider transition-colors duration-300 ${
                  isActive(item.href)
                    ? `${isHomepage ? 'text-white border-b border-white' : 'text-black border-b border-black'}`
                    : `${isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Search Icon */}
            <Link 
              to="/buscar"
              className={`p-1 transition-colors duration-300 ${
                isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Link>

            {/* Login/Profile */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`text-sm font-light uppercase tracking-wider transition-colors duration-300 ${
                  isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {user?.name || 'Profile'}
              </Link>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-light uppercase tracking-wider transition-colors duration-300 ${
                  isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 transition-colors ${
              isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className={`px-4 pt-4 pb-6 space-y-4 border-t ${
              isHomepage 
                ? 'border-white/20 bg-black/50 backdrop-blur-sm' 
                : 'border-gray-200 bg-white'
            }`}>
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block text-base font-light uppercase tracking-wider transition-colors duration-300 ${
                    isActive(item.href)
                      ? `${isHomepage ? 'text-white' : 'text-black'}`
                      : `${isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <Link 
                to="/buscar"
                className={`block text-base font-light uppercase tracking-wider transition-colors duration-300 ${
                  isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Buscar
              </Link>

              {/* Mobile Auth */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={`block text-base font-light uppercase tracking-wider transition-colors duration-300 ${
                    isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user?.name || 'Profile'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`block text-base font-light uppercase tracking-wider transition-colors duration-300 ${
                    isHomepage ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;