
import { EdicionesPage, Hero, BlogSection, SloganPage } from '../../components/layout/public';
import ProjectSection from '../../components/layout/public/ProjectSection';
import ShowroomSection from '../../components/ShowroomSection';


const HomePage = () => {
  return (
    <div>

    
      <Hero  />
      <SloganPage />
      <EdicionesPage />
      <BlogSection />
      <ProjectSection/>
      <ShowroomSection />

      


      {/* Otras secciones de la página */}
      <section className="py-20 px-4 sm:px-6 lg:px-8"></section>
    </div>
  );
};

export default HomePage;
