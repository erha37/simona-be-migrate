const { fn, col } = require('sequelize');
const { SpmKegiatan } = require('../models');

class GroupsController {
  async getGroups(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();
      const bulan = req.query.bulan || '';

      const where = { is_active: '1' };
      if (upt !== '000111') where.upt_id = upt;
      if (tahun) where.tahun_anggaran = tahun;
      if (bulan) where.bulan = bulan;

      const rows = await SpmKegiatan.findAll({
        attributes: [
          'kode_kegiatan', 'nama_kegiatan', 'upt_id',
          'pagu_revisi', 'realisasi_sd_periode', 'sisa_anggaran',
          'bulan', 'tahun_anggaran'
        ],
        where,
        group: [
          'kode_kegiatan', 'nama_kegiatan', 'upt_id',
          'pagu_revisi', 'realisasi_sd_periode', 'sisa_anggaran',
          'bulan', 'tahun_anggaran'
        ],
        order: [['kode_kegiatan', 'ASC']],
        raw: true
      });

      res.json({ status: 'success', data: rows });
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

      const where = { kode_kegiatan, is_active: '1' };
      if (upt !== '000111') where.upt_id = upt;
      if (tahun) where.tahun_anggaran = tahun;
      if (bulan) where.bulan = bulan;

      const row = await SpmKegiatan.findOne({ where, raw: true });

      if (!row) {
        return res.json({ status: 'error', msg: 'Kegiatan tidak ditemukan' });
      }

      res.json({ status: 'success', data: row });
    } catch (err) {
      console.error('Get group detail error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }

  async getGroupSummary(req, res) {
    try {
      const upt = req.user?.upt || '000111';
      const tahun = req.query.tahun || new Date().getFullYear().toString();

      const where = { is_active: '1' };
      if (upt !== '000111') where.upt_id = upt;
      if (tahun) where.tahun_anggaran = tahun;

      const rows = await SpmKegiatan.findAll({
        attributes: [
          'kode_kegiatan',
          'nama_kegiatan',
          [fn('SUM', col('pagu_revisi')), 'total_pagu'],
          [fn('SUM', col('realisasi_sd_periode')), 'total_realisasi'],
          [fn('SUM', col('sisa_anggaran')), 'total_sisa'],
          [fn('COUNT', col('id')), 'jumlah_record']
        ],
        where,
        group: ['kode_kegiatan', 'nama_kegiatan'],
        order: [['kode_kegiatan', 'ASC']],
        raw: true
      });

      // persen_realisasi dihitung di JS (lebih portable daripada raw SQL division)
      const data = rows.map(r => {
        const totalPagu = Number(r.total_pagu) || 0;
        const totalRealisasi = Number(r.total_realisasi) || 0;
        return {
          ...r,
          persen_realisasi: totalPagu > 0
            ? Math.round((totalRealisasi / totalPagu) * 100 * 100) / 100
            : 0
        };
      });

      res.json({ status: 'success', data });
    } catch (err) {
      console.error('Get group summary error:', err);
      res.status(500).json({ status: 'error', msg: err.message });
    }
  }
}

module.exports = new GroupsController();
