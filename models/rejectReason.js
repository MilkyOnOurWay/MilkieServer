module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RejectReason', {
    rejectReasonId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rejectReason: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'REJECT_REASON',
    timestamps: false,
  })
}