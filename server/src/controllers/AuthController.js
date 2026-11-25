const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// dotenv sudah di-load sekali di server/app.js (entry point), tidak perlu diulang di sini

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

      // Cari user dari tabel `tb_user` lewat model Sequelize
      const user = await User.findOne({ where: { user: username } });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          msg: 'Username atau password salah'
        });
      }

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
          id: user.id_user,
          username: user.user,
          level: user.level,
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
          id: user.id_user,
          username: user.user,
          level: user.level,
          upt: user.upt
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
