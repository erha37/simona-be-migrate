const pool = require('../config/database');

class GroupsController {
  async getGroups(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();
      const bulan = req.query.bulan || '';

      let query = `
        SELECT DISTINCT g.kode_kegiatan, g.nama_kegiatan, g.upt_id,
               g.pagu_revisi, g.realisasi_sd_periode, g.sisa_anggaran,
               g.bulan, g.tahun_anggaran
        FROM tb_spm_kegiatan g
        WHERE g.is_active = '1'
      `;
      const params = [];

      if (upt !== '000111') {
        query += ' AND g.upt_id = ?';
        params.push(upt);
      }

      if (tahun) {
        query += ' AND g.tahun_anggaran = ?';
        params.push(tahun);
      }

      if (bulan) {
        query += ' AND g.bulan = ?';
        params.push(bulan);
      }

      query += ' ORDER BY g.kode_kegiatan';

      const [rows] = await pool.execute(query, params);

      res.json({
        status: 'success',
        data: rows
      });
    } catch (err) {
      console.error('Get groups error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getGroupDetail(req, res) {
    try {
      const { kode_kegiatan } = req.params;
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();
      const bulan = req.query.bulan || '';

      let query = `
        SELECT g.*
        FROM tb_spm_kegiatan g
        WHERE g.kode_kegiatan = ? AND g.is_active = '1'
      `;
      const params = [kode_kegiatan];

      if (upt !== '000111') {
        query += ' AND g.upt_id = ?';
        params.push(upt);
      }

      if (tahun) {
        query += ' AND g.tahun_anggaran = ?';
        params.push(tahun);
      }

      if (bulan) {
        query += ' AND g.bulan = ?';
        params.push(bulan);
      }

      const [rows] = await pool.execute(query, params);

      if (rows.length === 0) {
        return res.json({
          status: 'error',
          msg: 'Kegiatan tidak ditemukan'
        });
      }

      res.json({
        status: 'success',
        data: rows[0]
      });
    } catch (err) {
      console.error('Get group detail error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getGroupSummary(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();

      let query = `
        SELECT 
          g.kode_kegiatan,
          g.nama_kegiatan,
          SUM(g.pagu_revisi) as total_pagu,
          SUM(g.realisasi_sd_periode) as total_realisasi,
          SUM(g.sisa_anggaran) as total_sisa,
          COUNT(*) as jumlah_record,
          ROUND((SUM(g.realisasi_sd_periode) / SUM(g.pagu_revisi)) * 100, 2) as persen_realisasi
        FROM tb_spm_kegiatan g
        WHERE g.is_active = '1'
      `;
      const params = [];

      if (upt !== '000111') {
        query += ' AND g.upt_id = ?';
        params.push(upt);
      }

      if (tahun) {
        query += ' AND g.tahun_anggaran = ?';
        params.push(tahun);
      }

      query += ' GROUP BY g.kode_kegiatan, g.nama_kegiatan ORDER BY g.kode_kegiatan';

      const [rows] = await pool.execute(query, params);

      res.json({
        status: 'success',
        data: rows
      });
    } catch (err) {
      console.error('Get group summary error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }
}

module.exports = new GroupsController();