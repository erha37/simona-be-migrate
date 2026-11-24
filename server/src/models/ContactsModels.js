const pool = require('../config/database');

class ContactsModels {
  async getSatker() {
    const query = `SELECT DISTINCT kd_satker, nama_satker FROM tb_satker ORDER BY nama_satker`;
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }

  async getKdSatker(level, user) {
    let query = `
      SELECT DISTINCT nama_upt as upt, bulan, tahun_anggaran, created_at as tgl_upload
      FROM tb_spm_kegiatan
      WHERE is_active = '1'
    `;
    const params = [];

    if (level !== '1' && user !== '000111') {
      query += ' AND kd_unit = ?';
      params.push(user);
    }

    query += ' ORDER BY created_at DESC';

    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }

  async insertKegiatan(data) {
    const query = `
      INSERT INTO tb_spm_kegiatan 
      (id_spm_program, kd_unit, nama_upt, kode_kegiatan, nama_kegiatan, 
       pagu_revisi, realisasi_sd_periode, sisa_anggaran, upt_id, bulan, tahun_anggaran, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')
      ON CONFLICT(kode_kegiatan, upt_id, bulan, tahun_anggaran) DO UPDATE SET
      pagu_revisi = excluded.pagu_revisi,
      realisasi_sd_periode = excluded.realisasi_sd_periode,
      sisa_anggaran = excluded.sisa_anggaran,
      is_active = '1'
    `;

    try {
      const [result] = await pool.execute(query, [
        data.id_spm_program,
        data.kd_unit,
        data.nama_upt,
        data.kode_kegiatan,
        data.nama_kegiatan,
        data.pagu_revisi,
        data.realisasi_sd_periode,
        data.sisa_anggaran,
        data.upt_id || data.kd_unit,
        data.bulan,
        data.tahun_anggaran || data.tahun
      ]);
      return result;
    } catch (err) {
      console.error('Insert error:', err);
      throw err;
    }
  }
}

module.exports = new ContactsModels();
