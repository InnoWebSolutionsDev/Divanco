import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../hooks";
import logoCompleto from "../../../assets/images/DIVANCO HV3.PNG";
import { useGetRecentProjectsQuery } from "../../../features/projects/projectsApi";
import { useGetRecentBlogPostsQuery } from "../../../features/blog/blogApi";
import { useGetCategoriesQuery } from "../../../features/categories/categoriesApi";
import { useGetSubcategoriesByCategoryQuery } from "../../../features/subcategories/subcategoriesApi";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // 'proyectos' | 'blog' | null

  // Consultar últimos 5 proyectos y posts
  const { data: recentProjects } = useGetRecentProjectsQuery(5);
  const { data: recentBlogPosts } = useGetRecentBlogPostsQuery(5);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navegación completa
  const navigation = [
    { name: "Showrooms", href: "/showrooms" },
    { name: "About", href: "/about" },
    { name: "Proyectos", href: "/proyectos" },
    { name: "Ediciones", href: "/ediciones" },
    { name: "Blog", href: "/blog" },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Detectar si estamos en la homepage
  const isHomepage = location.pathname === "/";

  // Detectar scroll en homepage
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100);
    };

    if (isHomepage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrolled(false);
    }
  }, [isHomepage]);

  // Función para manejar el triple click en el logo
  const handleLogoClick = (e) => {
    e.preventDefault();
    setClickCount((prev) => prev + 1);

    setTimeout(() => {
      setClickCount(0);
    }, 2000);

    if (clickCount === 2) {
      navigate("/login");
      setClickCount(0);
    }
  };

  // Lógica para el fondo del header
  const getHeaderBackground = () => {
    if (!isHomepage) {
      return "bg-gray-800/60 backdrop-blur-md shadow-lg border-b border-white/10 py-8";
    } else {
      return scrolled
        ? "bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-white/10"
        : "bg-transparent";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderBackground()}`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            isHomepage ? "h-16 py-4" : "h-14 py-3"
          }`}
        >
          {/* Logo Completo - Siempre visible */}
          <div className="flex items-center">
            <Link
              to="/"
              className="group relative z-10"
              onClick={handleLogoClick}
            >
              {/* Logo Completo (Logo + Texto DIVANCO) */}
              <img
                src={logoCompleto}
                alt="Divanco"
                className="h-32 md:h-24 lg:h-32 xl:h-60 w-auto transition-all duration-300 group-hover:opacity-80"
              />
            </Link>
          </div>

          {/* Menú Hamburguesa - Siempre visible */}
          <button
            className="p-2 transition-all duration-300 hover:scale-110 text-white/90 hover:text-white z-20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navegación Desplegable (Desktop y Mobile) */}
        {mobileMenuOpen && (
          <>
            {/* Overlay oscuro detrás del menú */}
            <div
              className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MinimalMobileMenu
              navigation={navigation}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
              setMobileMenuOpen={setMobileMenuOpen}
              isActive={isActive}
              isAuthenticated={isAuthenticated}
              user={user}
              zIndex={1200}
            />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

const MinimalMobileMenu = ({
  navigation,
  openSubmenu,
  setOpenSubmenu,
  setMobileMenuOpen,
  isActive,
  isAuthenticated,
  user,
  zIndex = 50,
}) => {
  const { data: categoriesData } = useGetCategoriesQuery({
    limit: 50,
    page: 1,
    active: true,
  });
  const [openCat, setOpenCat] = useState(null);
  const { data: recentProjects } = useGetRecentProjectsQuery(5);
  const { data: recentBlogPosts } = useGetRecentBlogPostsQuery(5);

  React.useEffect(() => {
    console.log("categoriesData:", categoriesData);
  }, [categoriesData]);

  return (
    <div
      className="fixed top-0 right-0 h-full w-4/5 max-w-xs px-6 pt-8 pb-8 space-y-4 backdrop-blur-lg shadow-2xl animate-fade-in border-l border-white/10"
      style={{ backgroundColor: "rgba(0,0,0,0.98)", zIndex }}
    >
      {/* Botón X para cerrar menú */}
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-naranjaDivanco transition-all z-50 p-2 rounded-full bg-black/30 backdrop-blur-md"
        style={{ fontSize: 28, lineHeight: 1 }}
        aria-label="Cerrar menú"
        onClick={() => setMobileMenuOpen(false)}
      >
        <XMarkIcon className="h-8 w-8" />
      </button>
      {navigation.map((item) => {
        // SHOWROOMS: anidado
        if (item.name === "Showrooms") {
          return (
            <div key={item.name} className="">
              <button
                className={`flex items-center w-full text-left text-base font-light tracking-widest uppercase py-3 px-2 rounded transition-all duration-200 group ${
                  openSubmenu === "showrooms"
                    ? "text-naranjaDivanco bg-white/5"
                    : "text-white/80 hover:text-naranjaDivanco"
                }`}
                onClick={() =>
                  setOpenSubmenu(
                    openSubmenu === "showrooms" ? null : "showrooms"
                  )
                }
              >
                {item.name}
                <span className="ml-auto">
                  {openSubmenu === "showrooms" ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </span>
              </button>
              {openSubmenu === "showrooms" && (
                <div className="pl-2 border-l border-white/10 mt-1 space-y-1 animate-fade-in">
                  {(categoriesData?.data || []).map((cat) => (
                    <div key={cat.slug}>
                      <button
                        className={`flex items-center w-full text-left text-sm font-medium py-2 px-2 rounded transition-all duration-200 group ${
                          openCat === cat.slug
                            ? "text-naranjaDivanco bg-white/5"
                            : "text-white/70 hover:text-naranjaDivanco"
                        }`}
                        onClick={() =>
                          setOpenCat(openCat === cat.slug ? null : cat.slug)
                        }
                      >
                        {cat.name}
                        <span className="ml-auto">
                          {openCat === cat.slug ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                      {openCat === cat.slug && (
                        <ShowroomSubcategories
                          categorySlug={cat.slug}
                          setMobileMenuOpen={setMobileMenuOpen}
                        />
                      )}
                    </div>
                  ))}
                  {(!categoriesData?.data ||
                    categoriesData.data.length === 0) && (
                    <span className="block text-xs text-white/40">
                      No hay categorías
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }
        // PROYECTOS: lista de proyectos recientes
        if (item.name === "Proyectos") {
          return (
            <div key={item.name}>
              <button
                className={`flex items-center w-full text-left text-base font-light tracking-widest uppercase py-3 px-2 rounded transition-all duration-200 group ${
                  openSubmenu === "proyectos"
                    ? "text-naranjaDivanco bg-white/5"
                    : "text-white/80 hover:text-naranjaDivanco"
                }`}
                onClick={() =>
                  setOpenSubmenu(
                    openSubmenu === "proyectos" ? null : "proyectos"
                  )
                }
              >
                {item.name}
                <span className="ml-auto">
                  {openSubmenu === "proyectos" ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </span>
              </button>
              {openSubmenu === "proyectos" && (
                <div className="pl-2 border-l border-white/10 mt-1 space-y-1 animate-fade-in">
                  {(recentProjects?.data || []).slice(0, 5).map((project) => (
                    <Link
                      key={project.slug || project.id}
                      to={`/proyectos/${project.slug || project.id}`}
                      className="block text-sm text-white/70 hover:text-naranjaDivanco py-2 px-2 rounded transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {project.title || project.name}
                    </Link>
                  ))}
                  {(!recentProjects?.data ||
                    recentProjects.data.length === 0) && (
                    <span className="block text-xs text-white/40">
                      No hay proyectos recientes
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }
        // BLOG: lista de posts recientes
        if (item.name === "Blog") {
          return (
            <div key={item.name}>
              <button
                className={`flex items-center w-full text-left text-base font-light tracking-widest uppercase py-3 px-2 rounded transition-all duration-200 group ${
                  openSubmenu === "blog"
                    ? "text-naranjaDivanco bg-white/5"
                    : "text-white/80 hover:text-naranjaDivanco"
                }`}
                onClick={() =>
                  setOpenSubmenu(openSubmenu === "blog" ? null : "blog")
                }
              >
                {item.name}
                <span className="ml-auto">
                  {openSubmenu === "blog" ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </span>
              </button>
              {openSubmenu === "blog" && (
                <div className="pl-2 border-l border-white/10 mt-1 space-y-1 animate-fade-in">
                  {(recentBlogPosts?.data || []).slice(0, 5).map((post) => (
                    <Link
                      key={post.slug || post.id}
                      to={`/blog/${post.slug || post.id}`}
                      className="block text-sm text-white/70 hover:text-naranjaDivanco py-2 px-2 rounded transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {post.title}
                    </Link>
                  ))}
                  {(!recentBlogPosts?.data ||
                    recentBlogPosts.data.length === 0) && (
                    <span className="block text-xs text-white/40">
                      No hay posts recientes
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }
        // Otros ítems: desplegables simples
        return (
          <div key={item.name}>
            <button
              className={`flex items-center w-full text-left text-base font-light tracking-widest uppercase py-3 px-2 rounded transition-all duration-200 group ${
                openSubmenu === item.name.toLowerCase()
                  ? "text-naranjaDivanco bg-white/5"
                  : "text-white/80 hover:text-naranjaDivanco"
              }`}
              onClick={() =>
                setOpenSubmenu(
                  openSubmenu === item.name.toLowerCase()
                    ? null
                    : item.name.toLowerCase()
                )
              }
            >
              {item.name}
              <span className="ml-auto">
                {openSubmenu === item.name.toLowerCase() ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </span>
            </button>
            {openSubmenu === item.name.toLowerCase() && (
              <div className="pl-2 border-l border-white/10 mt-1 space-y-1 animate-fade-in">
                <Link
                  to={item.href}
                  className="block text-sm text-white/70 hover:text-naranjaDivanco py-2 px-2 rounded transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ir a {item.name}
                </Link>
              </div>
            )}
          </div>
        );
      })}
      {/* Buscar y perfil */}
      <Link
        to="/buscar"
        className="flex items-center space-x-2 text-base font-light uppercase tracking-widest text-white/80 hover:text-naranjaDivanco py-3 px-2 rounded transition-all duration-200"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Buscar</span>
      </Link>
      {isAuthenticated && (
        <Link
          to="/profile"
          className="block text-base font-light uppercase tracking-widest text-white/80 hover:text-naranjaDivanco py-3 px-2 rounded transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          {user?.name || "Profile"}
        </Link>
      )}
    </div>
  );
};

function ShowroomSubcategories({ categorySlug, setMobileMenuOpen }) {
  const { data: subcatData } = useGetSubcategoriesByCategoryQuery({
    categorySlug,
    limit: 20,
    page: 1,
  });
  if (!subcatData?.data) return null;
  const { category, subcategories } = subcatData.data;
  // Debug: loguear el content de cada subcategoría
  if (subcategories && subcategories.length > 0) {
    subcategories.forEach((subcat) => {
      console.log(`Subcat: ${subcat.name}, content:`, subcat.content);
    });
  }
  return (
    <div className="ml-3 border-l border-white/5">
      {/* Enlace a la categoría completa */}
      <Link
        to={`/showroom/${categorySlug}`}
        className="block text-xs text-white/60 hover:text-naranjaDivanco py-1 px-2 rounded transition-all duration-200 font-medium"
        onClick={() => setMobileMenuOpen(false)}
      >
        Ver todos los productos de {category?.name}
      </Link>
      
      {/* Subcategorías */}
      {subcategories && subcategories.length > 0
        ? subcategories.map((subcat) => (
            <div key={subcat.slug}>
              <Link
                to={`/showroom/${categorySlug}/${subcat.slug}`}
                className="block text-xs text-white/60 hover:text-naranjaDivanco py-1 px-2 rounded transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {subcat.name}
              </Link>
              {subcat.content && (
                <div className="ml-2 text-[10px] text-white/40 py-0.5 px-2">
                  {subcat.content}
                </div>
              )}
            </div>
          ))
        : category?.content && (
            <div className="ml-2 text-xs text-white/40 py-1 px-2">
              {category.content}
            </div>
          )}
    </div>
  );
}
