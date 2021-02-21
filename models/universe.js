module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Universe', {
    universeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, 
  {
    tableName: 'UNIVERSE',
    timestamps: false,
  })
}