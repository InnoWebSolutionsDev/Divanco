import React, { useState, useRef } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdStar, MdTune, MdImage } from 'react-icons/md';

import { useGetProjectsQuery, useDeleteProjectMutation, useUpdateProjectMutation, useToggleSliderImageMutation } from '../../../features/projects/projectsApi';
import ProjectUpload from './ProjectUpload';


const AdminProjectPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  // Cambiar showInSlider
  const handleToggleSlider = async (project) => {
    try {
      await updateProject({ id: project.id, showInSlider: !project.showInSlider }).unwrap();
      refetch();
    } catch (err) {
      alert('Error al actualizar el slider.');
    }
  };

  // Marcar imagen como slider
  const [toggleSliderImage, { isLoading: isTogglingSliderImage }] = useToggleSliderImageMutation();
  const handleSetSliderImage = async (projectId, mediaId) => {
    try {
      await toggleSliderImage({ projectId, mediaId }).unwrap();
      refetch();
    } catch (err) {
      alert('Error al marcar imagen del slider.');
    }
  };

  const {
    data: projectsData,
    isLoading,
    error,
    refetch
  } = useGetProjectsQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined
  });

  const projects = projectsData?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProject(id).unwrap();
        refetch();
      } catch (err) {
        alert('Error al eliminar el proyecto.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>
            <p className="mt-2 text-gray-600">Administra los proyectos</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => {
                setSelectedProject(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <MdAdd className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar proyectos</label>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por título..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando proyectos...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error al cargar los proyectos</p>
              <p className="text-sm text-gray-500 mt-2">{JSON.stringify(error)}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No hay proyectos disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Img Slider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {project.media && project.media.length > 0 && project.media[0].urls?.mobile && (
                            <img
                              className="h-12 w-12 rounded-lg object-cover mr-2"
                              src={project.media[0].urls.mobile}
                              alt={project.title}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-xs text-gray-500">{project.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.year}</td>
                      <td className="px-6 py-4 text-center">
                        {project.isFeatured ? <MdStar className="w-5 h-5 text-yellow-400 inline" /> : <MdStar className="w-5 h-5 text-gray-300 inline" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className={project.showInSlider ? 'text-blue-500' : 'text-gray-300'}
                          title={project.showInSlider ? 'Quitar del slider' : 'Mostrar en slider'}
                          onClick={() => handleToggleSlider(project)}
                          disabled={isUpdating}
                        >
                          <MdTune className="w-5 h-5 inline" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {project.media && project.media.length > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            {project.media.map((img) => (
                              <button
                                key={img.id}
                                className={img.isSliderImage ? 'text-green-600' : 'text-gray-400 hover:text-blue-500'}
                                title={img.isSliderImage ? 'Imagen del slider' : 'Marcar como imagen del slider'}
                                onClick={() => handleSetSliderImage(project.id, img.id)}
                                disabled={isTogglingSliderImage}
                              >
                                <MdImage className="w-5 h-5 inline" />
                                {img.isSliderImage && <span className="ml-1 text-xs">Slider</span>}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.status || project.etapa}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver proyecto"
                            onClick={() => window.open(`/proyectos/${project.slug}`, '_blank')}
                          >
                            <MdVisibility className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setShowForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar proyecto"
                          >
                            <MdEdit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Eliminar proyecto"
                            onClick={() => handleDelete(project.id)}
                            disabled={isDeleting}
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar proyecto */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowForm(false);
                setSelectedProject(null);
                refetch();
              }}
            >
              ×
            </button>
            <ProjectUpload
              projectId={selectedProject?.id || null}
              onProjectCreated={() => {
                setShowForm(false);
                setSelectedProject(null);
                refetch();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectPage;
