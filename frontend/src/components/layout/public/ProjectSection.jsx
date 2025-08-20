import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSliderProjectsQuery } from '../../../features/projects/projectsApi';

const ProjectSection = ({ limit = 6 }) => {
  const { data, isLoading, error } = useGetSliderProjectsQuery(limit);
  const projects = data?.data || [];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-light mb-12 text-center tracking-tight">Proyectos Destacados</h2>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Cargando proyectos...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">Error al cargar proyectos</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay proyectos destacados</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {projects.map((project) => {
              // Usar sliderImage si existe, si no buscar en media
              const sliderImage = project.sliderImage || (project.media && project.media[0]);
              return (
                <Link
                  key={project.id}
                  to={`/proyectos/${project.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {sliderImage && sliderImage.urls ? (
                      <img
                        src={sliderImage.urls.desktop || sliderImage.urls.mobile || sliderImage.url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-black/30 group-hover:to-black/10 transition-all duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2 group-hover:text-gray-600 transition-colors">{project.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      {project.location && <span>{project.location}</span>}
                      {project.year && <span>{project.year}</span>}
                    </div>
                    {project.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    )}
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-gray-900 text-white text-xs rounded-full tracking-wide group-hover:bg-gray-700 transition">Ver más</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/proyectos" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition">Ver todos los proyectos</Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;