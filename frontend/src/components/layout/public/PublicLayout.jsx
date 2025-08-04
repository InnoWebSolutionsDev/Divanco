import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './Header'; // ✅ Ahora existe
import Footer from './Footer'; // ✅ Ahora existe
import { LoadingSpinner } from '../shared/LoadingBoundary'; // ✅ Ya verificado
import ScrollToTop from '../shared/ScrollToTop'; // ✅ Ya existe

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;