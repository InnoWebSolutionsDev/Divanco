import { baseApi } from '../../services/api.js';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener posts del blog
    getBlogPosts: builder.query({
      query: ({ limit = 10, page = 1, featured, author } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
        });
        
        if (featured !== undefined) params.append('featured', featured.toString());
        if (author) params.append('author', author);
        
        return `/blog?${params}`;
      },
      providesTags: ['BlogPost'],
    }),

    // Posts destacados para homepage
    getFeaturedBlogPosts: builder.query({
      query: (limit = 3) => `/blog/featured?limit=${limit}`,
      providesTags: ['BlogPost'],
    }),

    // Posts recientes
    getRecentBlogPosts: builder.query({
      query: (limit = 5) => `/blog/recent?limit=${limit}`,
      providesTags: ['BlogPost'],
    }),

    // Obtener post por slug
    getBlogPostBySlug: builder.query({
      query: (slug) => `/blog/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'BlogPost', id: slug }
      ],
    }),

    // Posts relacionados
    getRelatedBlogPosts: builder.query({
      query: ({ slug, limit = 3 }) => `/blog/${slug}/related?limit=${limit}`,
      providesTags: ['BlogPost'],
    }),

    // Admin: Crear post
    createBlogPost: builder.mutation({
      query: (postData) => ({
        url: '/blog',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['BlogPost'],
    }),

    // Admin: Actualizar post
    updateBlogPost: builder.mutation({
      query: ({ slug, ...data }) => ({
        url: `/blog/${slug}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'BlogPost', id: slug },
        'BlogPost'
      ],
    }),

    // Admin: Subir imagen a post
    uploadBlogPostImage: builder.mutation({
      query: ({ slug, formData }) => ({
        url: `/blog/${slug}/upload-image`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'BlogPost', id: slug }
      ],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetFeaturedBlogPostsQuery,
  useGetRecentBlogPostsQuery,
  useGetBlogPostBySlugQuery,
  useGetRelatedBlogPostsQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useUploadBlogPostImageMutation,
} = blogApi;