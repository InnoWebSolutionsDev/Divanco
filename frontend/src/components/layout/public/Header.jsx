import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Detectar scroll en homepage
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100); // Cambiar después de 100px de scroll
    };

    if (isHomepage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setScrolled(false); // Reset cuando no estamos en homepage
    }
  }, [isHomepage]);

  // Función para manejar el triple click en el logo
  const handleLogoClick = (e) => {
    e.preventDefault();
    setClickCount(prev => prev + 1);
    
    // Reset del contador después de 2 segundos
    setTimeout(() => {
      setClickCount(0);
    }, 2000);

    // Si es el tercer click, navegar a login
    if (clickCount === 2) {
      navigate('/login');
      setClickCount(0);
    }
  };

  // Lógica para el fondo del header
  const getHeaderBackground = () => {
    if (!isHomepage) {
      // En otras páginas: mismo fondo oscuro que en homepage con scroll
      return 'bg-gray-800/80  backdrop-blur-md shadow-lg border-b border-white/10 py-8';
    } else {
      // En homepage: sin fondo base (usaremos pseudo-elemento)
      return 'bg-transparent';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderBackground()}`}>
      {/* Fondo expandible SOLO para homepage con scroll */}
      {isHomepage && scrolled && (
        <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-white/10 transition-all duration-500" 
             style={{ 
               top: '-2rem',  // Expande hacia arriba
               bottom: '-4rem' // Expande hacia abajo
             }}
        />
      )}
      
     <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header flotante - Ajuste condicional de posición */}
       <div className={`flex items-center justify-between relative transition-all duration-500 ${
          isHomepage ? 'top-12 h-24 pt-8' : ' h-16 pt-4'  // ✅ Menos top y padding en otras páginas
        }`}>
          
          {/* Navegación Izquierda - MISMO espaciado */}
          <div className={`hidden lg:flex items-center space-x-6 xl:space-x-8 ${
            'ml-4 xl:ml-8'  // ✅ Mismo espaciado siempre
          }`}>
            {leftNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                  'text-lg md:text-xl lg:text-2xl'  // ✅ Mismo tamaño siempre
                } ${
                  isActive(item.href)
                    ? 'text-white border-b border-white/60'  // ✅ Simplificado
                    : 'text-white/90 hover:text-white hover:border-b hover:border-white/40'  // ✅ Simplificado
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/buscar"
              className="transition-all duration-300 hover:scale-110 p-2 text-white/90 hover:text-white"  // ✅ Simplificado
            >
              <MagnifyingGlassIcon className="h-6 w-6" />  {/* ✅ Mismo tamaño siempre */}
            </Link>
          </div>

          {/* Logo Central - MISMO tamaño */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link 
              to="/" 
              className="flex items-center group relative z-10"
              onClick={handleLogoClick}
            >
              <span className={`font-light uppercase transition-all duration-500 group-hover:opacity-80 ${
                'text-4xl md:text-5xl lg:text-6xl tracking-[0.3em] text-white'  // ✅ Mismo tamaño siempre
              }`}>
                Divanco
              </span>
              
              {/* Indicador visual para clicks */}
              {clickCount > 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i < clickCount ? 'bg-white' : 'bg-white/30'  // ✅ Simplificado
                      }`}
                    />
                  ))}
                </div>
              )}
            </Link>
          </div>

          {/* Navegación Derecha - MISMO espaciado */}
          <div className={`hidden lg:flex items-center space-x-6 xl:space-x-8 ${
            'mr-4 xl:-mr-4'  // ✅ Mismo espaciado siempre
          }`}>
            {rightNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                  'text-lg md:text-xl lg:text-2xl'  // ✅ Mismo tamaño siempre
                } ${
                  isActive(item.href)
                    ? 'text-white border-b border-white/60'  // ✅ Simplificado
                    : 'text-white/90 hover:text-white hover:border-b hover:border-white/40'  // ✅ Simplificado
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Profile (solo si está autenticado) */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 ${
                  'text-lg md:text-xl lg:text-2xl'  // ✅ Mismo tamaño siempre
                } text-white/90 hover:text-white`}  // ✅ Simplificado
              >
                {user?.name || 'Profile'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden absolute right-0 top-1/2 transform -translate-y-1/2 p-2 transition-all duration-300 hover:scale-110 ${
              (isHomepage && !scrolled) ? 'text-white/90 hover:text-white' : 
              (isHomepage && scrolled) ? 'text-white/90 hover:text-white' :
              'text-gray-600 hover:text-black'
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
            <div className={`px-6 pt-6 pb-8 space-y-6 border-t transition-all duration-300 ${
              (isHomepage && !scrolled) ? 'border-white/20 bg-black/70 backdrop-blur-md' : 
              (isHomepage && scrolled) ? 'border-white/20 bg-black/80 backdrop-blur-md' :
              'border-gray-200 bg-white/95 backdrop-blur-sm'
            }`}>
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block text-lg font-light uppercase tracking-wider transition-all duration-300 hover:translate-x-2 ${
                    isActive(item.href)
                      ? `${(isHomepage && !scrolled) ? 'text-white border-l-2 border-white pl-4' : 
                          (isHomepage && scrolled) ? 'text-white border-l-2 border-white pl-4' :
                          'text-black border-l-2 border-black pl-4'}`
                      : `${(isHomepage && !scrolled) ? 'text-white/90 hover:text-white hover:pl-2' : 
                          (isHomepage && scrolled) ? 'text-white/90 hover:text-white hover:pl-2' :
                          'text-gray-600 hover:text-black hover:pl-2'}`
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <Link 
                to="/buscar"
                className={`block text-lg font-light uppercase tracking-wider transition-all duration-300 hover:translate-x-2 ${
                  (isHomepage && !scrolled) ? 'text-white/90 hover:text-white hover:pl-2' : 
                  (isHomepage && scrolled) ? 'text-white/90 hover:text-white hover:pl-2' :
                  'text-gray-600 hover:text-black hover:pl-2'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Buscar
              </Link>

              {/* Mobile Profile (solo si está autenticado) */}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`block text-lg font-light uppercase tracking-wider transition-all duration-300 hover:translate-x-2 ${
                    (isHomepage && !scrolled) ? 'text-white/90 hover:text-white hover:pl-2' : 
                    (isHomepage && scrolled) ? 'text-white/90 hover:text-white hover:pl-2' :
                    'text-gray-600 hover:text-black hover:pl-2'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user?.name || 'Profile'}
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