import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, text, html, from }) {
  return transporter.sendMail({
    from: from || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

export async function sendRegistrationMail(to) {
  return sendMail({
    to,
    subject: 'Registro exitoso',
    text: '¡Bienvenido! Tu registro fue exitoso.',
  });
}

export async function sendPasswordRecoveryMail(to, token) {
  const recoveryUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  return sendMail({
    to,
    subject: 'Recuperación de contraseña',
    text: `Para recuperar tu contraseña, haz clic en el siguiente enlace: ${recoveryUrl}`,
    html: `<p>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p><a href="${recoveryUrl}">${recoveryUrl}</a>`
  });
}

export default transporter;
