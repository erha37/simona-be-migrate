const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Satker = sequelize.define('Satker', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kd_satker: DataTypes.STRING(20),
  nama_satker: DataTypes.STRING(255)
}, {
  tableName: 'tb_satker'
});

module.exports = Satker;
