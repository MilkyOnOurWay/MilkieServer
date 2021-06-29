const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middlewares/middlewares');
const socialController = require('../../controller/socialController');

router.post('/login', socialController.socialLogin);
router.post('/signup', socialController.socialSignup);
router.get('/refresh', jwtMiddleware.userJwt, socialController.giveRefreshToken);

module.exports = router;