import React, { useState, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface BotSettings {
  botToken: string;
  weatherApiKey: string;
  welcomeMessage: string;
  subscribeMessage: string;
  unsubscribeMessage: string;
  notificationTime: string;
  enableNotifications: boolean;
}

const SimpleBotSettings: React.FC = () => {
  const [settings, setSettings] = useState<BotSettings>({
    botToken: "",
    weatherApiKey: "",
    welcomeMessage:
      "Welcome to Weather Bot! 🌤️\n\nI can help you get daily weather updates for your location. Type /subscribe to get started!",
    subscribeMessage:
      "You have successfully subscribed to daily weather updates! 🎉\n\nYou will receive weather information every morning at 8:00 AM.",
    unsubscribeMessage:
      "You have been unsubscribed from weather updates. 😢\n\nType /subscribe anytime to get back on track!",
    notificationTime: "08:00",
    enableNotifications: true,
  });

  const [showBotToken, setShowBotToken] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/settings");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setSettings({
          botToken: data.botToken || "",
          weatherApiKey: data.weatherApiKey || "",
          welcomeMessage:
            data.welcomeMessage ||
            "Welcome to Weather Bot! 🌤️\n\nI can help you get daily weather updates for your location. Type /subscribe to get started!",
          subscribeMessage:
            data.subscribeMessage ||
            "You have successfully subscribed to daily weather updates! 🎉\n\nYou will receive weather information every morning at 8:00 AM.",
          unsubscribeMessage:
            data.unsubscribeMessage ||
            "You have been unsubscribed from weather updates. 😢\n\nType /subscribe anytime to get back on track!",
          notificationTime: data.notificationTime || "08:00",
          enableNotifications:
            data.enableNotifications === 1 || data.enableNotifications === true,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setErrorMessage(
        "Failed to load settings. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {
    if (!settings.botToken.trim()) {
      setErrorMessage("Bot Token is required");
      return false;
    }

    if (!settings.weatherApiKey.trim()) {
      setErrorMessage("Weather API Key is required");
      return false;
    }

    if (!settings.welcomeMessage.trim()) {
      setErrorMessage("Welcome Message is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      setSaveStatus("error");
      return;
    }

    try {
      setSaving(true);
      setSaveStatus("idle");
      setErrorMessage("");

      const response = await fetch("http://localhost:3001/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setErrorMessage(
        "Failed to save settings. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof BotSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error status when user starts typing
    if (saveStatus === "error") {
      setSaveStatus("idle");
      setErrorMessage("");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bot Settings</h1>
        <p className="text-gray-600 mt-2">Configure your Telegram bot</p>
      </div>

      {/* Status Messages */}
      {saveStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">Settings saved successfully!</span>
        </div>
      )}

      {saveStatus === "error" && errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* API Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            API Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Token (from @BotFather){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showBotToken ? "text" : "password"}
                  value={settings.botToken}
                  onChange={(e) =>
                    handleInputChange("botToken", e.target.value)
                  }
                  placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowBotToken(!showBotToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showBotToken ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Get this from @BotFather on Telegram
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weather API Key (from OpenWeatherMap){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.weatherApiKey}
                  onChange={(e) =>
                    handleInputChange("weatherApiKey", e.target.value)
                  }
                  placeholder="abcdef1234567890abcdef1234567890"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showApiKey ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Get this from{" "}
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  openweathermap.org
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Message Templates */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Message Templates
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={settings.welcomeMessage}
                onChange={(e) =>
                  handleInputChange("welcomeMessage", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter welcome message..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Message sent when users start the bot
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscribe Message
              </label>
              <textarea
                value={settings.subscribeMessage}
                onChange={(e) =>
                  handleInputChange("subscribeMessage", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subscribe confirmation message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unsubscribe Message
              </label>
              <textarea
                value={settings.unsubscribeMessage}
                onChange={(e) =>
                  handleInputChange("unsubscribeMessage", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter unsubscribe message..."
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Enable Daily Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Send weather updates to subscribed users
                </p>
              </div>
              <button
                onClick={() =>
                  handleInputChange(
                    "enableNotifications",
                    !settings.enableNotifications
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enableNotifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableNotifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Time
              </label>
              <input
                type="time"
                value={settings.notificationTime}
                onChange={(e) =>
                  handleInputChange("notificationTime", e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Time when daily weather updates will be sent
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={fetchSettings}
            disabled={loading || saving}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 ${
              saveStatus === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : saveStatus === "success" ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving
              ? "Saving..."
              : saveStatus === "success"
              ? "Saved!"
              : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleBotSettings;
