import express from 'express';
import multer from 'multer';
import {
  getAllProjects,
  getProjectsByYear,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  getFeaturedProjects
} from '../controllers/projectController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Configuración de multer para subida de archivos
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB máximo (para imágenes de proyectos)
  },
  fileFilter: (req, file, cb) => {
    // Aceptar imágenes y algunos documentos
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf' // Para planos o documentos técnicos
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Rutas públicas
router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/year/:year', getProjectsByYear);
router.get('/:slug', getProjectBySlug);

// Rutas protegidas
router.post('/', authenticateToken, requireRole(['admin']), createProject);
router.put('/:id', authenticateToken, requireRole(['admin']), updateProject);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteProject);
router.post('/:id/upload-image', 
  authenticateToken, 
  requireRole(['admin']), 
  upload.single('image'), 
  uploadProjectImage
);

export default router;
