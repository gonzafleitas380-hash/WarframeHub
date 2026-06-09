import express from 'express';
import pool from '../db.js';

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, contraseña } = req.body;

  try {
    const [rows] = await pool.query(
      'CALL sp_login(?, ?)',
      [username, contraseña]
    );

    const usuario = rows[0][0];

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    res.json({ usuario });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  const { nombre, apellido, username, contraseña } = req.body;

  try {
    await pool.query(
      'CALL sp_registrar_usuario(?, ?, ?, ?)',
      [nombre, apellido, username, contraseña]
    );

    res.json({ ok: true });

  } catch (err) {
    console.error('Error en registro:', err);
    const mensaje = err.message?.includes('ya está en uso')
      ? 'Ese username ya está en uso.'
      : 'Error al registrarse.';
    res.status(400).json({ error: mensaje });
  }
});

export default router;