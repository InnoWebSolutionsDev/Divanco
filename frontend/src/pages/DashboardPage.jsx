import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Eliminado: Botón temporal de logout */}
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              ¡Bienvenido, {user?.username}!
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Tu rol actual es: <span className="font-semibold capitalize">{user?.role}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Estado del Sistema
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Activo
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Solo para admin */}
          {isAdmin && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Panel de Admin
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Disponible
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 3 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">⚙️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Configuración
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Personalizable
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información del Boilerplate
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Este es tu boilerplate personalizado con React, Redux Toolkit y Tailwind CSS.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Frontend</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  React + Redux Toolkit + Tailwind CSS
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Redux Toolkit con RTK Query
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estilo</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Tailwind CSS con componentes reutilizables
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Autenticación</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  JWT con roles de usuario
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;