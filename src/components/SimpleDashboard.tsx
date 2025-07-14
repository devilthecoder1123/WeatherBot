import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Ban,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const SimpleDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    subscribedUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);

      // First check if server is running
      const healthResponse = await fetch("http://localhost:3001/api/health");
      if (!healthResponse.ok) {
        throw new Error("Server is not responding");
      }

      // Then fetch stats
      const response = await fetch("http://localhost:3001/api/stats");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch stats"
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Subscribed Users",
      value: stats.subscribedUsers,
      icon: MessageSquare,
      color: "bg-green-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: Ban,
      color: "bg-red-500",
    },
  ];

  if (loading && !lastUpdated) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your Telegram Weather Bot
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <p className="text-red-800 font-medium">Connection Error</p>
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              Make sure the API server is running: <code>npm run server</code>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? (
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Setup Guide */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Setup Guide
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">1. Get Bot Token</h3>
              <p className="text-blue-700 text-sm mt-1">
                Message @BotFather on Telegram and create a new bot to get your
                token
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">
                2. Get Weather API Key
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Sign up at openweathermap.org and get your free API key
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">
                3. Configure Settings
              </h3>
              <p className="text-purple-700 text-sm mt-1">
                Go to Bot Settings tab and add your tokens
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">
                4. Start the Bot
              </h3>
              <p className="text-orange-700 text-sm mt-1">
                Run "npm run bot" to start your weather bot
              </p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                error ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    error ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-gray-900 font-medium">API Server</span>
              </div>
              <span
                className={`font-semibold ${
                  error ? "text-red-600" : "text-green-600"
                }`}
              >
                {error ? "Offline" : "Online"}
              </span>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium">Database</span>
              </div>
              <span className="text-blue-600 font-semibold">Connected</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium">Bot Status</span>
              </div>
              <span className="text-gray-600 font-semibold">
                Check Bot Logs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>API URL: http://localhost:3001/api/stats</p>
            <p>Last fetch: {lastUpdated?.toISOString() || "Never"}</p>
            <p>Error: {error || "None"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDashboard;
