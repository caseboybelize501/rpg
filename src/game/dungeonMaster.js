const axios = require('axios');
const stateManager = require('./stateManager');

const generateResponse = async (roomId, playerId, action) => {
  try {
    const gameState = await stateManager.getRoomState(roomId);
    
    if (!gameState) {
      throw new Error('Room not found');
    }
    
    const player = gameState.players.find(p => p.id === playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Build prompt
    const prompt = buildPrompt(gameState, player, action);
    
    // Call LLaMA API
    const response = await axios.post('http://llama:8000/generate', {
      prompt,
      temperature: 0.85,
      max_tokens: 512
    });
    
    const aiResponse = response.data.response;
    
    // Update game state with new scene and history
    const updatedState = updateGameState(gameState, player, action, aiResponse);
    
    await stateManager.updateRoomState(roomId, updatedState);
    
    return {
      text: aiResponse,
      scene: updatedState.scene,
      players: updatedState.players
    };
  } catch (error) {
    console.error('Error generating DM response:', error);
    throw error;
  }
};

const buildPrompt = (gameState, player, action) => {
  const partyJson = JSON.stringify(gameState.players);
  
  const history = gameState.history ? gameState.history.slice(-5).map(h => h.text).join('\n') : 'No previous events.';
  
  return `You are a dungeon master running a D&D-style adventure.
Current scene: ${gameState.scene}. Player ${player.name} the ${player.class} says: ${action}.
Party state: ${partyJson}. Last 5 events: ${history}.
Respond as DM: describe what happens, update any stats changed,
present the next decision. Keep response under 200 words.`;
};

const updateGameState = (gameState, player, action, aiResponse) => {
  const newHistory = [...(gameState.history || []), 
    { text: `${player.name}: ${action}`, timestamp: Date.now() },
    { text: `DM: ${aiResponse}`, timestamp: Date.now() }
  ].slice(-10);
  
  return {
    ...gameState,
    history: newHistory,
    scene: aiResponse
  };
};

module.exports = {
  generateResponse
};