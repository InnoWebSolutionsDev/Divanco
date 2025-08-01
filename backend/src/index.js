
import sequelize from '../sequelize.js';
import app from './app.js';

const PORT = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';
const syncOptions = env === 'development' ? { alter: true } : {};

sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
