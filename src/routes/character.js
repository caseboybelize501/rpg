const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// Create character
router.post('/', async (req, res) => {
  try {
    const { name, class: charClass, stats, inventory } = req.body;
    
    const character = await Character.create({
      name,
      class: charClass,
      stats,
      inventory
    });
    
    res.json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Load character
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findByPk(req.params.id);
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Error loading character:', error);
    res.status(500).json({ error: 'Failed to load character' });
  }
});

// Save character
router.put('/:id', async (req, res) => {
  try {
    const { name, class: charClass, hp, max_hp, stats, inventory } = req.body;
    
    const [updated] = await Character.update({
      name,
      class: charClass,
      hp,
      max_hp,
      stats,
      inventory
    }, {
      where: { id: req.params.id }
    });
    
    if (updated) {
      const updatedCharacter = await Character.findByPk(req.params.id);
      res.json(updatedCharacter);
    } else {
      res.status(404).json({ error: 'Character not found' });
    }
  } catch (error) {
    console.error('Error saving character:', error);
    res.status(500).json({ error: 'Failed to save character' });
  }
});

module.exports = router;