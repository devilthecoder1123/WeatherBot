# Telegram Weather Bot

A simple Telegram bot that provides weather updates with an admin panel for management.

## Features

### Bot Features
- Subscribe/unsubscribe to daily weather updates
- Get current weather for any city
- Daily weather notifications at 8 AM
- Simple command interface

### Admin Panel Features
- Dashboard with user statistics
- User management (view, block, delete users)
- Bot settings configuration
- Message template customization

## Setup Instructions

### 1. Get Bot Token
1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token

### 2. Get Weather API Key
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file:
```
BOT_TOKEN=your_bot_token_here
WEATHER_API_KEY=your_weather_api_key_here
```

### 5. Start the Application

Start the admin panel:
```bash
npm run dev
```

Start the API server:
```bash
npm run server
```

Start the bot:
```bash
npm run bot
```

## Bot Commands

- `/start` - Start the bot and see welcome message
- `/subscribe` - Subscribe to daily weather updates
- `/unsubscribe` - Unsubscribe from updates
- `/weather [city]` - Get current weather for a city
- `/help` - Show help message

## Admin Panel

Access the admin panel at `http://localhost:5173`

### Dashboard
- View total users, subscribed users, active users
- Quick setup guide

### User Management
- View all users
- Search and filter users
- Block/unblock users
- Delete users

### Bot Settings
- Configure bot token and weather API key
- Customize message templates
- Set notification time
- Enable/disable notifications

## Database

The bot uses SQLite database (`weather_bot.db`) to store:
- User information
- Subscription status
- Bot settings

## API Endpoints

- `GET /api/stats` - Get dashboard statistics
- `GET /api/users` - Get all users
- `POST /api/users/:chatId/block` - Block a user
- `POST /api/users/:chatId/unblock` - Unblock a user
- `DELETE /api/users/:chatId` - Delete a user
- `GET /api/settings` - Get bot settings
- `PUT /api/settings` - Update bot settings

## Deployment

### Bot Deployment
1. Deploy the bot code to any Node.js hosting service
2. Set environment variables
3. Keep the bot running 24/7

### Admin Panel Deployment
1. Build the admin panel: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Update API endpoints in the frontend code

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Bot**: node-telegram-bot-api
- **Database**: SQLite
- **Weather API**: OpenWeatherMap

## License

MIT License