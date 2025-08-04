import { baseApi } from '../../services/api.js';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener todos los proyectos
    getProjects: builder.query({
      query: ({ 
        limit = 12, 
        page = 1, 
        year, 
        featured, 
        type, 
        status = 'finalizado',
        tags 
      } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
          status,
        });
        
        if (year) params.append('year', year.toString());
        if (featured !== undefined) params.append('featured', featured.toString());
        if (type) params.append('type', type);
        if (tags) params.append('tags', tags);
        
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

    // Años disponibles
    getAvailableYears: builder.query({
      query: () => '/projects/years',
      providesTags: ['Project'],
    }),

    // Obtener proyecto por slug
    getProjectBySlug: builder.query({
      query: (slug) => `/projects/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Project', id: slug }
      ],
    }),

    // Proyectos relacionados
    getRelatedProjects: builder.query({
      query: ({ slug, limit = 4 }) => `/projects/${slug}/related?limit=${limit}`,
      providesTags: ['Project'],
    }),

    // Admin: Crear proyecto
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),

    // Admin: Actualizar proyecto
    updateProject: builder.mutation({
      query: ({ slug, ...data }) => ({
        url: `/projects/${slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Project', id: slug },
        'Project'
      ],
    }),

    // Admin: Subir imagen a proyecto
    uploadProjectImage: builder.mutation({
      query: ({ slug, formData }) => ({
        url: `/projects/${slug}/upload-image`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Project', id: slug }
      ],
    }),

    // Incrementar contador de vistas
    incrementProjectViews: builder.mutation({
      query: (slug) => ({
        url: `/projects/${slug}/view`,
        method: 'POST',
      }),
      // No invalidar cache para no refrescar datos
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetFeaturedProjectsQuery,
  useGetProjectsByYearQuery,
  useGetAvailableYearsQuery,
  useGetProjectBySlugQuery,
  useGetRelatedProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUploadProjectImageMutation,
  useIncrementProjectViewsMutation,
} = projectsApi;