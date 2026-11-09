const pool = require('../config/database');

class HomeModels {
  async chartPagu(upt, tahun) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = { pagu: [], realisasi: [], sisa: [] };

    for (const month of months) {
      let query = `
        SELECT 
          CAST(SUM(pagu_revisi)/1000000000 AS DECIMAL(20,2)) as pagu,
          CAST(SUM(realisasi_sd_periode)/1000000000 AS DECIMAL(20,2)) as realisasi,
          CAST(SUM(sisa_anggaran)/1000000000 AS DECIMAL(20,2)) as sisa
        FROM tb_spm_program
        WHERE tahun_anggaran = ? AND is_active = '1' AND bulan = ?
      `;
      const params = [tahun, month];

      if (upt !== '000111') {
        query += ' AND kd_unit = ?';
        params.push(upt);
      }

      try {
        const conn = await pool.getConnection();
        const [rows] = await conn.execute(query, params);
        conn.release();

        const result = rows[0];
        data.pagu.push(result ? parseFloat(result.pagu) : 0);
        data.realisasi.push(result ? parseFloat(result.realisasi) : 0);
        data.sisa.push(result ? parseFloat(result.sisa) : 0);
      } catch (err) {
        console.error('Query error:', err);
        data.pagu.push(0);
        data.realisasi.push(0);
        data.sisa.push(0);
      }
    }
    return data;
  }

  async chartRealisasi(upt, tahun) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = { persen: [] };

    let query = `
      SELECT ROUND((SUM(realisasi_sd_periode)/SUM(pagu_revisi))*100, 2) as persen, bulan
      FROM tb_spm_program
      WHERE tahun_anggaran = ? AND is_active = '1'
    `;
    const params = [tahun];

    if (upt !== '000111') {
      query += ' AND kd_unit = ?';
      params.push(upt);
    }

    query += ' GROUP BY tahun_anggaran, bulan ORDER BY CAST(bulan AS UNSIGNED) ASC';

    try {
      const conn = await pool.getConnection();
      const [results] = await conn.execute(query, params);
      conn.release();

      // Initialize all months with 0
      months.forEach(() => data.persen.push(0));

      // Fill in actual percentages
      results.forEach(row => {
        const monthIndex = parseInt(row.bulan) - 1;
        data.persen[monthIndex] = parseFloat(row.persen);
      });
    } catch (err) {
      console.error('Query error:', err);
      months.forEach(() => data.persen.push(0));
    }
    return data;
  }
}

module.exports = new HomeModels();
