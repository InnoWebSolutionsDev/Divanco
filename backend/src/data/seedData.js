const { Category, Subcategory, Product } = require('../data/models');

const seedData = {
  categories: [
    {
      name: 'Amoblamientos',
      description: 'Muebles y elementos de amoblamiento para espacios residenciales y comerciales',
      isActive: true,
      subcategories: [
        {
          name: 'Muebles de Sala',
          description: 'Sofás, sillones, mesas de centro y complementos para sala de estar'
        },
        {
          name: 'Muebles de Dormitorio',
          description: 'Camas, armarios, cómodas y mesas de noche para dormitorios'
        },
        {
          name: 'Muebles de Comedor',
          description: 'Mesas, sillas, buffets y vitrinas para espacios de comedor'
        }
      ]
    },
    {
      name: 'Accesorios',
      description: 'Elementos decorativos y funcionales para complementar espacios',
      isActive: true,
      subcategories: [
        {
          name: 'Iluminación',
          description: 'Lámparas, luminarias y sistemas de iluminación decorativa'
        },
        {
          name: 'Textiles',
          description: 'Cortinas, cojines, alfombras y elementos textiles decorativos'
        },
        {
          name: 'Decoración',
          description: 'Cuadros, espejos, jarrones y objetos decorativos'
        }
      ]
    },
    {
      name: 'Materiales',
      description: 'Materiales de construcción y acabados para proyectos arquitectónicos',
      isActive: true,
      subcategories: [
        {
          name: 'Revestimientos',
          description: 'Cerámicas, porcelanatos, piedras y materiales de revestimiento'
        },
        {
          name: 'Pisos',
          description: 'Maderas, laminados, vinilos y materiales para pisos'
        },
        {
          name: 'Pinturas',
          description: 'Pinturas, barnices, esmaltes y productos de acabado'
        }
      ]
    },
    {
      name: 'Herramientas',
      description: 'Herramientas y equipos para construcción y carpintería',
      isActive: true,
      subcategories: [
        {
          name: 'Herramientas Manuales',
          description: 'Martillos, destornilladores, llaves y herramientas básicas'
        },
        {
          name: 'Herramientas Eléctricas',
          description: 'Taladros, sierras, lijadoras y herramientas con motor'
        },
        {
          name: 'Equipos de Medición',
          description: 'Niveles, metros, escuadras y instrumentos de precisión'
        }
      ]
    }
  ],

  products: {
    'Amoblamientos': [
      { name: 'Sofá Modular Esquinero', description: 'Sofá esquinero modular de 3 piezas en tela beige', price: 2890000, stock: 5 },
      { name: 'Mesa de Centro Moderna', description: 'Mesa de centro en vidrio templado con base metálica', price: 650000, stock: 8 },
      { name: 'Cama Queen Size', description: 'Cama queen size con cabecero tapizado en cuero sintético', price: 1850000, stock: 3 },
      { name: 'Armario 6 Puertas', description: 'Armario de 6 puertas en melamina blanca con espejos', price: 3200000, stock: 2 },
      { name: 'Mesa Comedor Extensible', description: 'Mesa de comedor extensible para 6-8 personas en madera roble', price: 2100000, stock: 4 },
      { name: 'Sillón Reclinable', description: 'Sillón reclinable individual con masajeador incorporado', price: 1450000, stock: 6 },
      { name: 'Cómoda 5 Cajones', description: 'Cómoda de 5 cajones en madera natural con tiradores metálicos', price: 980000, stock: 7 },
      { name: 'Buffet Moderno', description: 'Buffet moderno de 4 puertas con compartimientos internos', price: 1680000, stock: 3 },
      { name: 'Mesa de Noche Flotante', description: 'Mesa de noche flotante con cajón y luz LED incorporada', price: 420000, stock: 12 },
      { name: 'Sillas Comedor Set x4', description: 'Set de 4 sillas para comedor con respaldo ergonómico', price: 890000, stock: 9 }
    ],
    'Accesorios': [
      { name: 'Lámpara Colgante Industrial', description: 'Lámpara colgante estilo industrial con acabado en cobre', price: 320000, stock: 15 },
      { name: 'Cortinas Blackout', description: 'Cortinas blackout térmicas con sistema de rieles incluido', price: 180000, stock: 25 },
      { name: 'Alfombra Persa 2x3m', description: 'Alfombra persa tradicional de 2x3 metros en tonos cálidos', price: 850000, stock: 4 },
      { name: 'Espejo Decorativo Redondo', description: 'Espejo decorativo redondo de 80cm con marco dorado', price: 290000, stock: 8 },
      { name: 'Cojines Decorativos Set x3', description: 'Set de 3 cojines decorativos en diferentes texturas', price: 120000, stock: 20 },
      { name: 'Lámpara de Mesa LED', description: 'Lámpara de mesa LED regulable con carga inalámbrica', price: 195000, stock: 12 },
      { name: 'Cuadro Canvas Abstracto', description: 'Cuadro en canvas de arte abstracto moderno 120x80cm', price: 380000, stock: 6 },
      { name: 'Jarrón Cerámico Grande', description: 'Jarrón decorativo en cerámica artesanal de 45cm de altura', price: 240000, stock: 10 },
      { name: 'Apliques de Pared LED', description: 'Par de apliques de pared LED con luz cálida regulable', price: 160000, stock: 18 },
      { name: 'Tapete de Entrada', description: 'Tapete de entrada antideslizante con diseño personalizado', price: 85000, stock: 30 }
    ],
    'Materiales': [
      { name: 'Porcelanato Rectificado 60x60', description: 'Porcelanato rectificado imitación mármol 60x60cm', price: 45000, stock: 150 },
      { name: 'Pintura Latex Interior', description: 'Pintura latex lavable para interiores, galón de 4 litros', price: 89000, stock: 80 },
      { name: 'Piso Laminado AC4', description: 'Piso laminado resistencia AC4 imitación roble, caja x 2.5m²', price: 95000, stock: 60 },
      { name: 'Cerámica Pared Subway', description: 'Cerámica tipo subway blanca brillante 7.5x15cm', price: 32000, stock: 200 },
      { name: 'Piedra Natural Pizarra', description: 'Piedra natural pizarra negra para revestimiento 40x40cm', price: 68000, stock: 75 },
      { name: 'Barniz Poliuretano', description: 'Barniz poliuretano transparente para madera, galón', price: 125000, stock: 35 },
      { name: 'Vinilo Adhesivo Decorativo', description: 'Vinilo adhesivo decorativo imitación madera por m²', price: 28000, stock: 120 },
      { name: 'Esmalte Sintético', description: 'Esmalte sintético brillante para metal y madera, galón', price: 78000, stock: 45 },
      { name: 'Guardaescoba PVC', description: 'Guardaescoba en PVC flexible blanco, pieza de 2.5m', price: 18000, stock: 90 },
      { name: 'Adhesivo Cerámico', description: 'Adhesivo para cerámica y porcelanato, saco de 25kg', price: 42000, stock: 100 }
    ],
    'Herramientas': [
      { name: 'Taladro Percutor 800W', description: 'Taladro percutor de 800W con maletin y accesorios', price: 380000, stock: 12 },
      { name: 'Martillo Carpintero 16oz', description: 'Martillo de carpintero 16oz con mango de fibra de vidrio', price: 45000, stock: 25 },
      { name: 'Sierra Circular 7¼"', description: 'Sierra circular de 7¼" con guía láser y disco incluido', price: 420000, stock: 8 },
      { name: 'Nivel Laser Autonivelante', description: 'Nivel láser autonivelante con proyección cruzada', price: 680000, stock: 6 },
      { name: 'Juego Destornilladores 12pz', description: 'Juego de 12 destornilladores con puntas magnéticas', price: 85000, stock: 20 },
      { name: 'Lijadora Orbital 280W', description: 'Lijadora orbital de 280W con sistema de aspiración', price: 290000, stock: 10 },
      { name: 'Metro Láser Digital 40m', description: 'Metro láser digital con alcance de 40 metros', price: 320000, stock: 15 },
      { name: 'Escuadra Magnética', description: 'Escuadra magnética ajustable para soldadura y carpintería', price: 75000, stock: 18 },
      { name: 'Caladora Variable 650W', description: 'Caladora con velocidad variable y guía de corte', price: 350000, stock: 9 },
      { name: 'Llave Inglesa Ajustable 12"', description: 'Llave inglesa ajustable de 12" con apertura máxima 32mm', price: 52000, stock: 22 }
    ]
  }
};

module.exports = seedData;
