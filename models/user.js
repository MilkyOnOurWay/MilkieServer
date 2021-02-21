module.exports = (sequelize, DataTypes) => {
  return sequelize.define('USER', {
    uuid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nickName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}