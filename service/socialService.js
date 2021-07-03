const { user } = require('../models');

module.exports = {
  //소셜 회원가입
  socialsignup: async (nickName, uuid, offer) => {
    // const fields = 'nickName, id, offer';
    // let query = `INSERT INTO milkyway.${USER} (${fields}) VALUES ("${nickName}", "${id}", "${provider}")`;
    try {
      const result = await user.create({
        uuid: uuid,
        nickName: nickName,
        offer: offer
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  //소셜 로그인
  getUserIdxById: async (uuid) => {
    try {
      const result = await user.findOne({
        where: {
          uuid: uuid
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
  },
  //존재하는 email인지 확인
  checkUserEmail: async (email) => {
    try {
      const result = await user.findOne({
        attributes: ['email']
      });
      return result;
    } catch (error) {
      if (error.errno == 1062) {
        console.log('checkUser error : ', error.errno, error.code);
        throw error;
      }
      throw error;
    }
  },
  //이메일로 유저 정보 가져오기
  getUserIdxByEmail: async (email) => {
    try {
      const result = await user.findOne({
        attributes: ['email']
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}