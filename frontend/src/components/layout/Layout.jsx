import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, title = 'Dashboard' }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      {/* Agregamos margin-left para evitar superposición con el sidebar fijo */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
        <Header title={title} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;