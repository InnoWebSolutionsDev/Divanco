import { Hero } from "../../components/layout/public";
import { BlogSection } from "../../components/layout/public";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <BlogSection />
      

      {/* Otras secciones de la página */}
      <section className="py-20 px-4 sm:px-6 lg:px-8"></section>
    </div>
  );
};

export default HomePage;
