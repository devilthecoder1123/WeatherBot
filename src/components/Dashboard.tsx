import React from 'react';
import { Users, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscriptions',
      value: '1,923',
      change: '+8.2%',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: 'Messages Sent Today',
      value: '15,847',
      change: '+23.1%',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Failed Deliveries',
      value: '23',
      change: '-45.2%',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Subscribed to weather updates', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'Unsubscribed from notifications', time: '5 minutes ago' },
    { user: 'Mike Johnson', action: 'Changed notification preferences', time: '8 minutes ago' },
    { user: 'Sarah Wilson', action: 'Subscribed to weather updates', time: '12 minutes ago' },
    { user: 'Tom Brown', action: 'Blocked by admin', time: '15 minutes ago' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your Telegram Weather Bot performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-2">{stat.change}</p>
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
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bot Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bot Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium">Bot Status</span>
              </div>
              <span className="text-green-600 font-semibold">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium">Weather API</span>
              </div>
              <span className="text-blue-600 font-semibold">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-900 font-medium">Database</span>
              </div>
              <span className="text-yellow-600 font-semibold">Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;