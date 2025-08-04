// import { Link } from 'react-router-dom';

// const Hero = ({ 
//   backgroundImage = '/images/prueba/hero.png',
  
// }) => {
//   // Debug: log de la imagen para verificar
//   console.log('Hero backgroundImage:', backgroundImage);
  
//   return (
//     <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
//       {/* -mt-20 compensa la altura del header (h-20) para que la imagen empiece desde arriba */}
      
//       {/* Background Image */}
//       <div 
//         className="absolute inset-0 z-0 bg-gray-900"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat'
//         }}
//       >
//         {/* Overlay oscuro para mejorar legibilidad del texto */}
//         <div className="absolute inset-0 bg-black/30" />
//       </div>

//       {/* Content - Ajustado para compensar el header */}
//       <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
//         {/* mt-20 empuja el contenido hacia abajo para que no se superponga con el header */}
       

       
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
//         <div className="w-px h-16 bg-white/50 mx-auto mb-4"></div>
//         <svg 
//           className="w-6 h-6 text-white/70 animate-bounce" 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={1} 
//             d="M19 14l-7 7m0 0l-7-7m7 7V3" 
//           />
//         </svg>
//       </div>
//     </section>
//   );
// };

// export default Hero;


import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Hero = ({ 
  backgroundImage = '/images/prueba/hero.png',
}) => {
  // Solo estados para el pan en mobile
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 50, y: 50 });

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    setIsPanning(true);
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startPan.current = { ...panPosition };
  };

  const handleTouchMove = (e) => {
    if (!isPanning || !isMobile) return;
    const touch = e.touches[0];
    const deltaX = (touch.clientX - startPos.current.x) / window.innerWidth * 50;
    const deltaY = (touch.clientY - startPos.current.y) / window.innerHeight * 50;

    setPanPosition({
      x: Math.max(0, Math.min(100, startPan.current.x - deltaX)),
      y: Math.max(0, Math.min(100, startPan.current.y - deltaY))
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => setIsPanning(false);

  // Event listeners solo para touch
  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isPanning, isMobile, panPosition]);

  // Debug: log de la imagen para verificar
  console.log('Hero backgroundImage:', backgroundImage);
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
      {/* -mt-20 compensa la altura del header (h-20) para que la imagen empiece desde arriba */}
      
      {/* Background Image - SOLO cambio aquí */}
      <div 
        className="absolute inset-0 z-0 bg-gray-900"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          // ✅ ÚNICO CAMBIO: backgroundSize y backgroundPosition dinámicos
          backgroundSize: isMobile ? '140% auto' : 'cover',
          backgroundPosition: isMobile ? `${panPosition.x}% ${panPosition.y}%` : 'center',
          backgroundRepeat: 'no-repeat'
        }}
        // ✅ ÚNICO CAMBIO: agregar touch handlers solo en mobile
        onTouchStart={isMobile ? handleTouchStart : undefined}
      >
        {/* Overlay oscuro - SIN CAMBIOS */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content - SIN CAMBIOS */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Tu contenido actual permanece igual */}
      </div>

      {/* Scroll Indicator - SIN CAMBIOS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-white/50 mx-auto mb-4"></div>
        <svg 
          className="w-6 h-6 text-white/70 animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;