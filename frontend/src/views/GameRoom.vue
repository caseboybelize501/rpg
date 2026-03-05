<template>
  <div class="game-room">
    <h1>Game Room: {{ roomId }}</h1>
    
    <div class="game-content">
      <div class="scene">
        <h2>Current Scene</h2>
        <p>{{ scene }}</p>
      </div>
      
      <div class="chat">
        <h2>Chat</h2>
        <div class="messages" ref="messagesContainer">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            <strong>{{ msg.sender }}:</strong> {{ msg.text }}
          </div>
        </div>
        
        <div class="input-area">
          <input v-model="userInput" @keyup.enter="sendAction" placeholder="Enter your action..." />
          <button @click="sendAction">Send</button>
        </div>
      </div>
      
      <div class="stats">
        <h2>Party Stats</h2>
        <div v-for="player in players" :key="player.id" class="player-stats">
          <h3>{{ player.name }} ({{ player.class }})</h3>
          <p>HP: {{ player.hp }}/{{ player.max_hp }}</p>
          <p>Attack: {{ player.stats.attack }}</p>
          <p>Defense: {{ player.stats.defense }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'GameRoom',
  data() {
    return {
      roomId: this.$route.params.roomId,
      socket: null,
      scene: '',
      messages: [],
      players: [],
      userInput: ''
    };
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    
    this.socket.emit('player:join', {
      room_id: this.roomId,
      character_id: this.$route.params.characterId
    });
    
    this.socket.on('game:state', (data) => {
      this.scene = data.scene;
      this.players = data.players;
      this.messages = data.history || [];
    });
    
    this.socket.on('dm:response', (data) => {
      this.scene = data.scene;
      this.players = data.players;
      this.messages.push({ sender: 'DM', text: data.text });
      this.scrollToBottom();
    });
  },
  methods: {
    sendAction() {
      if (this.userInput.trim()) {
        this.socket.emit('player:action', {
          room_id: this.roomId,
          player_id: this.$route.params.characterId,
          text: this.userInput
        });
        this.userInput = '';
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
.game-room {
  padding: 20px;
}

.game-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.scene, .chat, .stats {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
}

.messages {
  height: 300px;
  overflow-y: auto;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
}

.input-area {
  display: flex;
}

.input-area input {
  flex: 1;
  padding: 8px;
}

.input-area button {
  padding: 8px 15px;
  margin-left: 10px;
}
</style>