var express = require('express');
var router = express.Router();
var lifx = require('../lifx');
var io = require('../io')();

var getOppositeState = function (currentState) {
    return currentState === 'off' ? 'on' : 'off';
};

router.get('/:room_id', function (req, res) {
    var roomId = req.params.room_id;
    lifx.getRoom(roomId, function (room) {
        res.json({
            room: roomId,
            display: room.display,
            lights: room.lights.length,
            state: room.state
        });
    });
});

var setRoomState = function (roomId, state) {
    lifx.getRoom(roomId, function (room) {
        room.lights.forEach(function (light) {
            if (state === 'on') {
                light.on();
            } else {
                light.off();
            }
        });
        room.state = state;
        io.sockets.emit('light-updated', {
            room: roomId,
            display: room.display,
            state: room.state
        });
    });
};

router.get("/:room_id/on", function (req, res) {
    var roomId = req.params.room_id;
    setRoomState(roomId, 'on');
    res.end();
});

router.get("/:room_id/off", function (req, res) {
    var roomId = req.params.room_id;
    setRoomState(roomId, 'on');
    res.end();
});

router.get('/:room_id/toggle', function (req, res) {
    var roomId = req.params.room_id;
    lifx.getRoom(roomId, function (room) {
        setRoomState(roomId, getOppositeState(room.state));
    });
    res.end();
});

module.exports = router;
