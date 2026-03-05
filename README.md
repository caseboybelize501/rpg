# RPG Engine - AI Dungeon Master

A multiplayer text-based RPG where LLaMA.cpp acts as the dungeon master.

## Features

- Multiplayer text-based RPG experience
- AI-powered dungeon master using LLaMA.cpp
- Dynamic story generation and session history
- Character management with stats and inventory
- Real-time chat and combat resolution

## Architecture


┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Client    │    │   Server     │    │   LLaMA      │
│ (Vue.js)    │───▶│ (Node.js)    │───▶│ (AI Engine)  │
└─────────────┘    └──────────────┘    └──────────────┘
                        │
                        ▼
              ┌──────────────┐
              │   Redis      │
              │ (Session)    │
              └──────────────┘
                        │
                        ▼
              ┌──────────────┐
              │ PostgreSQL   │
              │ (Characters) │
              └──────────────┘


## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start Redis and PostgreSQL services
4. Configure environment variables in `.env`
5. Run the server: `npm start`

## Environment Variables

Create a `.env` file with:


PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rpg
DB_USER=postgres
DB_PASSWORD=password


## API Endpoints

- `POST /api/character` - Create a new character
- `GET /api/character/:id` - Load a character
- `PUT /api/character/:id` - Save a character

## Socket Events

- `player:join` - Join a room
- `player:action` - Send player action
- `dm:response` - Receive DM response
- `game:state` - Broadcast game state
- `character:save` - Save character to database

## Game State Schema (Redis)


{
  "room_id": "string",
  "players": [
    {
      "id": "string",
      "name": "string",
      "class": "string",
      "hp": "number",
      "max_hp": "number",
      "inventory": "array",
      "stats": "object"
    }
  ],
  "scene": "string",
  "history": [
    {
      "text": "string",
      "timestamp": "number"
    }
  ],
  "turn": "string"
}


## AI Prompt Pattern


You are a dungeon master running a D&D-style adventure.
Current scene: [SCENE]. Player [NAME] the [CLASS] says: [ACTION].
Party state: [PARTY_JSON]. Last 5 events: [HISTORY].
Respond as DM: describe what happens, update any stats changed,
present the next decision. Keep response under 200 words.


## License

MIT