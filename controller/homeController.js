const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, cafe, universe, menuCategory, menu, sequelize } = require('../models/index');
const jwt = require('../modules/jwt');

module.exports = {
  milkyHome: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const tempResult = await sequelize.query(
      `SELECT CAFE.id, CAFE.cafeName, ifnull(universeCount, 0) universeCount, CAFE.longitude, CAFE.latitude, CAFE.cafeAddress, CAFE.businessHours,
      ifnull(isUniversed, false) as isUniversed
      FROM CAFE 
      left outer JOIN (
        SELECT UNIVERSE.cafeId , if ( UNIVERSE.userid = ${userIdx}, true, null) as isUniversed, userId
        FROM UNIVERSE 
        where userId = ${userIdx}
      group by UNIVERSE.cafeId, userId
      ) as cu2 ON CAFE.id = cu2.cafeId
      left outer JOIN (
        SELECT UNIVERSE.cafeId , count(UNIVERSE.cafeId) universeCount
        FROM UNIVERSE 
      group by UNIVERSE.cafeId
      ) as cu1 ON CAFE.id = cu1.cafeId
      where CAFE.isReal = true;`
      );

      const result = tempResult[0];

      for (let i = 0; i < result.length; i++) {
        if (result[i].isUniversed == 1) {
          result[i].isUniversed = true
        } else {
          result[i].isUniversed = false
        }
      }

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const { nickName } = userNickName[0];

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, {
        result,
        nickName
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
  categoryHome: async (req, res) => {
    const userIdx = req.userIdx;
    const { categoryId } = req.params;

    try {
      const findCategoryResult = await menuCategory.findAll({
        attributes: ['menuId'],
        where: {
          categoryId: categoryId
        },
      });

      if (findCategoryResult.length == 0) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_SEARCH_CAFE));
      }

      var findCategoryArray = [];
      for (var i = 0; i < findCategoryResult.length; i++) {
        findCategoryArray.push(findCategoryResult[i].menuId)
      }

      const findCategory = findCategoryArray;

      const findMenuResult = await menu.findAll({
        attributes: ['cafeId'],
        where: {
          menuId : findCategory
        },
      });

      if (!findMenuResult) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      }

      var findMenuArray = [];
      for (var i = 0; i < findMenuResult.length; i++) {
        findMenuArray.push(findMenuResult[i].cafeId)
      }

      const findMenu = findMenuArray;

      const tempResult = await sequelize.query(
      `SELECT CAFE.id, CAFE.cafeName, ifnull(universeCount, 0) universeCount, CAFE.longitude, CAFE.latitude, CAFE.cafeAddress, CAFE.businessHours,
      ifnull(isUniversed, false) as isUniversed
      FROM CAFE 
      left outer JOIN (
        SELECT UNIVERSE.cafeId , if ( UNIVERSE.userid = ${userIdx}, true, null) as isUniversed, userId
        FROM UNIVERSE 
        where userId = ${userIdx}
      group by UNIVERSE.cafeId, userId
      ) as cu2 ON CAFE.id = cu2.cafeId
      left outer JOIN (
        SELECT UNIVERSE.cafeId , count(UNIVERSE.cafeId) universeCount
        FROM UNIVERSE 
      group by UNIVERSE.cafeId
      ) as cu1 ON CAFE.id = cu1.cafeId
      where CAFE.id in (${findMenu}) and CAFE.isReal = true;`
      );

      const result = tempResult[0];

      if (result.length == 0) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_SEARCH_CAFE));
      }

      for (let i = 0; i < result.length; i++) {
        if (result[i].isUniversed == 1) {
          result[i].isUniversed = true
        } else {
          result[i].isUniversed = false
        }
      }

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const { nickName } = userNickName[0];

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_HOME_SUCCESS, {
        result,
        nickName
      }));
      return;
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}