const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user, universe, cafe, menuCategory, menu } = require('../models/index');
const jwt = require('../modules/jwt');
const sequelize = require('sequelize');
const { universeService, cafeService } = require('../service');

module.exports = {
  universeOn: async (req, res) => {
    const userIdx = req.userIdx;
    const { cafeId } = req.body;

    try {
      if (!cafeId) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        return;
      }
  
      const universeOn = await universe.create({
        userId: userIdx,
        cafeId: cafeId,
      });
  
      const universeResult = await universe.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('universeId')), 'universeCount']],
        where: {
          cafeId: cafeId
        } 
      });
  
      const { universeCount } = universeResult[0].dataValues;
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UNIVERSEON_SUCCESS, {
        universeOn,
        universeCount
      }));
      return;
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
  universeOff: async (req, res) => {
    const userIdx = req.userIdx;
    const { cafeId } = req.params;

    try {
      if (!cafeId) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        return;
      }
  
      const universeOff = await universe.findOne({
        where: {
          userId: userIdx,
          cafeId: cafeId,
        }
      });
  
      if (!universeOff) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_FOUND_UNIVERSE));
      }
  
      await universeOff.destroy({
        where: {
          userId: userIdx,
          cafeId: cafeId,
        }
      });

      const universeResult = await universe.findAll({
        attributes: [[sequelize.fn('COUNT', sequelize.col('universeId')), 'universeCount']],
        where: {
          cafeId: cafeId
        } 
      });
  
      const { universeCount } = universeResult[0].dataValues;
  
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.DELETE_UNIVERSE_SUCCESS, {
        universeOff,
        universeCount
      }));
      return;
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  },
  universeHome: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const aroundUniverseTemp = await universeService.getAroundUniverse(userIdx);
      const aroundUniverse = aroundUniverseTemp[0];
      for (let i = 0; i < aroundUniverse.length; i++) {
        let uc = await cafeService.readCafeCategory(aroundUniverse[i].id);
        aroundUniverse[i]['category'] = [];
        for (let j = 0; j < uc[0].length; j++) {
          aroundUniverse[i]['category'].push(uc[0][j].categoryId)
        }
      }

      const userNickName = await user.findAll({
        attributes: ['nickName'],
        where: {
          id: userIdx
        }
      });

      const { nickName } = userNickName[0];

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_UNIVERSE_SUCCESS, {
        aroundUniverse,
        nickName
      }));
      return;
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
      return;
    }
  }
}
