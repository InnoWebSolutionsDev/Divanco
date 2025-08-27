import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../shared/ScrollToTop';
import WhatsApp from '../../ui/WhatsApp';
import LoadingBoundary, { LoadingSpinner } from '../../common/LoadingBoundary';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Header />
      
      <main className="flex-1">
        <LoadingBoundary 
          loadingMessage="Cargando página..."
          fallback={<LoadingSpinner message="Cargando..." />}
        >
          <Suspense fallback={<LoadingSpinner message="Cargando contenido..." />}>
            <Outlet />
          </Suspense>
        </LoadingBoundary>
      </main>
      
      <Footer />
      
      {/* WhatsApp flotante */}
      <WhatsApp 
        phoneNumber="5491134567890" // Tu número de WhatsApp
        message="Hablemos"
      />
    </div>
  );
};

export default PublicLayout;