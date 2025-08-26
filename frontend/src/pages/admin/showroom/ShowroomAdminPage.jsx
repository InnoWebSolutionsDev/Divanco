import { useState } from 'react';
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApi';
import { useGetSubcategoriesQuery } from '../../../features/subcategories/subcategoriesApi';
import { useProducts } from '../../../features/products/useProducts';

import CategoryManagement from './CategoryManagement';
import SubcategoryManagement from './SubcategoryManagement';
import ProductManagement from '../products/ProductManagement';

const ShowroomAdminPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const { data: categoriesData, isLoading: loadingCategories } = useGetCategoriesQuery({ limit: 100 });
  const { data: subcategoriesData, refetch: refetchSubcategories } = useGetSubcategoriesQuery(
    selectedCategory ? { categoryId: selectedCategory.id, limit: 100, active: false } : { limit: 100, active: false }
  );

  const { products, isLoading: loadingProducts, refetch: refetchProducts } = useProducts({
    subcategoryId: selectedSubcategory?.id,
    limit: 20
  });

  // Debug temporal - remover después
  console.log('ShowroomAdminPage - products from useProducts:', products);
  console.log('ShowroomAdminPage - selectedSubcategory:', selectedSubcategory);

  const categories = categoriesData?.data || [];
  const subcategories = subcategoriesData?.data || [];

  const tabs = [
    { id: 'categories', label: 'Categorías', icon: '📁' },
    { id: 'subcategories', label: 'Subcategorías', icon: '📂' },
    { id: 'products', label: 'Productos', icon: '📦' }
  ];

  const getTabCounts = () => {
    return {
      categories: categories.length,
      subcategories: subcategories.length,
      products: products.length
    };
  };

  const counts = getTabCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Administración del Showroom
                </h1>
                <p className="mt-2 text-gray-600">
                  Gestiona categorías, subcategorías y productos de tu showroom
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{counts.categories}</div>
                  <div className="text-sm text-gray-600">Categorías</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{counts.subcategories}</div>
                  <div className="text-sm text-gray-600">Subcategorías</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{counts.products}</div>
                  <div className="text-sm text-gray-600">Productos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {counts[tab.id]}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setActiveTab('categories');
              }}
              className="hover:text-gray-900 transition-colors"
            >
              Categorías
            </button>
            
            {selectedCategory && (
              <>
                <span>→</span>
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setActiveTab('subcategories');
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  {selectedCategory.name}
                </button>
              </>
            )}
            
            {selectedSubcategory && (
              <>
                <span>→</span>
                <button
                  onClick={() => setActiveTab('products')}
                  className="hover:text-gray-900 transition-colors"
                >
                  {selectedSubcategory.name}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'categories' && (
          <CategoryManagement
            categories={categories}
            isLoading={loadingCategories}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setActiveTab('subcategories');
            }}
          />
        )}

        {activeTab === 'subcategories' && (
          <SubcategoryManagement
            category={selectedCategory}
            subcategories={subcategories}
            onSelectSubcategory={(subcategory) => {
              setSelectedSubcategory(subcategory);
              setActiveTab('products');
            }}
            onBackToCategories={() => {
              setSelectedCategory(null);
              setActiveTab('categories');
            }}
            onRefresh={refetchSubcategories}
          />
        )}

        {activeTab === 'products' && (
          <ProductManagement
            subcategory={selectedSubcategory}
            products={products}
            isLoading={loadingProducts}
            onRefresh={refetchProducts}
            onBackToSubcategories={() => {
              setSelectedSubcategory(null);
              setActiveTab('subcategories');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShowroomAdminPage;
