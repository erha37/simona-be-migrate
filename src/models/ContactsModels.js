const pool = require('../config/database');

class ContactsModels {
  async getSatker() {
    const query = `SELECT DISTINCT kd_satker, nama_satker FROM tb_satker ORDER BY nama_satker`;
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute(query);
      conn.release();
      return rows;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }

  async getKdSatker(level, user) {
    let query = `
      SELECT DISTINCT nama_upt as upt, bulan, tahun_anggaran, tgl_upload
      FROM tb_spm_kegiatan
      WHERE is_active = '1'
    `;
    const params = [];

    if (level !== '1' && user !== '000111') {
      query += ' AND kd_unit = ?';
      params.push(user);
    }

    query += ' ORDER BY tgl_upload DESC';

    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute(query, params);
      conn.release();
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
       pagu_revisi, realisasi_sd_periode, sisa_anggaran, bulan, tahun_anggaran, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1')
      ON DUPLICATE KEY UPDATE
      pagu_revisi = VALUES(pagu_revisi),
      realisasi_sd_periode = VALUES(realisasi_sd_periode),
      sisa_anggaran = VALUES(sisa_anggaran),
      is_active = '1'
    `;

    try {
      const conn = await pool.getConnection();
      const [result] = await conn.execute(query, [
        data.id_spm_program,
        data.kd_unit,
        data.nama_upt,
        data.kode_kegiatan,
        data.nama_kegiatan,
        data.pagu_revisi,
        data.realisasi_sd_periode,
        data.sisa_anggaran,
        data.bulan,
        data.tahun_anggaran
      ]);
      conn.release();
      return result;
    } catch (err) {
      console.error('Insert error:', err);
      throw err;
    }
  }
}

module.exports = new ContactsModels();
