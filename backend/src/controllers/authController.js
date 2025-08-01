export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      const err = new Error('Token and new password are required');
      err.status = 400;
      throw err;
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.status = 401;
      throw err;
    }
    const user = await User.findByPk(payload.id);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
import { sendPasswordRecoveryMail } from '../utils/mailer.js';
export const recoverPassword = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      const err = new Error('Username (email) is required');
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    // Generar token simple (en producción usar JWT o UUID)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendPasswordRecoveryMail(username, token);
    res.json({ message: 'Recovery email sent' });
  } catch (error) {
    next(error);
  }
};

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendRegistrationMail } from '../utils/mailer.js';
export const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      const err = new Error('Username and password are required');
      err.status = 400;
      throw err;
    }
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      const err = new Error('User already exists');
      err.status = 409;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Validar rol recibido
    let userRole = 'user';
    if (role && ['admin', 'user'].includes(role)) {
      userRole = role;
    }
    const user = await User.create({ username, password: hashedPassword, role: userRole });

    // Enviar email de confirmación
    try {
      await sendRegistrationMail(user.username);
    } catch (mailError) {
      console.error('Error enviando email de confirmación:', mailError.message);
    }

    res.status(201).json({ message: 'User registered', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
