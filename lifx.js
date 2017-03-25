var LifxClient = require('node-lifx').Client;
var lifx = new LifxClient();

lifx.init();


var roomMap = [];

lifx.on('light-new', function(light) {
    light.getState(function(err, info) {
        if(!info) {return;}
        var lightLabel = info.label;
        var roomName = lightLabel.substring(0, lightLabel.lastIndexOf(' '));
        var containsRoom = false;
        roomMap.forEach(function(room) {
            if(room.display === roomName) {
                containsRoom = true;
                room.lights.push(light);
                return false;
            }
        });
        if(!containsRoom) {
            roomMap.push({
                room: roomName.toLowerCase().replace(' ', '_'),
                display: roomName,
                lights: [light]
            });
        }
    });
});

// roomMap = [
//     {room: 'kitchen',  display: 'Kitchen', lights: [{}, {}]},
//     {room: 'bedroom',  display: 'Bedroom', lights: [{}, {}]},
//     {room: 'living_room',  display: 'Living Room', lights: [{}, {}]},
//     {room: 'office',  display: 'Office', lights: [{}, {}]}
// ];

module.exports = roomMap;