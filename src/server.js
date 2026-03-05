const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const roomManager = require('./game/roomManager');
const stateManager = require('./game/stateManager');
const dungeonMaster = require('./game/dungeonMaster');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('RPG Engine Server');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('player:join', async (data) => {
    try {
      const { room_id, character_id } = data;
      await roomManager.joinRoom(socket.id, room_id, character_id);
      socket.join(room_id);
      
      const gameState = await stateManager.getRoomState(room_id);
      io.to(room_id).emit('game:state', gameState);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Player action
  socket.on('player:action', async (data) => {
    try {
      const { room_id, player_id, text } = data;
      
      const response = await dungeonMaster.generateResponse(room_id, player_id, text);
      
      io.to(room_id).emit('dm:response', response);
    } catch (error) {
      console.error('Error processing action:', error);
      socket.emit('error', { message: 'Failed to process action' });
    }
  });

  // Save character
  socket.on('character:save', async (data) => {
    try {
      const { character } = data;
      await Character.save(character);
      socket.emit('character:saved', { success: true });
    } catch (error) {
      console.error('Error saving character:', error);
      socket.emit('error', { message: 'Failed to save character' });
    }
  });

  // Leave room
  socket.on('disconnect', async () => {
    try {
      await roomManager.leaveRoom(socket.id);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});