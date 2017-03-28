var LifxClient = require('node-lifx').Client;
var lifx = new LifxClient();
var CronJob = require('cron').CronJob;
var mocks = require('./mocks/RoomMock');
var io = require('./io')();

lifx.init();

var roomMap = [];

var calculateNewRoomState = function (room, newLightState) {
    var allOn = false, allOff = false;
    room.lights.forEach(function (light) {
        if (light.power === 'off') {
            allOn = false;
        } else {
            allOff = false;
        }
    });

    if (allOn) {
        return newLightState === 'on' ? 'on' : 'mixed';
    } else if (allOff) {
        return newLightState === 'off' ? 'off' : 'mixed';
    } else if (room.lights.length === 0) {
        return newLightState;
    }
    return 'mixed';

};

var refreshLightState = function (light) {
    light.getState(function (err, info) {
        if (!info) {
            return;
        }
        var lightLabel = info.label;
        var roomName = lightLabel.substring(0, lightLabel.lastIndexOf(' '));
        var lightState = light.power === 0 ? 'off' : 'on';
        var containsRoom = false;
        roomMap.forEach(function (room) {
            if (room.display === roomName) {
                containsRoom = true;
                room.lights.push(light);
                room.state = calculateNewRoomState(room, lightState);
                io.sockets.emit('light-updated', {
                    room: room.room,
                    display: room.display,
                    state: room.state
                });
                return false;
            }
        });
        if (!containsRoom) {
            roomMap.push({
                room: roomName.toLowerCase().replace(' ', '_'),
                display: roomName,
                lights: [light],
                state: lightState
            });
        }
    });
};

var refreshAllLightStates = function () {
    if (useMock) {
        roomMap = mocks.rooms;
        var changedRoom = mocks.changeRandomRoomState();
        io.sockets.emit('light-updated', {
            room: changedRoom.room,
            display: changedRoom.display,
            state: changedRoom.state
        });
        return;
    }
    roomMap = [];

    var lights = lifx.lights() || [];
    lights.forEach(refreshLightState);
};

new CronJob('*/10 * * * * *', refreshAllLightStates, null, true, 'America/Los_Angeles');

var useMock = true;
if (useMock) {
    roomMap = mocks.rooms;
}

lifx.on('light-new', refreshLightState);


module.exports = {
    getRoomMap: function () {
        return roomMap;
    },
    getRoom: function (roomId, callback) {
        roomMap.forEach(function (room) {
            if (roomId === room.room) {
                callback(room);
                return false;
            }
        });
    }
};