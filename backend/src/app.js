import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import morgan from 'morgan';
import routes from './routes/index.js';

// Configurar zona horaria
process.env.TZ = 'America/Bogota';
console.log('🇨🇴 [SERVER] Zona horaria configurada:', process.env.TZ);
console.log('🕐 [SERVER] Hora actual Colombia:', new Date().toLocaleString('es-CO', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}));

dotenv.config();


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files example (uncomment if needed)
// app.use('/images', express.static(path.join(process.cwd(), 'images')));

// Multer config (archivos en /uploads)
const upload = multer({ dest: path.join(process.cwd(), 'uploads/') });
app.use(upload.any());

// CORS configuration
app.use(cors({
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.get('/', (req, res) => {
  res.send('Backend Boilerplate Running');
});

// Ejemplo de endpoint para enviar email
import { sendMail } from './utils/mailer.js';

app.post('/send-email', async (req, res, next) => {
  try {
    const info = await sendMail({
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
      from: req.body.from,
    });
    res.json({ success: true, info });
  } catch (error) {
    next(error);
  }
});

// Ejemplo de endpoint para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});

app.use(routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

import errorHandler from './middlewares/errorHandler.js';

// Error handler
app.use(errorHandler);

export default app;
