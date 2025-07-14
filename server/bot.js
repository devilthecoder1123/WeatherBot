import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { Database } from "./database.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const db = new Database();

// Initialize database first
await db.init();

// Function to get settings from database or environment
async function getSettings() {
  try {
    const dbSettings = await db.getBotSettings();

    return {
      botToken: dbSettings?.botToken || process.env.BOT_TOKEN,
      weatherApiKey: dbSettings?.weatherApiKey || process.env.WEATHER_API_KEY,
    };
  } catch (error) {
    console.error(
      "Error getting settings from database, using environment variables:",
      error
    );
    return {
      botToken: process.env.BOT_TOKEN,
      weatherApiKey: process.env.WEATHER_API_KEY,
    };
  }
}

// Get configuration
const settings = await getSettings();
const BOT_TOKEN = settings.botToken;
const WEATHER_API_KEY = settings.weatherApiKey;

// Check if tokens are available
if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is not set in .env file or database");
  console.error("Please either:");
  console.error("1. Add BOT_TOKEN to your .env file, OR");
  console.error("2. Configure it in the admin panel Bot Settings");
  process.exit(1);
}

if (!WEATHER_API_KEY) {
  console.error("❌ WEATHER_API_KEY is not set in .env file or database");
  console.error("Please either:");
  console.error("1. Add WEATHER_API_KEY to your .env file, OR");
  console.error("2. Configure it in the admin panel Bot Settings");
  process.exit(1);
}

console.log("✅ Bot token loaded:", BOT_TOKEN.substring(0, 10) + "...");
console.log(
  "✅ Weather API key loaded:",
  WEATHER_API_KEY.substring(0, 10) + "..."
);

// Validate bot token format
if (!BOT_TOKEN.match(/^\d+:[A-Za-z0-9_-]+$/)) {
  console.error("❌ Invalid bot token format!");
  console.error(
    "Bot token should look like: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk"
  );
  console.error("Please check your bot token from @BotFather");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Error handling for bot
bot.on("error", (error) => {
  console.error("❌ Bot error:", error);
});

bot.on("polling_error", (error) => {
  console.error("❌ Polling error:", error);
  if (error.code === "ETELEGRAM" && error.message.includes("404")) {
    console.error("");
    console.error("🔥 TELEGRAM BOT TOKEN ERROR:");
    console.error("The bot token is invalid or the bot doesn't exist.");
    console.error("");
    console.error("To fix this:");
    console.error("1. Go to @BotFather on Telegram");
    console.error("2. Send /mybots");
    console.error("3. Select your bot");
    console.error('4. Go to "API Token"');
    console.error("5. Copy the token and update it in:");
    console.error("   - Your .env file, OR");
    console.error("   - The admin panel Bot Settings");
    console.error("");
    console.error(
      "Current token being used:",
      BOT_TOKEN.substring(0, 10) + "..."
    );
    console.error("");
  }
});

// Bot commands
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  console.log(`📱 User ${user.first_name} started the bot`);

  // Save user to database
  await db.addUser({
    chatId: chatId.toString(),
    firstName: user.first_name || "",
    lastName: user.last_name || "",
    username: user.username || "",
    isSubscribed: false,
  });

  // Get welcome message from database or use default
  const dbSettings = await db.getBotSettings();
  const welcomeMessage =
    dbSettings?.welcomeMessage ||
    `
🌤️ Welcome to Weather Bot!

I can help you get daily weather updates for your location.

Available commands:
/subscribe - Subscribe to daily weather updates
/unsubscribe - Unsubscribe from updates
/weather [city] - Get current weather for a city
/help - Show this help message

Type /subscribe to get started!
  `;

  bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;

  console.log(`📱 User ${msg.from.first_name} subscribed`);

  await db.updateUserSubscription(chatId.toString(), true);

  // Get subscribe message from database or use default
  const dbSettings = await db.getBotSettings();
  const subscribeMessage =
    dbSettings?.subscribeMessage ||
    `
🎉 You have successfully subscribed to daily weather updates!

You will receive weather information every morning at 8:00 AM.

To set your location, send me your city name or use /weather [city name]
  `;

  bot.sendMessage(chatId, subscribeMessage);
});

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;

  console.log(`📱 User ${msg.from.first_name} unsubscribed`);

  await db.updateUserSubscription(chatId.toString(), false);

  // Get unsubscribe message from database or use default
  const dbSettings = await db.getBotSettings();
  const unsubscribeMessage =
    dbSettings?.unsubscribeMessage ||
    `
😢 You have been unsubscribed from weather updates.

Type /subscribe anytime to get back on track!
  `;

  bot.sendMessage(chatId, unsubscribeMessage);
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];

  console.log(`📱 User ${msg.from.first_name} requested weather for ${city}`);

  try {
    const weather = await getWeatherData(city);
    const weatherMessage = formatWeatherMessage(weather, city);
    bot.sendMessage(chatId, weatherMessage);
  } catch (error) {
    console.error("Weather API error:", error);
    bot.sendMessage(
      chatId,
      `❌ Sorry, I couldn't get weather data for "${city}". Please check the city name and try again.`
    );
  }
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  console.log(`📱 User ${msg.from.first_name} requested help`);

  const helpMessage = `
🤖 Weather Bot Help

Available commands:
/start - Start the bot
/subscribe - Subscribe to daily weather updates
/unsubscribe - Unsubscribe from updates
/weather [city] - Get current weather for a city
/help - Show this help message

Example: /weather London
  `;

  bot.sendMessage(chatId, helpMessage);
});

