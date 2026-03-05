const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getRoomState = async (roomId) => {
  try {
    const state = await client.get(`room:${roomId}`);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error getting room state:', error);
    throw error;
  }
};

const updateRoomState = async (roomId, data) => {
  try {
    const currentState = await getRoomState(roomId);
    const newState = { ...currentState, ...data };
    await client.set(`room:${roomId}`, JSON.stringify(newState));
    return newState;
  } catch (error) {
    console.error('Error updating room state:', error);
    throw error;
  }
};

const setRoomState = async (roomId, data) => {
  try {
    await client.set(`room:${roomId}`, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error setting room state:', error);
    throw error;
  }
};

module.exports = {
  getRoomState,
  updateRoomState,
  setRoomState
};