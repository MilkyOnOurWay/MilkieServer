var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', require('./users'));
router.use('/report', require('./report'));
router.use('/universe', require('./universe'));
router.use('/cafe', require('./cafe'));
router.use('/home', require('./home'));
router.use('/search', require('./search'));
router.use('/admin', require('./admin'));

module.exports = router;