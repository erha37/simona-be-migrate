const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          msg: 'Username dan password required'
        });
      }

      // Query user dari database (contoh: tb_users atau table authentication)
      const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
      const [rows] = await pool.execute(query, [username]);

      if (rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          msg: 'Username atau password salah'
        });
      }

      const user = rows[0];

      // Verify password with bcrypt
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({
          status: 'error',
          msg: 'Username atau password salah'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          level: user.role,
          upt: user.upt
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        msg: 'Login berhasil',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          level: user.role
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async logout(req, res) {
    // JWT stateless, client saja remove token dari localStorage
    res.json({
      status: 'success',
      msg: 'Logout berhasil'
    });
  }

  async getProfile(req, res) {
    try {
      res.json({
        status: 'success',
        user: req.user
      });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }
}

module.exports = new AuthController();
