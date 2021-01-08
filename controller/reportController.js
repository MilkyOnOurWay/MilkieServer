const util = require('../modules/util');
const responseMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const { cafeService, reportService } = require('../service');

module.exports = {
  deleteCafe: async (req, res) => {
    const userId = req.userIdx;
    const { cafeId } = req.params;
    const { reason } = req.body;

    if (!userId || !cafeId || !reason){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const existingCafe = await cafeService.readOneCafe(cafeId);
      if (!existingCafe) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_EXISTING_CAFE));
      }

      const alreadyRequest = await reportService.readOneDeleteCafe(userId);
      if (alreadyRequest) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_DELETE_REQUEST_USER));
      }

      const result = await reportService.registerDeleteCafe(reason, userId, cafeId);
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.REGISTER_DELETE_REQUEST_SUCCESS));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  },
  editCafe: async (req, res) => {
    const userId = req.userIdx;
    const { cafeId } = req.params;
    const { reason } = req.body;

    if (!userId || !cafeId || !reason){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const existingCafe = await cafeService.readOneCafe(cafeId);
      if (!existingCafe) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_EXISTING_CAFE));
      }

      const alreadyRequest = await reportService.readOneEditCafe(userId);
      if (alreadyRequest) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_EDIT_REQUEST_USER));
      }

      const result = await reportService.registerEditCafe(reason, userId, cafeId);
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.REGISTER_EDIT_REQUEST_SUCCESS));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  },
  readReports: async (req, res) => {
    const userId = req.userIdx;
    
    try {
      const reports = new Object();
      const cancel = 1;
      const progress = 2;
      const confirm = 3;

      const canceledReports = await reportService.readReportsByStatus(userId, cancel);
      if (canceledReports.length == 0) {
        reports['1']= []
      } else {
        reports['1'] = canceledReports
      }

      const progressReports = await reportService.readReportsByStatus(userId, progress);
      if (!progressReports) {
        reports['2']= []
      } else {
        reports['2'] = progressReports
      }

      const confirmedReports = await reportService.readReportsByStatus(userId, confirm);
      if (!confirmedReports) {
        reports['3']= []
      } else {
        reports['3'] = confirmedReports
      }
    
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.READ_REPORTS_SUCCESS, reports));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  },
  confirmAndDeleteCafe: async (req, res) => {
    const userId = req.userIdx;
    const { cafeId } = req.params;

    if (!cafeId) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const existingCafe = await cafeService.readOneCafe(cafeId);
      if (!existingCafe) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_EXISTING_CAFE));
      }

      const isRightReportUser = await reportService.readReportUser(userId, cafeId);
      if (!isRightReportUser) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOT_RIGHT_REPORT_USER));
      }

      const isNotRealYet = await cafeService.checkCafeIsNotReal()
      if (!isNotRealYet) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.IS_REAL_CAFE));
      }

      const result = await cafeService.deleteCafe(cafeId);
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.DELETE_CAFE_SUCCESS));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  }, 
  addCafe: async (req, res) => {
    const userId = req.userIdx;
    const { cafeName, cafeAddress, cafeMapX, cafeMapY, honeyTip, menu } = req.body;

    if (!userId || !cafeName || !cafeAddress || !cafeMapX || !cafeMapY || !honeyTip || !menu) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      /** 카페 등록 */
      const registerAddCafe = await reportService.registerCafe(cafeName, cafeAddress, cafeMapX, cafeMapY);
      const registerAddCafeId = registerAddCafe.dataValues.id;

      /** honeyTip 등록 */
      for (let i = 0; i < honeyTip.length; i++) {
        let registerAddCafeHoneyTip = await reportService.registerAddCafeHoneyTip(registerAddCafeId, honeyTip[i]);
      } 

      /** menu 등록 */
      for (let i = 0; i < menu.length; i++) {
        let registerAddCafeMenu = await reportService.registerAddCafeMenu(registerAddCafeId, menu[i].menuName, menu[i].price);
        for (let j = 0; j < menu[i].category.length; j++){
          let registerAddMenuCategory = await reportService.registerAddMenuCategory(registerAddCafeMenu.dataValues.menuId, menu[i].category[j]);
        }
      }

      /** addManage에 등록 */
      const result = await reportService.registerAddCafe(userId, registerAddCafeId);
      return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMessage.REGISTER_ADD_CAFE_SUCCESS));
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMessage.INTERNAL_SERVER_ERROR));
    }
  }
}