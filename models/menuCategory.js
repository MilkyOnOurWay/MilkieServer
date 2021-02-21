module.exports = (sequelize, DataTypes) => {
  return sequelize.define('menuCategory', {
  }, {
    tableName: "MENU_CATEGORY",
    freezeTableName: true,
    timestamps: true,
  })
}