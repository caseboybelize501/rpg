const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  max_hp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  stats: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  inventory: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = Character;