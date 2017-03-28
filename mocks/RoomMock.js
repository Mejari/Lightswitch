var createMockLight = function (lightIndex, roomId) {
    return {
        on: function () {
            console.log('Turn on light ' + lightIndex + ' in room ' + roomId);
        },
        off: function () {
            console.log('Turn off light ' + lightIndex + ' in room ' + roomId);
        },
        power: 0
    };
};

var createMockRoom = function (roomId, roomDisplay, state, numLights) {
    var room = {
        room: roomId,
        display: roomDisplay,
        state: state,
        lights: []
    };
    for (var i = 1; i <= numLights; i++) {
        room.lights.push(createMockLight(i, roomId));
    }
    return room;
};

var rooms = [
    createMockRoom('kitchen', 'Kitchen', 'mixed', 2),
    createMockRoom('bedroom', 'Bedroom', 'off', 4),
    createMockRoom('living_room', 'Living Room', 'mixed', 3),
    createMockRoom('office', 'Office', 'off', 1)
];

module.exports = {
    rooms: rooms,
    changeRandomRoomState: function () {
        var newState;
        switch (Math.floor(Math.random() * 3)) {
            case 1:
                newState = 'on';
                break;
            case 2:
                newState = 'off';
                break;
            case 3:
            default:
                newState = 'mixed';
                break;
        }
        var changedRoom = rooms[Math.floor(Math.random() * rooms.length)];
        changedRoom.state = newState;
        return changedRoom;
    }
};