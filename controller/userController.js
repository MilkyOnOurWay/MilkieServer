const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const { user } = require('../models/index');
const jwt = require('../modules/jwt');
const { sequelize } = require('../models');

module.exports = {
  signup: async (req, res) => {
    const { uuid, nickName } = req.body;

    if (!nickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }

    // const searchUuidResult = await sequelize.query(`SELECT uuid FROM USER WHERE uuid = '%${uuid}%';`);

    // const searchUuid = searchUuidResult[0];

    // if (searchUuid) {
    //   res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SINGIN_SUCCESS));
    //   return;
    // }

    const nickNameCheck = await user.findOne({
      where: {
        nickName: nickName
      }
    });

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    const userResult = await user.create({
      uuid: uuid,
      nickName: nickName,
      isAdmin: false
    });

    const { id } = userResult;

    const { accessToken, refreshToken } = await jwt.sign(id);
    
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGNUP_SUCCESS, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  },
  nickNameChange: async (req, res) => {
    const { uuid, newNickName } = req.body;
    const userIdx = req.userIdx;
    
    if (!newNickName) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
      return;
    }
    
    const nickNameCheck = await user.findOne({
      where: {
        nickName: newNickName
      }
    });

    if (nickNameCheck) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_NICKNAME));
      return;
    }

    const userResult = await user.update({
      uuid: uuid,
      nickName: newNickName,
    }, {
        where: {
          id: userIdx
        }
      });

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.NICKNAME_UPDATE_SUCCESS));
    return;
  },
  deleteUser: async (req, res) => {
    const userIdx = req.userIdx;

    try {
      const findUser = await user.findOne({
        where: {
          id: userIdx
        }
      });

      if (!findUser) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_FOUND_USER));
        return;
      }

      const userDelete = await user.destroy({
        where: {
          id: userIdx
        }
        });

      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.USER_DELETE_SUCCESS));
    } catch (error) {
      console.log(error);
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
  }
}

