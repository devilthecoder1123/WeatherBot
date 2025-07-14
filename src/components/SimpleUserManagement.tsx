import React, { useState, useEffect } from "react";
import {
  Search,
  Ban,
  Trash2,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";

interface User {
  chatId: string;
  firstName: string;
  lastName: string;
  username: string;
  isSubscribed: boolean;
  status: string;
  joinDate: string;
  lastActive: string;
  isBlocked: boolean;
}

const SimpleUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError(null);
      setLoading(true);

      // Check server health first
      const healthResponse = await fetch("http://localhost:3001/api/health");
      if (!healthResponse.ok) {
        throw new Error("API server is not running");
      }

      const response = await fetch("http://localhost:3001/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (chatId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${chatId}/block`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    }
  };

  const unblockUser = async (chatId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${chatId}/unblock`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user. Please try again.");
    }
  };

  const deleteUser = async (chatId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${chatId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        await fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string, isBlocked: boolean) => {
    if (isBlocked) return "bg-red-100 text-red-800";

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "dormant":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();
    const username = (user.username || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      username.includes(searchLower) ||
      user.chatId.includes(searchLower)
    );
  });

  if (loading && !lastUpdated) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your bot users</p>
          </div>
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchUsers}
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

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, username, or chat ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-4">
              Users will appear here once they start interacting with your bot.
            </p>
            <div className="text-sm text-gray-500">
              <p>To get users:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Make sure your bot is running (<code>npm run bot</code>)
                </li>
                <li>Search for your bot on Telegram</li>
                <li>
                  Send <code>/start</code> to your bot
                </li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.chatId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold">
                            {(
                              user.firstName?.charAt(0) ||
                              user.username?.charAt(0) ||
                              "U"
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName || "Unknown"} {user.lastName || ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username
                              ? `@${user.username}`
                              : `ID: ${user.chatId}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          user.status,
                          user.isBlocked
                        )}`}
                      >
                        {user.isBlocked ? "blocked" : user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.isSubscribed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-900">
                          {user.isSubscribed ? "Yes" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {user.isBlocked ? (
                          <button
                            onClick={() => unblockUser(user.chatId)}
                            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                            title="Unblock user"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => blockUser(user.chatId)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded transition-colors"
                            title="Block user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.chatId)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No users match your search criteria
        </div>
      )}
    </div>
  );
};

export default SimpleUserManagement;
