module.exports = (sequelize, DataTypes) => {
  return sequelize.define('MENU', {
    menuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    menuName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}