// Handle any text message that doesn't match commands
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip if it's a command we already handle
  if (text && text.startsWith("/")) {
    // Check if it's an unknown command
    const knownCommands = [
      "/start",
      "/subscribe",
      "/unsubscribe",
      "/weather",
      "/help",
    ];
    const isKnownCommand = knownCommands.some((cmd) => text.startsWith(cmd));

    if (!isKnownCommand) {
      bot.sendMessage(
        chatId,
        `
❌ Unknown command: ${text}

Available commands:
/start - Start the bot
/subscribe - Subscribe to daily weather updates
/unsubscribe - Unsubscribe from updates
/weather [city] - Get current weather for a city
/help - Show this help message
      `
      );
    }
  } else if (text && !text.startsWith("/")) {
    // If user sends a city name without /weather command
    handleCityWeather(chatId, text);
  }
});

// Handle city name as weather request
async function handleCityWeather(chatId, city) {
  try {
    console.log(`📱 User requested weather for ${city} (without command)`);
    const weather = await getWeatherData(city);
    const weatherMessage = formatWeatherMessage(weather, city);
    bot.sendMessage(chatId, weatherMessage);
  } catch (error) {
    bot.sendMessage(
      chatId,
      `
❌ I couldn't find weather for "${city}". 

Try using: /weather ${city}

Or use /help to see all available commands.
    `
    );
  }
}

// Get weather data from OpenWeatherMap API
async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
}

// Format weather message
function formatWeatherMessage(weather, city) {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0].description;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;

  const emoji = getWeatherEmoji(weather.weather[0].main);

  return `
${emoji} Weather in ${city}

🌡️ Temperature: ${temp}°C (feels like ${feelsLike}°C)
📝 Description: ${description}
💧 Humidity: ${humidity}%
💨 Wind Speed: ${windSpeed} m/s
  `;
}

// Get weather emoji based on condition
function getWeatherEmoji(condition) {
  const emojiMap = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };

  return emojiMap[condition] || "🌤️";
}

// Send daily weather updates
async function sendDailyUpdates() {
  const subscribedUsers = await db.getSubscribedUsers();

  console.log(`📅 Sending daily updates to ${subscribedUsers.length} users`);

  for (const user of subscribedUsers) {
    try {
      // Use default city or user's saved location
      const city = user.location || "New York";
      const weather = await getWeatherData(city);
      const message = `🌅 Good morning! Here's your daily weather update:\n\n${formatWeatherMessage(
        weather,
        city
      )}`;

      bot.sendMessage(user.chatId, message);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Rate limiting
    } catch (error) {
      console.error(
        `Failed to send weather update to user ${user.chatId}:`,
        error
      );
    }
  }
}

// Schedule daily updates (8 AM)
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 8 && now.getMinutes() === 0) {
    sendDailyUpdates();
  }
}, 60000); // Check every minute

console.log("🤖 Weather Bot is running...");
console.log("✅ Bot is ready to receive messages!");
