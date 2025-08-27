import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  SquaresPlusIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CameraIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const AdminNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Showroom',
      path: '/admin/showroom',
      icon: BuildingStorefrontIcon,
      description: 'Categorías, Subcategorías y Productos'
    },
    {
      name: 'Usuarios',
      path: '/admin/users',
      icon: UsersIcon,
    },
    {
      name: 'Proyectos',
      path: '/admin/proyectosEdit',
      icon: CameraIcon,
    },
    {
      name: 'Blog',
      path: '/admin/blog',
      icon: DocumentTextIcon,
    },
    {
      name: 'Suscriptores',
      path: '/admin/subscribers',
      icon: EnvelopeIcon,
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/admin/showroom' && location.pathname === '/admin/categories');
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
