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
      transformResponse: (response) => {
        console.log('🔄 API transformResponse - Raw response:', response);
        console.log('🔄 API transformResponse - response.data:', response.data);
        console.log('🔄 API transformResponse - response.data.product:', response.data?.product);
        const product = response.data?.product || null;
        console.log('🔄 API transformResponse - Final product:', product);
        return product;
      },
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
      // Temporal: Deshabilitar cache para debug
      keepUnusedDataFor: 0,
    }),

    // Obtener productos destacados
    getFeaturedProducts: builder.query({
      query: (limit = 8) => `/products/featured?limit=${limit}`,
      transformResponse: (response) => {
        console.log('🌟 Featured Products Response:', response);
        // El backend devuelve { success: true, data: { products: [...] } }
        return response.data?.products || [];
      },
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
      transformResponse: (response) => {
        console.log('📂 Products by Subcategory Response:', response);
        // El backend devuelve { success: true, data: { subcategory: {...}, products: [...], pagination: {...} } }
        return {
          products: response.data?.products || [],
          subcategory: response.data?.subcategory || null,
          total: response.data?.pagination?.totalItems || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
          currentPage: response.data?.pagination?.currentPage || 1,
        };
      },
      providesTags: (result, error, { subcategorySlug }) => [
        { type: 'Product', id: `subcategory-${subcategorySlug}` }
      ],
    }),

    // Obtener productos por categoría
    getProductsByCategory: builder.query({
      query: ({ categorySlug, page = 1, limit = 12, sortBy = 'order', sortOrder = 'ASC' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder
        });
        
        return `/products/category/${categorySlug}?${params}`;
      },
      transformResponse: (response) => {
        console.log('📁 Products by Category Response:', response);
        // El backend devuelve { success: true, data: { category: {...}, products: [...], pagination: {...} } }
        return {
          products: response.data?.products || [],
          category: response.data?.category || null,
          total: response.data?.pagination?.totalItems || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
          currentPage: response.data?.pagination?.currentPage || 1,
        };
      },
      providesTags: (result, error, { categorySlug }) => [
        { type: 'Product', id: `category-${categorySlug}` }
      ],
    }),

    // Crear producto
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),

    // Actualizar producto
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product'
      ],
    }),

    // Eliminar producto
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Subir imagen de producto
    uploadProductImage: builder.mutation({
      query: ({ productId, imageFile }) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        return {
          url: `/products/${productId}/upload-image`,
          method: 'POST',
          body: formData,
          // No establecer Content-Type - el navegador lo hará automáticamente para FormData
        };
      },
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Product'
      ],
    }),

    // Eliminar imagen de producto
    deleteProductImage: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/products/${productId}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Product'
      ],
    }),
  }),
});

// Export hooks para usar en componentes
export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetProductsBySubcategoryQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
} = productsApi;
