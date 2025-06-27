
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DollarSign, Users, Briefcase, TrendingUp, Calendar, Clock, Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getTotalEarnings, 
    getTotalClients, 
    getActiveProjects, 
    activities,
    isDarkMode 
  } = useApp();

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${getTotalEarnings().toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Clients',
      value: getTotalClients().toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Active Projects',
      value: getActiveProjects().toString(),
      icon: Briefcase,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      change: '+2',
      changeType: 'increase'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client':
        return Users;
      case 'project':
        return Briefcase;
      case 'invoice':
        return DollarSign;
      default:
        return Clock;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'client':
        navigate('/clients');
        break;
      case 'project':
        navigate('/projects-invoices');
        break;
      case 'invoice':
        navigate('/projects-invoices');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back! Here's what's happening with your business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } rounded-xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stat.title}
                      </p>
                      <p className={`text-xl sm:text-2xl font-bold mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                        <span className="text-xs sm:text-sm text-green-600 font-medium">
                          {stat.change}
                        </span>
                        <span className={`text-xs sm:text-sm ml-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.color} ml-4`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recent Activity */}
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-4 sm:p-6 border shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-base sm:text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h2>
                <button className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                } font-medium transition-colors`}>
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        activity.type === 'client' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'project' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <ActivityIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {activity.message}
                        </p>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-4 sm:p-6 border shadow-sm`}>
              <h2 className={`text-base sm:text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <button 
                  onClick={() => handleQuickAction('client')}
                  className={`w-full flex items-center p-3 sm:p-4 rounded-lg border-2 border-dashed transition-all duration-200 group ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="ml-3 sm:ml-4 text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Add New Client
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Create a new client profile
                    </p>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('project')}
                  className={`w-full flex items-center p-3 sm:p-4 rounded-lg border-2 border-dashed transition-all duration-200 group ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="ml-3 sm:ml-4 text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Create Project
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Start a new project
                    </p>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('invoice')}
                  className={`w-full flex items-center p-3 sm:p-4 rounded-lg border-2 border-dashed transition-all duration-200 group ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="ml-3 sm:ml-4 text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Send Invoice
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Create and send an invoice
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming section */}
          <div className={`mt-6 sm:mt-8 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl p-4 sm:p-6 border shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-base sm:text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                This Week
              </h2>
              <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            
            <div className="text-center py-8 sm:py-12">
              <Calendar className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              } mb-4`} />
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No upcoming deadlines this week. Great job staying on top of things!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
