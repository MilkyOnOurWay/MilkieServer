const jwt = require("jsonwebtoken");
const { user } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

if (!process.env.JWT_SECRET) {
  console.error('Please check jwt secret env', process.env)
  process.exit(1);
}

if (!process.env.ACCESS_TOKEN_ALGORITHM || !process.env.ACCESS_TOKEN_EXPIRY || !process.env.ACCESS_TOKEN_ISSUER) {
  console.error('Please check access token options env', process.env);
  process.exit(1);
}

if (!process.env.REFRESH_TOKEN_ALGORITHM || !process.env.REFRESH_TOKEN_EXPIRY || !process.env.REFRESH_TOKEN_ISSUER) {
  console.error('Please check refresh token options env', process.env);
  process.exit(1);
}

const secretKey = process.env.JWT_SECRET;
const options = {
  algorithm: process.env.ACCESS_TOKEN_ALGORITHM,
  expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  issuer: process.env.ACCESS_TOKEN_ISSUER,
};
const refreshOptions = {
  algorithm: process.env.REFRESH_TOKEN_ALGORITHM,
  expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  issuer: process.env.REFRESH_TOKEN_ISSUER,
}

module.exports = {
  sign: async (idx) => {
    const payload = {
      userIdx: idx
    };
    const result = {
      accessToken: jwt.sign(payload, secretKey, options),
      refreshToken: jwt.sign(payload, secretKey, refreshOptions),
    };

    // refreshToken Update
    await user.update({
      refreshToken: result.refreshToken
    }, {
      where: {
        id: idx
      }
    })
    return result;
  },

  // 디코딩 해줌 => (jwt.io 참고)
  verify: async (token) => {
    let decoded;
    try {
      // 디코딩할 때도 idx와 name으로 분리해서 옴
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      if (err.message === "jwt expired") {
        console.log("expired token");
        return TOKEN_EXPIRED;
      } else if (err.message === "invalid token") {
        console.log("invalid token");
        console.log(TOKEN_INVALID);
        return TOKEN_INVALID;
      } else {
        console.log("invalid token");
        return TOKEN_INVALID;
      }
    }
    return decoded;
  },

  // refreshToken Verify
  refresh: async (refreshToken) => {
    try {
      const result = jwt.verify(refreshToken, secretKey);

      if (result.userIdx === undefined) {
        return TOKEN_INVALID;
      }

      const users = await user.findOne({
        where: {
          id: result.userIdx
        }
      })

      const { usersRefreshToken } = users;

      if (refreshToken !== usersRefreshToken) {
        console.log("invalid refresh token");
        return TOKEN_INVALID;
      }
      const payload = {
        userIdx: user[0].userIdx,
      };
      const dto = {
        accessToken: jwt.sign(payload, secretKey, options),
        refreshToken: jwt.sign(payload, secretKey, refreshOptions),
      };
      await user.update({
        refreshToken: dto.refreshToken
      }, {
        where: {
          id: payload.userIdx
        }
      })
      return dto;
    } catch (err) {
      console.log("jwt.js ERROR : ", err);
      throw err;
    }
  },
};