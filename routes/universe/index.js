const express = require('express');
const router = express.Router();
const universeController = require('../../controller/universeController');
const jwtMiddlewares = require('../../middlewares/middlewares');

router.post('/universeOn', jwtMiddlewares.userJwt, universeController.universeOn);
router.delete('/:cafeId', jwtMiddlewares.userJwt, universeController.universeOff);
router.get('/universeHome', jwtMiddlewares.userJwt, universeController.universeHome);

module.exports = router;