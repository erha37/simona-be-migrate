const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SpmProgram = require('./SpmProgram');

const SpmKegiatan = sequelize.define('SpmKegiatan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_spm_program: DataTypes.INTEGER,
  kd_unit: DataTypes.STRING(50),
  nama_upt: DataTypes.STRING(255),
  kode_kegiatan: DataTypes.STRING(50),
  nama_kegiatan: DataTypes.STRING(255),
  pagu_revisi: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  realisasi_sd_periode: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  sisa_anggaran: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  upt_id: DataTypes.STRING(20),
  bulan: DataTypes.STRING(10),
  tahun_anggaran: DataTypes.STRING(10),
  is_active: { type: DataTypes.STRING(5), defaultValue: '1' }
}, {
  tableName: 'tb_spm_kegiatan'
});

SpmKegiatan.belongsTo(SpmProgram, { foreignKey: 'id_spm_program', targetKey: 'id_spm_program' });

module.exports = SpmKegiatan;
