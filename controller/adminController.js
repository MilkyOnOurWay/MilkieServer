const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const { cafeService, adminService } = require('../service');

module.exports = {
  cancelReport: async (req, res) => {
    const userId = req.userIdx;
    const { cafeId, rejectReasonId } = req.body;

    if (!userId || !cafeId || !rejectReasonId) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const isAdmin = await adminService.isAdmin(userId);
      if (isAdmin) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_ADMIN));
      }
      
      const isAlreadyCancel = await adminService.isAlreadyCancel(cafeId);
      if (isAlreadyCancel) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.CANCEL_REPORT_FAIL));
      }

      const result = await adminService.cancelReport(cafeId, rejectReasonId);      
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.CANCEL_REPORT_SUCCESS));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  },
  registerCafe: async (req, res) => {
    const userId = req.userIdx;
    const { id, cafeName, cafeAddress, businessHours, cafePhoneNum, cafeLink, longitude, latitude, cafeType, isReal, honeyTip, menu } = req.body;

    if (!userId || !id || !cafeName || !cafeAddress || !longitude || !latitude || !cafeType || !isReal || !menu) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const existingCafe = await cafeService.readOneCafe(id);
      if (existingCafe) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_REGISTERED_CAFE));
      }

      /** 카페 등록 */
      const registerCafe = await adminService.registerCafe(id, cafeName, cafeAddress, businessHours, cafePhoneNum, cafeLink, longitude, latitude, cafeType, isReal);
      const registerCafeId = registerCafe.dataValues.id;

      /** honeyTip 등록 */
      const registerCafeHoneyTip = [];
      for (let i = 0; i < honeyTip.length; i++) {
        const registerCafeHoneyTipTemp = await adminService.registerCafeHoneyTip(registerCafeId, honeyTip[i]);
        registerCafeHoneyTip.push(registerCafeHoneyTipTemp);
      }   
      
      /** menu 등록 */
      const registerCafeMenu = new Object();
      for (let i = 0; i < menu.length; i++) {
        const registerCafeMenuTemp = await adminService.registerCafeMenu(registerCafeId, menu[i].menuName, menu[i].price);
        registerCafeMenu[registerCafeMenuTemp] = [];
        for (let j = 0; j < menu[i].category.length; j++){
          const registerMenuCategoryTemp = await adminService.registerMenuCategory(registerCafeMenuTemp.dataValues.menuId, menu[i].category[j]);
          registerCafeMenu[registerCafeMenuTemp].push(registerMenuCategoryTemp);
        }
      }

      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.REGISTER_CAFE_SUCCESS, {registerCafe, registerCafeHoneyTip, registerCafeMenu}));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  }
}