const { cafe, menu, honeyTip, category, sequelize, Sequelize } = require('../models');
const Op = Sequelize.Op;

module.exports = {
  readOneCafe: async (cafeId) => {
    try {
      const existingCafe = await cafe.findOne({
        where: {
          id: cafeId,
        }
      });
      return existingCafe;
    } catch (error) {
      throw error;
    }
  },
  readCafeInfo: async (userId, cafeId) => {
    try {
      // const result = await sequelize.query(`
      // SELECT CAFE.id, CAFE.cafeName, CAFE.cafeAddress, CAFE.businessHours, CAFE.cafePhoneNum, CAFE.cafeLink, ifnull(universeCount, 0) universeCount, ifnull(isUniversed, false) as isUniversed
      // FROM CAFE left JOIN (
      //   SELECT UNIVERSE.cafeId, count(UNIVERSE.cafeId) universeCount, true as isUniversed
      //   FROM UNIVERSE 
      //   WHERE userId = ${userId}
      // ) as cu ON CAFE.id = cu.cafeId
      // where CAFE.id = ${cafeId};`)
      // const result = await sequelize.query(`
      // SELECT CAFE.id, CAFE.cafeName, CAFE.cafeAddress, CAFE.businessHours, CAFE.cafePhoneNum, CAFE.cafeLink, ifnull(universeCount, 0) universeCount, ifnull(isUniversed, false) as isUniversed
      // FROM CAFE
      // LEFT JOIN (
      //   SELECT UNIVERSE.cafeId , if ( UNIVERSE.userid = ${userId}, true, false) as isUniversed, UNIVERSE.userId, count(UNIVERSE.cafeId) universeCount
      //   FROM UNIVERSE 
      // group by UNIVERSE.cafeId
      // ) as cu ON CAFE.id = cu.cafeId
      // where CAFE.id = ${cafeId};`)
      const result = await sequelize.query(`
      SELECT CAFE.id, CAFE.cafeName, CAFE.cafeAddress, CAFE.businessHours, CAFE.cafePhoneNum, CAFE.cafeLink, ifnull(universeCount, 0) universeCount, ifnull(isUniversed, false) as isUniversed
      FROM CAFE 
      left outer JOIN (
        SELECT UNIVERSE.cafeId , if ( UNIVERSE.userid = ${userId}, true, null) as isUniversed, userId
        FROM UNIVERSE 
        where userId = ${userId}
      group by UNIVERSE.cafeId, userId
      ) as cu2 ON CAFE.id = cu2.cafeId
      left outer JOIN (
        SELECT UNIVERSE.cafeId , count(UNIVERSE.cafeId) universeCount
        FROM UNIVERSE 
      group by UNIVERSE.cafeId
      ) as cu1 ON CAFE.id = cu1.cafeId
      where CAFE.id = ${cafeId}`)
      return result;
    } catch (error) {
      throw error;
    }
  },
  readCafeMenu: async (cafeId) => {
    try {
      const result = await menu.findAll({
        where: {
          cafeId: cafeId,
        },
        attributes: { exclude: ['cafeId', 'menuId'] },
        include: [
          {
            model : category,
            as: 'hasMenu',
            attributes : ['categoryId'],
            through: { attributes: []},
            group: ["menuId"],
          }
        ],
        // raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteCafe: async (cafeId) => {
    const result = await cafe.destroy({
      where: {
        id: cafeId
      }
    })
    return result;
  },
  checkCafeIsNotReal: async (cafeId) => {
    try {
      const result = await cafe.findOne({
        where: {
          id: cafeId,
          isReal: 0
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  readCafeCategory: async (cafeId) => {
    try{ 
      const result = await sequelize.query(`SELECT distinct(CATEGORY.categoryId) FROM MENU LEFT OUTER JOIN ( MENU_CATEGORY INNER JOIN CATEGORY ON CATEGORY.categoryId = MENU_CATEGORY.categoryId)  ON MENU.menuId = MENU_CATEGORY.menuId WHERE MENU.cafeId = ${cafeId};`,{
        raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  isExistingCafe: async (id) => {
    try{ 
      // const result = await sequelize.query(`SELECT CAFE.cafeAddress FROM CAFE WHERE CAFE.cafeAddress like '${cafeAddress}%';`);
      const result = await cafe.findOne({
        where: {
          id: id
        }
      })
      return result;
    } catch (error) {
      throw error;
    }
  },
  readCafeHoneyTip: async (cafeId) => {
    try{ 
      const result =  await sequelize.query(`select honeyTipId from CAFE_HONEYTIP where cafeId = ${cafeId};`)
      return result;
    } catch (error) {
      throw error;
    }
  },
  readAllCafeId: async () => {
    try{ 
      const result =  cafe.findAll({
        attributes: ['id'],
        raw: true
      })
      return result;
    } catch (error) {
      throw error;
    }
  },
 
} 