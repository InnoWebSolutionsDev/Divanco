
import { EdicionesPage, Hero,  SloganPage } from '../../components/layout/public';
import ProjectSection from '../../components/SectionHomePage/ProjectSection';
import ShowroomSection from '../../components/SectionHomePage/ShowroomSection';
import BlogSectionNew from '../../components/SectionHomePage/BlogSectionNew';

const HomePage = () => {
  return (
    <div>
      <Hero  />
      <SloganPage />
      <ProjectSection />
      <BlogSectionNew />
      <ShowroomSection />
      <EdicionesPage />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8"></section>
    </div>
  );
};

export default HomePage;
