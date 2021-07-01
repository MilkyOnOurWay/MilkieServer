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
    refreshToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    offer: {
      type: DataTypes.STRING(200),
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