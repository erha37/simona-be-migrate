const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: DataTypes.STRING(100), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  upt: { type: DataTypes.STRING(20), },
  level: { type: DataTypes.STRING(50),  }
}, {
  tableName: 'tb_user',
  freezeTableName: true,
  timestamps: false
});

module.exports = User;
