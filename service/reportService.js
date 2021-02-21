const { cafe, deleteManage, editManage, addManage, cafeHoneyTip, menuCategory, menu, user, sequelize} = require('../models');

module.exports = {
  readOneDeleteCafe: async (userId, cafeId) => {
    try {
      const result = deleteManage.findOne({
        where: {
          userId: userId,
          cafeId: cafeId
        },
        raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  registerDeleteCafe: async (reason, userId, cafeId) => {
    try {
      const result = deleteManage.create({
        reason,
        cafeId,
        userId
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  readOneEditCafe: async (userId, cafeId) => {
    try {
      const result = editManage.findOne({
        where: {
          userId: userId,
          cafeId: cafeId
        },
        raw: true
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  registerEditCafe: async (reason, userId, cafeId) => {
    try {
      const result = editManage.create({
        reason,
        cafeId,
        userId
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  readReportsByStatus: async (userId, status) => {
    try {
      const reports = addManage.findAll({
        where : {
          userId: userId,
          confirmStatus: status
        },
        attributes: {
          exclude: ["addManageId", "userId", "confirmStatus"]
        },
        raw: true
      })
      return reports;
    } catch (error) {
      throw error;
    }
  },
  readReportUser: async (userId, cafeId) => {
    try {
      const isRightReportUser = addManage.findOne({
        where: {
          userId: userId,
          cafeId: cafeId
        }
      });
      return isRightReportUser;
    } catch (error) {
      throw error;
    }
  },
  registerCafe: async (cafeName, cafeAddress, longitude, latitude) => {
    try {
      const privateCafeType = 1;
      const notReal = 0;
      const registerCafeId = cafe.create({
          cafeName,
          cafeAddress,
          longitude,
          latitude,
          cafeType: privateCafeType,
          isReal: notReal
      });
      return registerCafeId;
    } catch (error) {
      throw error;
    }
  },
  registerAddCafeHoneyTip: async (cafeId, honeyTipId) => {
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
  registerAddCafeMenu: async (cafeId, menuName, price) => {
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
  registerAddMenuCategory: async (menuId, categoryId) => {
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
  registerAddCafe: async (userId, cafeId) => {
    try {
      const progressStatus = 2;
      const now = new Date();
      const result = addManage.create({
        // created_at: Sequelize.NOW,
        userId,
        cafeId,
        confirmStatus: progressStatus,
        created_at: now.toUTCString()
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  readCanceledReports: async (userId) => {
    try {
      const cancel = 1;
      const reports = sequelize.query(`SELECT c.id, c.cafeName, c.cafeAddress, a.created_at, a.rejectReasonId 
      FROM CAFE c 
      INNER JOIN ( ADD_MANAGE a INNER JOIN USER u ON u.id = a.userId) ON c.id = a.cafeId AND u.id = ${userId}
      where a.confirmStatus = ${cancel};`);
      return reports;
    } catch (error) {
      throw error;
    }
  },
  readProgressReports: async (userId) => {
    try {
      const progress = 2;
      const reports = sequelize.query(`SELECT c.id, c.cafeName, c.cafeAddress, a.created_at, a.rejectReasonId  
      FROM CAFE c 
      INNER JOIN ( ADD_MANAGE a INNER JOIN USER u ON u.id = a.userId) ON c.id = a.cafeId AND u.id = ${userId}
      where a.confirmStatus = ${progress};`);
      return reports;
    } catch (error) {
      throw error;
    }
  },
  readConfirmedReports: async (userId) => {
    try {
      const confirm = 3;
      const result = await sequelize.query(`SELECT c.id, c.cafeName, c.cafeAddress, a.created_at FROM CAFE c INNER JOIN ( ADD_MANAGE a INNER JOIN USER u ON u.id = a.userId) ON c.id = a.cafeId AND u.id = ${userId} where a.confirmStatus = ${confirm};`)
      return result;
    } catch (error) {
      throw error;
    }
  },
}