const { user } = require('../models');

module.exports = {
  //소셜 회원가입
  socialsignup: async (nickName, id, provider) => {
    // const fields = 'nickName, id, provider';
    // let query = `INSERT INTO milkyway.${USER} (${fields}) VALUES ("${nickName}", "${id}", "${provider}")`;
    try {
      const result = await user.create({
        id: id,
        nickName: nickName,
        provider: provider
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  //소셜 로그인
  getUserIdxById: async (id) => {
    try {
      const result = await user.findOne({
        where: {
          id: id
        }
      })
      return result;
    } catch (error) {
      throw error;
    }
  },
  //유저의 refreshToken 가져오기
  getRefreshTokenByUserIdx: async (userIdx) => {
    try {
      const result = await user.findOne({
        where: {
          id: userIdx
        },
        attributes: ['refreshToken']
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}