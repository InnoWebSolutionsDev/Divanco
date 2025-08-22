import { baseApi } from '../../services/api.js';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener productos con filtros
    getProducts: builder.query({
      query: ({ 
        page = 1, 
        limit = 12, 
        subcategoryId, 
        categoryId, 
        search, 
        featured, 
        isNew, 
        brand, 
        sortBy = 'order', 
        sortOrder = 'ASC' 
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder
        });
        
        if (subcategoryId) params.append('subcategoryId', subcategoryId);
        if (categoryId) params.append('categoryId', categoryId);
        if (search) params.append('search', search);
        if (featured !== undefined) params.append('featured', featured.toString());
        if (isNew !== undefined) params.append('isNew', isNew.toString());
        if (brand) params.append('brand', brand);
        
        return `/products?${params}`;
      },
      transformResponse: (response) => {
        // El backend devuelve { success: true, data: { products: [...], pagination: {...} } }
        // Necesitamos extraer y reestructurar para que el hook funcione correctamente
        return {
          products: response.data?.products || [],
          total: response.data?.pagination?.totalItems || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
          currentPage: response.data?.pagination?.currentPage || 1,
        };
      },
      providesTags: (result, error, { subcategoryId, categoryId }) => {
        const tags = ['Product'];
        if (subcategoryId) tags.push({ type: 'Product', id: `subcategory-${subcategoryId}` });
        if (categoryId) tags.push({ type: 'Product', id: `category-${categoryId}` });
        return tags;
      },
    }),

    // Obtener producto por slug
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Product', id: slug }
      ],
    }),

    // Obtener productos destacados
    getFeaturedProducts: builder.query({
      query: (limit = 8) => `/products/featured?limit=${limit}`,
      providesTags: ['Product'],
    }),

    // Obtener productos por subcategoría
    getProductsBySubcategory: builder.query({
      query: ({ subcategorySlug, page = 1, limit = 12, sortBy = 'order', sortOrder = 'ASC' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder
        });
        
        return `/products/subcategory/${subcategorySlug}?${params}`;
      },
      providesTags: ['Product'],
    }),

    // Admin: Crear producto
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: (result, error, { subcategoryId }) => {
        const tags = ['Product'];
        if (subcategoryId) tags.push({ type: 'Product', id: `subcategory-${subcategoryId}` });
        return tags;
      },
    }),

    // Admin: Actualizar producto
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id: id },
        'Product'
      ],
    }),

    // Admin: Subir imagen a producto
    uploadProductImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}/upload-image`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id: id }
      ],
    }),

    // Admin: Eliminar imagen de producto
    deleteProductImage: builder.mutation({
      query: ({ id, imageId }) => ({
        url: `/products/${id}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id: id }
      ],
    }),

    // Admin: Eliminar producto
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetProductsBySubcategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
} = productsApi;
