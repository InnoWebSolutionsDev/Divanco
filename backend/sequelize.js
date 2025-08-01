
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Detect environment
const env = process.env.NODE_ENV || 'development';

// Configuración flexible para local y producción
let sequelize;
if (env === 'production' && process.env.DB_DEPLOY) {
  sequelize = new Sequelize(process.env.DB_DEPLOY, {
    logging: false,
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: false,
    }
  );
}

// Helper para testear conexión
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Helper para sincronizar modelos
export async function syncModels(force = false) {
  try {
    await sequelize.sync({ force });
    console.log('✅ Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
  }
}

export default sequelize;
