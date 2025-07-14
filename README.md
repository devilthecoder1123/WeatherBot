<div align="center">

# 🌤️ PK Weather Bot

**A modern, feature-rich Telegram bot that provides daily weather updates with a powerful admin dashboard**


</div>



## ✨ Features

### 🤖 **Bot Features**
- 📱 **Easy Subscription Management** - Users can subscribe/unsubscribe with simple commands
- 🌍 **Real-time Weather Data** - Get current weather for any city worldwide
- ⏰ **Daily Notifications** - Automated weather updates at customizable times
- 🎯 **Smart City Recognition** - Handles city names without commands
- 🔒 **User Management** - Block/unblock functionality for admins

---

## 🎯 Demo

### Bot Interface
```
🌤️ Welcome to PK Weather Bot (@pkweather_bot)!

I can help you get daily weather updates for your location.

Available commands:
/subscribe - Subscribe to daily weather updates
/unsubscribe - Unsubscribe from updates
/weather [city] - Get current weather for a city
/help - Show this help message

Type /subscribe to get started!
```


## 🚀 Quick Start

```bash

# Clone the repository
git clone https://github.com/yourusername/weatherbot.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your tokens

# Start all services
npm run dev    # Admin panel (http://localhost:5173)
npm run server # API server (http://localhost:3001)
npm run bot    # Telegram bot
```

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)
- **OpenWeatherMap API Key** ([Get Free Key](https://openweathermap.org/api))

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weatherbot.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure your tokens** (edit `.env`)
   ```env
   BOT_TOKEN=your_bot_token_from_botfather
   WEATHER_API_KEY=your_openweathermap_api_key
   PORT=3001
   ```


## 🎮 Usage

### Starting the Application

```bash
# Terminal 1 - Start the admin panel
npm run dev

# Terminal 2 - Start the API server
npm run server

# Terminal 3 - Start the Telegram bot
npm run bot
```

### Accessing the Admin Panel

Open your browser and navigate to:
- **Local**: http://localhost:5173
- **Dashboard**: View user statistics and bot status
- **Users**: Manage all bot users
- **Settings**: Configure bot tokens and messages

---

## 🤖 Bot Commands

**Bot Handle**: [@pkweather_bot](https://t.me/pkweather_bot)

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Initialize the bot and show welcome message | `/start` |
| `/subscribe` | Subscribe to daily weather updates | `/subscribe` |
| `/unsubscribe` | Unsubscribe from weather notifications | `/unsubscribe` |
| `/weather [city]` | Get current weather for specified city | `/weather London` |
| `/help` | Display help message with all commands | `/help` |


---

## 📊 Admin Panel

### Dashboard
- 📈 **User Statistics**: Total, subscribed, active, and blocked users
- 🔄 **Real-time Updates**: Auto-refresh every 30 seconds
- 🚀 **Quick Setup Guide**: Step-by-step bot configuration
- 📊 **System Status**: Monitor bot and API health

### User Management
- 👥 **User List**: View all bot users with details
- 🔍 **Search & Filter**: Find users by name, username, or ID
- 🚫 **Block/Unblock**: Manage user access
- 🗑️ **Delete Users**: Remove users from database

---


## 🏗️ Architecture

```
pkweatherbot/
├── 📁 src/                    # React frontend
│   ├── 📁 components/         # React components
│   ├── 📄 App.tsx            # Main app component
│   └── 📄 main.tsx           # App entry point
├── 📁 server/                 # Node.js backend
│   ├── 📄 bot.js             # Telegram bot logic
│   ├── 📄 server.js          # Express API server
│   └── 📄 database.js        # SQLite database layer
├── 📄 package.json           # Dependencies
├── 📄 .env.example           # Environment template
└── 📄 README.md              # This file
```

### Tech Stack

**Frontend**
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🎯 Lucide React for icons
- 📱 Responsive design

**Backend**
- 🟢 Node.js with Express
- 🗄️ SQLite database
- 🤖 node-telegram-bot-api
- 🌤️ OpenWeatherMap API

---
</div>