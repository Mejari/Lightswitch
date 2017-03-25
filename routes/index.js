var express = require('express');
var router = express.Router();
var roomMap = require('../lifx');

/* GET home page. */
router.get('/', function (req, res, next) {


    res.render('index', {
        title: 'LightSwitch',
        roomMap: roomMap
    });

});

module.exports = router;
