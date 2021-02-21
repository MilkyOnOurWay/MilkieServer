const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const { cafeService, universeService } = require('../service');
const request = require('request-promise');
const { cafe } = require('../models/index');
const { sequelize, Sequelize } = require('../models');
require('dotenv').config();

module.exports = {
  searchCafeByDB: async (req, res) => {
    const userId = req.userIdx;
    const searchWord = req.params.searchWord;

    try {
      const searchCafeTemp = await sequelize.query(`SELECT cafeName, cafeAddress, longitude, latitude, businessHours
      from CAFE
      where cafeName like '%${searchWord}%' and isReal = true;`);

      const searchCafe = searchCafeTemp[0];

      for (let i = 0; i < searchCafe.length; i++) {
        if (searchCafe[i].businessHours == null) {
          searchCafe[i].businessHours = ""
        } else {
          
        }
      }

      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.SEARCH_SUCCESS, searchCafe)); 
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
  },
  searchCafeByKakaoAPI: async (req, res) => {
    const userId = req.userIdx;
    const query  = req.query.query;
    const { KAKAO_KEY } = process.env;
    if (!KAKAO_KEY) {
      console.error('Please check kakao key env', process.env);
      process.exit(1);
    }

    try {
      const kakaoOptions = {
        url: 'https://dapi.kakao.com/v2/local/search/keyword.json',  
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${KAKAO_KEY}`
        },
        qs: {
          query : query 
        },
        encoding: 'UTF-8',
      }
  
      const result = await request(kakaoOptions)
                        .then(function(response) {
                          return JSON.parse(response).documents;
                        })
                        .catch(function (err) {
                          return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
                      });
      const cafes = [];
      const allCafeIdTemp = await cafeService.readAllCafeId();
      const allCafeId = [];
      for (let i = 0; i < allCafeIdTemp.length; i++){
        allCafeId.push(allCafeIdTemp[i].id)
      }
      for (let i = 0; i < result.length; i++) {
        let cafe = new Object();
        cafe["cafeName"] = result[i].place_name;
        cafe["cafeAddress"] = result[i].road_address_name;
        cafe["longitude"] = result[i].x;
        cafe["latitude"] = result[i].y;
        let isExistingCafeByPosition = allCafeId.indexOf(parseInt(result[i].id))
        if (isExistingCafeByPosition == -1){
          cafe["isReported"] = false;
        } else {
          cafe["isReported"] = true;
        }
        cafes.push(cafe);
      }

      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.READ_CAFE_INFO_SUCCESS,cafes));     
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  }
}