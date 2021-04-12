const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middlewares/middlewares');
const adminController = require('../../controller/adminController');

router.post('/cancel', jwtMiddleware.userJwt, adminController.cancelReport);
router.post('/register', jwtMiddleware.userJwt, adminController.registerCafe);
router.post('/:cafeId', jwtMiddleware.userJwt, adminController.registerMenu);

module.exports = router;