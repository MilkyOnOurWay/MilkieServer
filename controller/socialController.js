const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const util = require("../modules/util");
const jwt = require('../modules/jwt');
const { socialService } = require('../service');
// const { user } = require('../models/index');

module.exports = {
  socialLogin: async (req, res) => {
    try {
      const { snsId, provider } = req.body;
      console.log('로그인 되었습니다.');
      const user = await socialService.getUserIdxById(snsId);
      const { token } = await jwt.sign(user[0]);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {
        accessToken: token,
      }));
    } catch (error) {
      return res.statusCode(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_FOUND_USER));
    }
  },
  socialSignup: async (req, res, next) => {
    try {
      const { nickName, snsId, provider } = req.body;
      console.log('회원가입 완료');
      const userIdx = await socialService.socialsignup(nickName, snsId, provider);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SIGNUP_SUCCESS));
    } catch (error) {
      next(error);
    }
  },
  giveRefreshToken: async (req, res) => {
    console.log('req.decoded: ', req.decoded);
    if (req.decoded === undefined) {
      return res.status(statusCode.OK).send(util.fail(statusCode.OK, responseMessage.REQUIRE_LOGIN));
    } else {
      const userIdx = req.decoded.userIdx;
      const refreshToken = await socialService.getRefreshTokenByUserIdx(userIdx);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SUCCESS_TOKEN_REPLACEMENT, {
        userIdx: userIdx,
        refreshToken: refreshToken[0].refreshToken
      }));
    }
  }
}