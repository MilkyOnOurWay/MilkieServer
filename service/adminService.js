const { user, addManage, cafe, cafeHoneyTip, menu, menuCategory, sequelize } = require('../models');

module.exports = {
  isAdmin: async (userId) => {
    try {
      const result = user.findOne({
        where: {
          id: userId,
          isAdmin: true
        },
        raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  isAlreadyCancel: async (cafeId) => {
    try {
      const cancel = 1;
      const result = addManage.findOne({
        where: {
          cafeId: cafeId,
          confirmStatus: cancel
        },
        raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  cancelReport: async (cafeId, rejectReasonId) => {
    try {
      const cancel = 1;
      const result = addManage.update({
        confirmStatus: cancel,
        rejectReasonId: rejectReasonId
      },{
        where: {
          cafeId: cafeId,
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  registerCafe: async (id, cafeName, cafeAddress, businessHours, cafePhoneNum, cafeLink, longitude, latitude, cafeType, isReal) => {
    try {
      const registerCafe = cafe.create({
        id: id,
        cafeName: cafeName,
        cafeAddress: cafeAddress,
        businessHours: businessHours,
        cafePhoneNum: cafePhoneNum, 
        cafeLink: cafeLink,
        longitude: longitude,
        latitude: latitude,
        cafeType: cafeType,
        isReal: isReal
      });
      return registerCafe;
    } catch (error) {
      throw error;
    }
  },
  registerCafeHoneyTip: async (cafeId, honeyTipId) => {
    try {
      const result = cafeHoneyTip.create({
        cafeId,
        honeyTipId
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  registerCafeMenu: async (cafeId, menuName, price) => {
    try {
      const result = menu.create({
        menuName,
        price,
        cafeId
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  registerMenuCategory: async (menuId, categoryId) => {
    try {
      const result = menuCategory.create({
        menuId,
        categoryId
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
}