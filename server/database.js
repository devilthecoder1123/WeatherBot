import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class Database {
  constructor() {
    this.db = new sqlite3.Database('./weather_bot.db');
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async init() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chatId TEXT UNIQUE NOT NULL,
        firstName TEXT,
        lastName TEXT,
        username TEXT,
        isSubscribed BOOLEAN DEFAULT 0,
        location TEXT,
        joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
        isBlocked BOOLEAN DEFAULT 0
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS bot_settings (
        id INTEGER PRIMARY KEY,
        botToken TEXT,
        weatherApiKey TEXT,
        welcomeMessage TEXT,
        subscribeMessage TEXT,
        unsubscribeMessage TEXT,
        notificationTime TEXT DEFAULT '08:00',
        enableNotifications BOOLEAN DEFAULT 1
      )
    `);

    // Insert default settings if not exists
    const settings = await this.get('SELECT * FROM bot_settings WHERE id = 1');
    if (!settings) {
      await this.run(`
        INSERT INTO bot_settings (id, welcomeMessage, subscribeMessage, unsubscribeMessage)
        VALUES (1, 
          'Welcome to Weather Bot! 🌤️\n\nI can help you get daily weather updates for your location. Type /subscribe to get started!',
          'You have successfully subscribed to daily weather updates! 🎉\n\nYou will receive weather information every morning at 8:00 AM.',
          'You have been unsubscribed from weather updates. 😢\n\nType /subscribe anytime to get back on track!'
        )
      `);
    }
  }

  async addUser(user) {
    try {
      await this.run(`
        INSERT OR REPLACE INTO users (chatId, firstName, lastName, username, lastActive)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [user.chatId, user.firstName, user.lastName, user.username]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async updateUserSubscription(chatId, isSubscribed) {
    await this.run(`
      UPDATE users SET isSubscribed = ?, lastActive = CURRENT_TIMESTAMP
      WHERE chatId = ?
    `, [isSubscribed ? 1 : 0, chatId]);
  }

  async getSubscribedUsers() {
    return await this.all(`
      SELECT * FROM users WHERE isSubscribed = 1 AND isBlocked = 0
    `);
  }

  async getAllUsers() {
    return await this.all(`
      SELECT *, 
        CASE 
          WHEN datetime(lastActive) > datetime('now', '-1 day') THEN 'active'
          WHEN datetime(lastActive) > datetime('now', '-7 days') THEN 'inactive'
          ELSE 'dormant'
        END as status
      FROM users 
      ORDER BY lastActive DESC
    `);
  }

  async blockUser(chatId) {
    await this.run('UPDATE users SET isBlocked = 1 WHERE chatId = ?', [chatId]);
  }

  async unblockUser(chatId) {
    await this.run('UPDATE users SET isBlocked = 0 WHERE chatId = ?', [chatId]);
  }

  async deleteUser(chatId) {
    await this.run('DELETE FROM users WHERE chatId = ?', [chatId]);
  }

  async getStats() {
    const totalUsers = await this.get('SELECT COUNT(*) as count FROM users');
    const subscribedUsers = await this.get('SELECT COUNT(*) as count FROM users WHERE isSubscribed = 1');
    const activeUsers = await this.get(`
      SELECT COUNT(*) as count FROM users 
      WHERE datetime(lastActive) > datetime('now', '-1 day')
    `);
    const blockedUsers = await this.get('SELECT COUNT(*) as count FROM users WHERE isBlocked = 1');

    return {
      totalUsers: totalUsers.count,
      subscribedUsers: subscribedUsers.count,
      activeUsers: activeUsers.count,
      blockedUsers: blockedUsers.count
    };
  }

  async getBotSettings() {
    return await this.get('SELECT * FROM bot_settings WHERE id = 1');
  }

  async updateBotSettings(settings) {
    await this.run(`
      UPDATE bot_settings SET 
        botToken = ?, weatherApiKey = ?, welcomeMessage = ?, 
        subscribeMessage = ?, unsubscribeMessage = ?, 
        notificationTime = ?, enableNotifications = ?
      WHERE id = 1
    `, [
      settings.botToken, settings.weatherApiKey, settings.welcomeMessage,
      settings.subscribeMessage, settings.unsubscribeMessage,
      settings.notificationTime, settings.enableNotifications ? 1 : 0
    ]);
  }
}