import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuVisible, setDesktopMenuVisible] = useState(false); // ✅ Control de visibilidad desktop
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
      setScrolled(scrollPosition > 100);
    };

    if (isHomepage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setScrolled(false);
    }
  }, [isHomepage]);

  // Función para manejar el triple click en el logo
  const handleLogoClick = (e) => {
    e.preventDefault();
    setClickCount(prev => prev + 1);
    
    setTimeout(() => {
      setClickCount(0);
    }, 2000);

    if (clickCount === 2) {
      navigate('/login');
      setClickCount(0);
    }
  };

  // Lógica para el fondo del header
  const getHeaderBackground = () => {
    if (!isHomepage) {
      return 'bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-white/10 py-8';
    } else {
      return 'bg-transparent';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderBackground()}`}>
      {/* Fondo expandible SOLO para homepage con scroll */}
      {isHomepage && scrolled && (
        <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-white/10 transition-all duration-500" 
             style={{ 
               top: '-2rem',
               bottom: '-4rem'
             }}
        />
      )}
      
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ✅ Desktop: Contenedor con hover para revelar menú completo */}
        <div 
          className="hidden lg:block"
          onMouseEnter={() => setDesktopMenuVisible(true)}
          onMouseLeave={() => setDesktopMenuVisible(false)}
        >
          <div className={`flex items-center justify-between relative transition-all duration-500 ${
            isHomepage ? 'top-8 h-18 pt-8' : ' h-16 pt-4'
          }`}>
            
            {/* ✅ Navegación Izquierda - Con opacidad controlada */}
            <div className={`flex items-center space-x-6 xl:space-x-8 ml-4 xl:ml-8 transition-all duration-500 ${
              desktopMenuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              {leftNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 text-lg md:text-xl lg:text-xl ${
                    isActive(item.href)
                      ? 'text-white border-b border-white/60'
                      : 'text-white/90 hover:text-white hover:border-b hover:border-white/40'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/buscar"
                className="transition-all duration-300 hover:scale-110 p-2 text-white/90 hover:text-white"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
            </div>

            {/* ✅ Logo Central - Con opacidad controlada */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              desktopMenuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <Link 
                to="/" 
                className="flex items-center group relative z-10"
                onClick={handleLogoClick}
              >
                <span className="font-sans font-semibold uppercase transition-all duration-500 group-hover:opacity-80 text-4xl md:text-4xl lg:text-5xl tracking-tight text-white">
  Divanco
</span>
                
                {/* Indicador visual para clicks */}
                {clickCount > 0 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          i < clickCount ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Link>
            </div>

            {/* ✅ Navegación Derecha - Con opacidad controlada */}
            <div className={`flex items-center space-x-6 xl:space-x-8 mr-4 xl:-mr-4 transition-all duration-500 ${
              desktopMenuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              {rightNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 text-lg md:text-xl lg:text-xl ${
                    isActive(item.href)
                      ? 'text-white border-b border-white/60'
                      : 'text-white/90 hover:text-white hover:border-b hover:border-white/40'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* {isAuthenticated && (
                <Link
                  to="/profile"
                  className="font-light uppercase tracking-wider transition-all duration-300 hover:scale-105 text-lg md:text-xl lg:text-2xl text-white/90 hover:text-white"
                >
                  {user?.name || 'Profile'}
                </Link>
              )} */}
            </div>

            {/* ✅ Hamburguesa - Siempre visible, a la derecha */}
            <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
              desktopMenuVisible ? 'opacity-30' : 'opacity-100'
            }`}>
              <button className="p-2 transition-all duration-300 hover:scale-110 text-white/90 hover:text-white">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

          </div>
        </div>

        {/* ✅ Mobile: Sin cambios */}
        <div className="lg:hidden">
          <div className={`flex items-center justify-between relative transition-all duration-500 ${
            isHomepage ? 'top-8 h-18 pt-8' : ' h-16 pt-4'
          }`}>
            
            {/* Logo Central Mobile */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link 
                to="/" 
                className="flex items-center group relative z-10"
                onClick={handleLogoClick}
              >
               <span className="font-sans font-semibold uppercase transition-all duration-500 group-hover:opacity-80 text-4xl md:text-4xl lg:text-5xl tracking-tight text-white">
  Divanco
</span>
                
                {clickCount > 0 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          i < clickCount ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 transition-all duration-300 hover:scale-110 ${
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

              {/* {isAuthenticated && (
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
              )} */}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;