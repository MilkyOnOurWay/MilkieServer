const { universe, cafe, honeyTip, category, sequelize } = require('../models');

module.exports = {
  readUniverseCount: async (cafeId) => {
    try {
      const universeCount = universe.findAndCountAll({
        where: {
          cafeId: cafeId
        }
      });
      return universeCount;
    } catch (error) {
      throw error;
    }
  },
  isUniversed: async (userId, cafeId) => {
    try {
      const result = universe.findAll({
        where: {
          cafeId: cafeId,
          userId: userId
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAroundUniverse: async (userId) => {
    try {
      const aroundUniverse = await sequelize.query(`
        select c.id, c.cafeName, c.cafeAddress, c.businessHours, c.longitude, c.latitude
        from CAFE c 
        right join (
          select u.universeId, u.cafeId, u.userId 
          from UNIVERSE u 
          where u.userId = ${userId}) u 
        on u.cafeId = c.id
        order by u.universeId desc;
      `);
      return aroundUniverse;
    } catch(error) {
      throw error;
    }
  }
} 