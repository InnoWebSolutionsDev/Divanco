import React from 'react';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi';

const ShowroomSection = () => {
  const { data, isLoading } = useGetCategoriesQuery({ includeSubcategories: true, activeOnly: true });

  // Debug: loguear imágenes de subcategorías
  React.useEffect(() => {
    if (data?.data) {
      data.data.forEach(category => {
        category.subcategories?.forEach(subcat => {
          console.log(`Subcat: ${subcat.name}, featuredImage:`, subcat.featuredImage, 'images:', subcat.images);
        });
      });
    }
  }, [data]);

  if (isLoading) return <div className="text-center py-8 text-gray-400">Cargando showroom...</div>;

  return (
    <section className="py-10 px-2 md:px-0 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-naranjaDivanco tracking-widest uppercase text-center">Showroom</h2>
      <div className="space-y-10">
        {data?.data?.map(category => (
          <div key={category.id}>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wide border-l-4 border-naranjaDivanco pl-2">{category.name}</h3>
            <div className="flex flex-wrap gap-4">
              {category.subcategories?.map(subcat => (
                <div key={subcat.id} className="w-64 bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center border border-gray-100">
                  {subcat.featuredImage && (
                    <img
                      src={subcat.featuredImage.url || subcat.featuredImage[0]?.url}
                      alt={subcat.name}
                      className="w-full h-32 object-cover rounded mb-2 bg-gray-100"
                    />
                  )}
                  <div className="font-bold text-naranjaDivanco text-center mb-1 text-sm">{subcat.name}</div>
                  <div className="text-xs text-gray-600 text-center line-clamp-3 min-h-[2.5em]">{subcat.content || subcat.description}</div>
                </div>
              ))}
              {(!category.subcategories || category.subcategories.length === 0) && (
                <div className="text-xs text-gray-400 italic">No hay subcategorías para esta categoría.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowroomSection;
