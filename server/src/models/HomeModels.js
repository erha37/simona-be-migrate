const { fn, col } = require('sequelize');
const { SpmKegiatan } = require('./index');

class HomeModels {
  async chartPagu(upt, tahun) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = { pagu: [], realisasi: [], sisa: [] };

    for (const month of months) {
      const where = {
        tahun_anggaran: tahun,
        is_active: '1',
        bulan: String(month)
      };
      if (upt !== '000111') {
        where.upt_id = upt;
      }

      try {
        const result = await SpmKegiatan.findOne({
          attributes: [
            [fn('SUM', col('pagu_revisi')), 'pagu'],
            [fn('SUM', col('realisasi_sd_periode')), 'realisasi'],
            [fn('SUM', col('sisa_anggaran')), 'sisa']
          ],
          where,
          raw: true
        });

        data.pagu.push(result?.pagu ? Number((result.pagu / 1_000_000_000).toFixed(2)) : 0);
        data.realisasi.push(result?.realisasi ? Number((result.realisasi / 1_000_000_000).toFixed(2)) : 0);
        data.sisa.push(result?.sisa ? Number((result.sisa / 1_000_000_000).toFixed(2)) : 0);
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
    months.forEach(() => data.persen.push(0));

    const where = { tahun_anggaran: tahun, is_active: '1' };
    if (upt !== '000111') {
      where.upt_id = upt;
    }

    try {
      const results = await SpmKegiatan.findAll({
        attributes: [
          'bulan',
          [fn('SUM', col('realisasi_sd_periode')), 'total_realisasi'],
          [fn('SUM', col('pagu_revisi')), 'total_pagu']
        ],
        where,
        group: ['bulan'],
        raw: true
      });

      results.forEach(row => {
        const monthIndex = parseInt(row.bulan, 10) - 1;
        const totalPagu = Number(row.total_pagu) || 0;
        const totalRealisasi = Number(row.total_realisasi) || 0;
        data.persen[monthIndex] = totalPagu > 0
          ? Math.round((totalRealisasi / totalPagu) * 100 * 100) / 100
          : 0;
      });
    } catch (err) {
      console.error('Query error:', err);
    }
    return data;
  }
}

module.exports = new HomeModels();
