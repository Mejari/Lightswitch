var express = require('express');
var router = express.Router();
var rooms = require('../lifx');

var getRoomById = function (roomId, callback) {
    rooms.forEach(function (room) {
        if (roomId === room.room) {
            callback(room);
            return false;
        }
    });
};

/* GET users listing. */
router.get('/:room_id', function (req, res) {
    var roomId = req.params.room_id;
    getRoomById(roomId, function (room) {
        res.json({
            display: room.display,
            lights: room.lights.length
        });
    });
});

router.get('/:room_id/toggle', function (req, res) {
    var roomId = req.params.room_id;
    getRoomById(roomId, function(room) {
        room.lights.forEach(function(light) {
            light.getState(function(err, state) {
                if(state.power === 0) {
                    light.on();
                } else {
                    light.off();
                }
            });
        });
    });
});

module.exports = router;
