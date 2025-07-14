import React from 'react';
import { TrendingUp, Users, MessageSquare, Globe } from 'lucide-react';

const Analytics: React.FC = () => {
  const stats = [
    {
      title: 'Total Messages Sent',
      value: '45,892',
      change: '+12.5%',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: '1,923',
      change: '+8.2%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Subscription Rate',
      value: '67.4%',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Countries Reached',
      value: '23',
      change: '+2',
      icon: Globe,
      color: 'bg-orange-500'
    }
  ];

  const monthlyData = [
    { month: 'Jan', users: 820, messages: 12400 },
    { month: 'Feb', users: 945, messages: 14200 },
    { month: 'Mar', users: 1150, messages: 17300 },
    { month: 'Apr', users: 1340, messages: 20100 },
    { month: 'May', users: 1580, messages: 23700 },
    { month: 'Jun', users: 1923, messages: 28850 }
  ];

  const topCountries = [
    { country: 'United States', users: 456, percentage: 23.7 },
    { country: 'India', users: 289, percentage: 15.0 },
    { country: 'United Kingdom', users: 234, percentage: 12.2 },
    { country: 'Germany', users: 198, percentage: 10.3 },
    { country: 'Canada', users: 167, percentage: 8.7 },
    { country: 'France', users: 145, percentage: 7.5 },
    { country: 'Australia', users: 123, percentage: 6.4 },
    { country: 'Others', users: 311, percentage: 16.2 }
  ];

  const recentActivity = [
    { type: 'subscription', count: 45, time: 'Last 24 hours' },
    { type: 'message', count: 1287, time: 'Last 24 hours' },
    { type: 'unsubscribe', count: 8, time: 'Last 24 hours' },
    { type: 'error', count: 3, time: 'Last 24 hours' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor your bot's performance and user engagement</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Over Time</h2>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">{data.users} users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">{data.messages.toLocaleString()} messages</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Users by Country</h2>
          <div className="space-y-3">
            {topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">{country.country}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{country.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm capitalize">{activity.type}s</span>
                <span className="text-2xl font-bold text-gray-900">{activity.count}</span>
              </div>
              <p className="text-gray-500 text-xs">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;