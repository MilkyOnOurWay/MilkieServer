module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DeleteManage', {
    deleteManageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reason: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'DELETE_MANAGE',
    timestamps: false,
  })
}