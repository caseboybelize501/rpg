<template>
  <div class="character-create">
    <h1>Create Character</h1>
    
    <form @submit.prevent="createCharacter">
      <div>
        <label for="name">Name:</label>
        <input id="name" v-model="character.name" type="text" required />
      </div>
      
      <div>
        <label for="class">Class:</label>
        <select id="class" v-model="character.class" required>
          <option value="Warrior">Warrior</option>
          <option value="Mage">Mage</option>
          <option value="Rogue">Rogue</option>
          <option value="Cleric">Cleric</option>
        </select>
      </div>
      
      <div>
        <label for="attack">Attack:</label>
        <input id="attack" v-model.number="character.stats.attack" type="number" min="1" />
      </div>
      
      <div>
        <label for="defense">Defense:</label>
        <input id="defense" v-model.number="character.stats.defense" type="number" min="0" />
      </div>
      
      <button type="submit">Create Character</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CharacterCreate',
  data() {
    return {
      character: {
        name: '',
        class: 'Warrior',
        stats: {
          attack: 1,
          defense: 0
        },
        inventory: []
      }
    };
  },
  methods: {
    async createCharacter() {
      try {
        const response = await axios.post('/api/character', this.character);
        alert('Character created successfully!');
        this.$router.push(`/game/${response.data.id}`);
      } catch (error) {
        console.error('Error creating character:', error);
        alert('Failed to create character');
      }
    }
  }
};
</script>

<style scoped>
.character-create {
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>