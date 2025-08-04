import React from 'react';

function SloganPage() {
  return (
    <section className="relative min-h-[50vh] bg-white flex items-center justify-center overflow-hidden py-8 pb-24">
      {/* Container principal */}
      <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 text-center">

        {/* Slogan principal */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Logo + DIVANCO - Más cercanos */}
          <div className="flex items-center justify-center">
            {/* Logo */}
            <img
              src="/images/prueba/logo.svg"
              alt="DIVANCO Logo"
              className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
            
            {/* Texto DIVANCO */}
            <h1 className="ml-2 text-3xl md:text-5xl lg:text-6xl font-light tracking-wider text-gray-900 leading-tight">
              DIVANCO
            </h1>
          </div>
          
          {/* Slogan horizontal con separadores */}
          <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 lg:gap-8">
            {/* Diseño */}
            <div className="flex items-center">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-700 tracking-widest uppercase">
                Diseño
              </p>
            </div>
            
            {/* Separador */}
            <div className="hidden sm:flex items-center">
              <div className="w-8 md:w-12 h-px bg-gray-300"></div>
            </div>

            {/* Vanguardia */}
            <div className="flex items-center">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-700 tracking-widest uppercase">
                Vanguardia
              </p>
            </div>
            
            {/* Separador */}
            <div className="hidden sm:flex items-center">
              <div className="w-8 md:w-12 h-px bg-gray-300"></div>
            </div>

            {/* Construcción */}
            <div className="flex items-center">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-700 tracking-widest uppercase">
                Construcción
              </p>
            </div>
          </div>

          {/* Descripción complementaria */}
          <div className="mt-12 md:mt-16">
            <p className="text-sm md:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              Creamos espacios únicos que reflejan tu estilo y personalidad, 
              fusionando la elegancia contemporánea con la funcionalidad excepcional.
            </p>
          </div>
        </div>

        {/* Elementos decorativos sutiles */}
        <div className="hidden md:block absolute top-20 left-10 w-px h-20 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-50"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-px h-20 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-50"></div>
        
        {/* Círculos decorativos */}
        <div className="hidden lg:block absolute top-40 right-20 w-1 h-1 bg-gray-300 rounded-full opacity-60"></div>
        <div className="hidden lg:block absolute bottom-40 left-20 w-1 h-1 bg-gray-300 rounded-full opacity-60"></div>
      </div>

      {/* Scroll indicator sutil */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-px h-6 md:h-8 bg-gray-300 mx-auto mb-2"></div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

export default SloganPage;
