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
    }
  }, {
    tableName: 'ADD_MANAGE',
    timestamps: false,
  })
}