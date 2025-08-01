import express from 'express';
import multer from 'multer';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogPostImage,
  getFeaturedBlogPosts,
  getRecentBlogPosts
} from '../controllers/blogController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Configuración de multer para subida de archivos
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes para el blog
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Rutas públicas
router.get('/', getAllBlogPosts);
router.get('/featured', getFeaturedBlogPosts);
router.get('/recent', getRecentBlogPosts);
router.get('/:slug', getBlogPostBySlug);

// Rutas protegidas (solo autores y admins pueden crear/editar)
router.post('/', authenticateToken, requireRole(['admin', 'author']), createBlogPost);
router.put('/:id', authenticateToken, requireRole(['admin', 'author']), updateBlogPost);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteBlogPost);
router.post('/:id/upload-image', 
  authenticateToken, 
  requireRole(['admin', 'author']), 
  upload.single('image'), 
  uploadBlogPostImage
);

export default router;
