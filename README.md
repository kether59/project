# Team Tools: Planning Poker & Team Wheel

A Vue.js application that combines Planning Poker for team estimations and a Team Wheel for random team member selection.

## Features

### Planning Poker
- Create estimation sessions for features
- Join sessions with persistent player identity (cookie-based)
- Vote on features using standard planning poker values
- View voting history
- Real-time vote reveals

### Team Wheel
- Add and remove team members
- Spin wheel animation for random selection
- Confetti celebration on selection
- Persistent team member list

## Running Locally with Docker

1. Make sure you have Docker and Docker Compose installed

2. Build and start the container:
```bash
docker-compose up --build
```

3. Access the application at `http://localhost:5173`

## Development without Docker

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Technologies Used
- Vue 3
- Vite
- Pinia (State Management)
- Vue Router
- TailwindCSS
- Canvas Confetti