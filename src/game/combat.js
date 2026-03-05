const rollDice = (sides) => {
  return Math.floor(Math.random() * sides) + 1;
};

const calculateDamage = (attacker, defender) => {
  // Simple damage calculation
  const baseDamage = rollDice(6) + attacker.stats.attack;
  const defense = defender.stats.defense || 0;
  
  return Math.max(1, baseDamage - defense);
};

const resolveCombat = (attackerId, defenderId, gameState) => {
  const attacker = gameState.players.find(p => p.id === attackerId);
  const defender = gameState.players.find(p => p.id === defenderId);
  
  if (!attacker || !defender) {
    throw new Error('Player not found');
  }
  
  const damage = calculateDamage(attacker, defender);
  
  // Update defender's HP
  defender.hp -= damage;
  
  if (defender.hp <= 0) {
    defender.hp = 0;
    return `${defender.name} has been defeated!`;
  }
  
  return `${attacker.name} deals ${damage} damage to ${defender.name}. ${defender.name} now has ${defender.hp} HP.`;
};

module.exports = {
  resolveCombat,
  rollDice
};