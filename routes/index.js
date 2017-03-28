var express = require('express');
var router = express.Router();
var lifx = require('../lifx');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'LightSwitch',
        roomMap: lifx.getRoomMap()
    });

});

module.exports = router;
