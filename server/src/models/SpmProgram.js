const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SpmProgram = sequelize.define('SpmProgram', {
  id_spm_program: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_upt: DataTypes.STRING(255),
  bulan: DataTypes.STRING(10),
  tahun_anggaran: DataTypes.STRING(10),
  is_active: { type: DataTypes.STRING(5), defaultValue: '1' }
}, {
  tableName: 'tb_spm_program'
});

module.exports = SpmProgram;
