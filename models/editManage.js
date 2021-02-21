module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EditManage', {
    editManageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reason: {
      type: DataTypes.TEXT(),
      allowNull: false
    }
  }, {
    tableName: 'EDIT_MANAGE',
    timestamps: false,
  })
}