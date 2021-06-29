const util = require("../modules/util");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const { user } = require("../models");
const jwt = require('../modules/jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  userJwt: async (req, res, next) => {
    const token = req.headers.token;

    if (token === undefined) {
      console.log("로그인하지 않은 사용자입니다.");
      next();
    } else {
      if (!token) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
      }
      const user = await jwt.verify(token);
      if (user === TOKEN_EXPIRED) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN));
      }
      if (user === TOKEN_INVALID) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN));
      }
      if (user.userIdx === undefined) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN));
      }
      req.decoded = user;
      next();
    }
  },

  // refreshToken 검증
  refreshToken: async (req, res) => {
    const refreshToken = req.headers.refreshtoken;

    if (!refreshToken) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
    }

    const newToken = await jwt.refresh(refreshToken);

    if (newToken == TOKEN_EXPIRED) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN));
    }

    if (newToken == TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
    }

    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.SUCCESS_TOKEN_REPLACEMENT,
          newToken
        )
      );
  },
};