const { Satker, SpmKegiatan } = require('./index');

class ContactsModels {
  async getSatker() {
    try {
      const rows = await Satker.findAll({
        attributes: ['kd_satker', 'nama_satker'],
        group: ['kd_satker', 'nama_satker'],
        order: [['nama_satker', 'ASC']],
        raw: true
      });
      return rows;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }

  async getKdSatker(level, user) {
    const where = { is_active: '1' };
    if (level !== '1' && user !== '000111') {
      where.kd_unit = user;
    }

    try {
      const rows = await SpmKegiatan.findAll({
        attributes: [
          ['nama_upt', 'upt'],
          'bulan',
          'tahun_anggaran',
          ['created_at', 'tgl_upload']
        ],
        where,
        group: ['nama_upt', 'bulan', 'tahun_anggaran', 'created_at'],
        order: [['created_at', 'DESC']],
        raw: true
      });
      return rows;
    } catch (err) {
      console.error('Query error:', err);
      return [];
    }
  }

  // Insert kegiatan baru, atau update kalau kombinasi
  // (kode_kegiatan, upt_id, bulan, tahun_anggaran) sudah ada.
  async insertKegiatan(data) {
    try {
      const [record, created] = await SpmKegiatan.findOrCreate({
        where: {
          kode_kegiatan: data.kode_kegiatan,
          upt_id: data.upt_id || data.kd_unit,
          bulan: data.bulan,
          tahun_anggaran: data.tahun_anggaran || data.tahun
        },
        defaults: {
          id_spm_program: data.id_spm_program,
          kd_unit: data.kd_unit,
          nama_upt: data.nama_upt,
          nama_kegiatan: data.nama_kegiatan,
          pagu_revisi: data.pagu_revisi,
          realisasi_sd_periode: data.realisasi_sd_periode,
          sisa_anggaran: data.sisa_anggaran,
          is_active: '1'
        }
      });

      if (!created) {
        await record.update({
          nama_kegiatan: data.nama_kegiatan,
          pagu_revisi: data.pagu_revisi,
          realisasi_sd_periode: data.realisasi_sd_periode,
          sisa_anggaran: data.sisa_anggaran,
          is_active: '1'
        });
      }

      return record;
    } catch (err) {
      console.error('Insert error:', err);
      throw err;
    }
  }
}

module.exports = new ContactsModels();
