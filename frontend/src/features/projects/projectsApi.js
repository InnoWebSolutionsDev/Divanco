import { baseApi } from '../../services/api.js';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ BÚSQUEDA Y FILTROS AVANZADOS
    // Búsqueda con filtros avanzados
    searchProjects: builder.query({
      query: ({ 
        title,
        tags,
        location,
        search,
        year,
        projectType,
        status,
        client,
        architect,
        featured = false,
        publicOnly = true,
        limit = 12,
        page = 1,
        sortBy = 'updatedAt',
        sortOrder = 'DESC'
      } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
          publicOnly: publicOnly.toString(),
          sortBy,
          sortOrder
        });
        
        if (title) params.append('title', title);
        if (tags) {
          const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
          params.append('tags', tagsString);
        }
        if (location) params.append('location', location);
        if (search) params.append('search', search);
        if (year) params.append('year', year.toString());
        if (projectType) params.append('projectType', projectType);
        if (status) params.append('status', status);
        if (client) params.append('client', client);
        if (architect) params.append('architect', architect);
        if (featured) params.append('featured', featured.toString());
        
        return `/projects/search?${params}`;
      },
      providesTags: ['Project'],
    }),

    // Opciones disponibles para filtros
    getFilterOptions: builder.query({
      query: () => '/projects/filter-options',
      providesTags: ['FilterOptions'],
    }),

    // Sugerencias de búsqueda
    getSearchSuggestions: builder.query({
      query: ({ query, type = 'all' }) => {
        const params = new URLSearchParams({
          query,
          type
        });
        return `/projects/suggestions?${params}`;
      },
      // No cachear sugerencias para que sean siempre actuales
      keepUnusedDataFor: 0,
    }),

    // ✅ PROYECTOS GENERALES (actualizados)
    // Obtener todos los proyectos
    getProjects: builder.query({
      query: ({ 
        limit = 12, 
        page = 1, 
        year, 
        featured, 
        projectType,
        status,
        tags,
        publicOnly = true
      } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
          publicOnly: publicOnly.toString()
        });
        
        if (year) params.append('year', year.toString());
        if (featured !== undefined) params.append('featured', featured.toString());
        if (projectType) params.append('projectType', projectType);
        if (status) params.append('status', status);
        if (tags) {
          const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
          params.append('tags', tagsString);
        }
        
        return `/projects?${params}`;
      },
      providesTags: ['Project'],
    }),

    // Proyectos destacados para homepage
    getFeaturedProjects: builder.query({
      query: (limit = 6) => `/projects/featured?limit=${limit}`,
      providesTags: ['Project'],
    }),

    // Proyectos por año
    getProjectsByYear: builder.query({
      query: (year) => `/projects/year/${year}`,
      providesTags: ['Project'],
    }),

    // ✅ NUEVO: Años disponibles (extraer de getFilterOptions si no existe endpoint separado)
    getAvailableYears: builder.query({
      query: () => '/projects/filter-options',
      transformResponse: (response) => response.data?.years || [],
      providesTags: ['FilterOptions'],
    }),

    // Obtener proyecto por slug
    getProjectBySlug: builder.query({
      query: (slug) => `/projects/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Project', id: slug }
      ],
    }),

    // ✅ NUEVO: Proyectos relacionados (si existe en backend)
    getRelatedProjects: builder.query({
      query: ({ slug, limit = 4 }) => `/projects/${slug}/related?limit=${limit}`,
      providesTags: ['Project'],
    }),

    // ✅ CRUD PARA ADMINISTRADORES
    // Crear proyecto
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project', 'FilterOptions'],
    }),

    // Actualizar proyecto
    updateProject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        'Project',
        'FilterOptions'
      ],
    }),

    // Eliminar proyecto
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project', 'FilterOptions'],
    }),

    // ✅ NUEVO SISTEMA DE ARCHIVOS MULTIMEDIA
    // Subir archivo multimedia (reemplaza uploadProjectImage)
    uploadProjectMedia: builder.mutation({
  query: ({ projectId, formData }) => {
    // ✅ Debug para verificar que FormData llega correctamente
    console.log('🔧 RTK Query uploadProjectMedia:', {
      projectId,
      isFormData: formData instanceof FormData,
      formDataEntries: formData instanceof FormData ? [...formData.entries()] : 'Not FormData'
    });

    return {
      url: `/projects/${projectId}/media`,
      method: 'POST',
      body: formData,
      // ✅ NO establecer headers - deja que el navegador maneje FormData
    };
  },
  invalidatesTags: (result, error, { projectId }) => [
    { type: 'Project', id: projectId },
    { type: 'ProjectMedia', id: projectId }
  ],
}),

    // ✅ GESTIÓN DE ARCHIVOS MULTIMEDIA
    // Obtener archivos multimedia de un proyecto
    getProjectMedia: builder.query({
      query: ({ projectId, type }) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        
        return `/projects/${projectId}/media?${params}`;
      },
      providesTags: (result, error, { projectId }) => [
        { type: 'ProjectMedia', id: projectId }
      ],
    }),

    // Actualizar archivo multimedia
    updateMediaFile: builder.mutation({
      query: ({ mediaId, ...data }) => ({
        url: `/media/${mediaId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { mediaId, projectId }) => [
        { type: 'ProjectMedia', id: projectId },
        { type: 'Project', id: projectId }
      ],
    }),

    // Eliminar archivo multimedia
    deleteMediaFile: builder.mutation({
      query: (mediaId) => ({
        url: `/media/${mediaId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'ProjectMedia', id: projectId },
        { type: 'Project', id: projectId }
      ],
    }),

    // Reordenar archivos multimedia
    reorderMediaFiles: builder.mutation({
      query: ({ projectId, mediaIds }) => ({
        url: `/projects/${projectId}/media/reorder`,
        method: 'PUT',
        body: { mediaIds },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'ProjectMedia', id: projectId },
        { type: 'Project', id: projectId }
      ],
    }),

    // ✅ UTILIDADES
    // Incrementar contador de vistas
    incrementProjectViews: builder.mutation({
      query: (slug) => ({
        url: `/projects/${slug}/view`,
        method: 'POST',
      }),
      // No invalidar cache para no refrescar datos
      invalidatesTags: [],
    }),

    
  }),
});

export const {
  // ✅ Búsqueda y filtros
  useSearchProjectsQuery,
  useGetFilterOptionsQuery,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery, // Para sugerencias on-demand
  
  // Proyectos generales
  useGetProjectsQuery,
  useGetFeaturedProjectsQuery,
  useGetProjectsByYearQuery,
  useGetAvailableYearsQuery,
  useGetProjectBySlugQuery,
  useGetRelatedProjectsQuery,
  
  // ✅ CRUD para admin
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  
  // ✅ Sistema multimedia
  useUploadProjectMediaMutation,
  useGetProjectMediaQuery,
  useUpdateMediaFileMutation,
  useDeleteMediaFileMutation,
  useReorderMediaFilesMutation,
  
  // Utilidades
  useIncrementProjectViewsMutation,
  

} = projectsApi;