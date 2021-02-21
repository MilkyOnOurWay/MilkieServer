module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CAFE', {
    cafeName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    cafeAddress: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    businessHours: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cafePhoneNum: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cafeLink: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cafeType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    isReal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}