const Sequelize = require('sequelize');
const db = {};
const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER, DATABASE_HOST, DATABASE_DIALECT } = process.env;
if (!DATABASE_NAME || !DATABASE_PASSWORD || !DATABASE_USER || !DATABASE_HOST || !DATABASE_DIALECT) {
  console.error('Please check database env', process.env);
  process.exit(1);
}

const database = DATABASE_NAME;
const username = DATABASE_USER;
const password = DATABASE_PASSWORD;
const host = DATABASE_HOST;
const dialect = DATABASE_DIALECT;

const sequelize = new Sequelize(database, username, password, { host, dialect })

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.cafe = require('./cafe')(sequelize, Sequelize);
db.menu = require('./menu')(sequelize, Sequelize);
db.user = require('./user')(sequelize, Sequelize);
db.category = require('./category')(sequelize, Sequelize);
db.universe = require('./universe')(sequelize, Sequelize);
db.honeyTip = require('./honeyTip')(sequelize, Sequelize);
db.editManage = require('./editManage')(sequelize, Sequelize);
db.addManage = require('./addManage')(sequelize, Sequelize);
db.deleteManage = require('./deleteManage')(sequelize, Sequelize);
db.rejectReason = require('./rejectReason')(sequelize, Sequelize);
db.cafeHoneyTip = require('./cafeHoneyTip')(sequelize, Sequelize);
db.menuCategory = require('./menuCategory')(sequelize, Sequelize);

/** 1 : N  Cafe : Menu */
db.cafe.hasMany(db.menu, { onDelete: 'cascade', foreignKey: 'cafeId', sourceKey: 'id', });
db.menu.belongsTo(db.cafe, { foreignKey: 'cafeId', targetKey: 'id', });

/** N : M  User : Cafe */
db.user.belongsToMany(db.cafe, { through: 'Universe', as: 'Universed', foreignKey: 'userId' });
db.cafe.belongsToMany(db.user, { through: 'Universe', as: 'Universer', foreignKey: 'cafeId' });

/** N : M User : Cafe */
db.user.belongsToMany(db.cafe, { through: 'EditManage', as: 'Edited', foreignKey: 'userId' });
db.cafe.belongsToMany(db.user, { through: 'EditManage', as: 'Editor', foreignKey: 'cafeId' });

/** N : M User : Cafe */
db.user.belongsToMany(db.cafe, { through: 'DeleteManage', as: 'Deleted', foreignKey: 'userId' });
db.cafe.belongsToMany(db.user, { through: 'DeleteManage', as: 'Deleter', foreignKey: 'cafeId' });

/** N : M User : Cafe */
db.user.belongsToMany(db.cafe, { through: 'AddManage', as: 'Added', foreignKey: 'userId' });
db.cafe.belongsToMany(db.user, { through: 'AddManage', as: 'Adder', foreignKey: 'cafeId' });

/** N : M Menu : Category */
db.menu.belongsToMany(db.category, { through: 'menuCategory', as: 'hasMenu', foreignKey: 'menuId' });
db.category.belongsToMany(db.menu, { through: 'menuCategory', as: 'hasCategory', foreignKey: 'categoryId' });

/** N : M Cafe : HoneyTip */
db.cafe.belongsToMany(db.honeyTip, { through: 'cafeHoneyTip', as: 'hasCafe', foreignKey: 'cafeId' });
db.honeyTip.belongsToMany(db.cafe, { through: 'cafeHoneyTip', as: 'hasHoneyTip', foreignKey: 'honeyTipId' });

/** 1 : N  rejectReason : addManage */
db.rejectReason.hasMany(db.addManage, { onDelete: 'cascade', foreignKey: 'rejectReasonId', sourceKey: 'rejectReasonId', });
db.addManage.belongsTo(db.rejectReason, { foreignKey: 'rejectReasonId', targetKey: 'rejectReasonId', });

module.exports = db;