const { User, Cafe } = require('../models');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AddManage', {
    addManageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    confirmStatus: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    onlyMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'ADD_MANAGE',
    timestamps: false,
  })
}