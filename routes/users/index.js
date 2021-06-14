const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');
const jwtMiddlewares = require('../../middlewares/middlewares');

router.post('/signup', userController.signup);
router.put('/nickName', jwtMiddlewares.userJwt, userController.nickNameChange);
router.delete('/userDelete', jwtMiddlewares.userJwt, userController.deleteUser);
router.put('/refreshToken', jwtMiddlewares.refreshToken);

module.exports = router;
