const sequelize = require('../config/database');
const User = require('./User');
const Satker = require('./Satker');
const SpmProgram = require('./SpmProgram');
const SpmKegiatan = require('./SpmKegiatan');

module.exports = { sequelize, User, Satker, SpmProgram, SpmKegiatan };
