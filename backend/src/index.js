
import sequelize from './data/config/sequelize.js';  // ✅ Agregada extensión .js
import { syncAllModels } from './data/models/index.js';
import app from './app.js';

const PORT = process.env.PORT || 3002;
const env = process.env.NODE_ENV || 'development';

// Función para inicializar la aplicación
async function initializeApp() {
  try {
    console.log('🔄 Iniciando sincronización de base de datos...');
    
    // Sincronizar modelos en orden correcto
    const force = env === 'development';
    await syncAllModels(force);
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📍 Entorno: ${env}`);
      console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Error inicializando la aplicación:', error.message);
    process.exit(1);
  }
}

// Inicializar la aplicación
initializeApp();