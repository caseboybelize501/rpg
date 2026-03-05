const stateManager = require('./stateManager');

const rooms = new Map();

const joinRoom = async (socketId, roomId, characterId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      players: [],
      socketIds: []
    });
  }

  const room = rooms.get(roomId);
  
  // Add player to room
  room.players.push({ id: characterId });
  room.socketIds.push(socketId);
  
  // Update Redis state
  await stateManager.updateRoomState(roomId, {
    players: room.players
  });
};

const leaveRoom = async (socketId) => {
  for (const [roomId, room] of rooms.entries()) {
    const index = room.socketIds.indexOf(socketId);
    if (index !== -1) {
      // Remove player from room
      room.players.splice(index, 1);
      room.socketIds.splice(index, 1);
      
      // Update Redis state
      await stateManager.updateRoomState(roomId, {
        players: room.players
      });
      
      break;
    }
  }
};

module.exports = {
  joinRoom,
  leaveRoom
};