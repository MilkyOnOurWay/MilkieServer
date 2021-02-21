module.exports = (sequelize, DataTypes) => {
  return sequelize.define('cafeHoneyTip', {
  }, {
    tableName: "CAFE_HONEYTIP",
    freezeTableName: true,
    timestamps: true,
  })
}