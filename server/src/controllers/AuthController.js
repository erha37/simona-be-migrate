const pool = require('../config/database');
const jwt = require('jsonwebtoken');

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
      const query = `SELECT * FROM tb_users WHERE username = ? LIMIT 1`;
      const conn = await pool.getConnection();
      const [rows] = await conn.execute(query, [username]);
      conn.release();

      if (rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          msg: 'Username atau password salah'
        });
      }

      const user = rows[0];

      // Verify password (seharusnya use bcrypt, ini placeholder)
      if (user.password !== password) {
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
          level: user.level,
          upt: user.kd_unit
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
          level: user.level
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
