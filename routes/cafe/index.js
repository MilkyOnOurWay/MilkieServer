const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middlewares/middlewares');
const cafeController = require('../../controller/cafeController');

router.get('/:cafeId', jwtMiddleware.userJwt, cafeController.readOneCafeInfo);

module.exports = router;