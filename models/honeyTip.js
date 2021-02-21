module.exports = (sequelize, DataTypes) => {
  return sequelize.define('HONEYTIP', {
    option: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}