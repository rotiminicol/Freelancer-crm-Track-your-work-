
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DollarSign, Users, Briefcase, TrendingUp, Calendar, Clock, Plus, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getTotalEarnings, 
    getTotalClients, 
    getActiveProjects, 
    activities,
    isDarkMode 
  } = useApp();

  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${getTotalEarnings().toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      change: '+12%',
      changeType: 'increase',
      gradient: 'from-green-400 via-green-500 to-emerald-600'
    },
    {
      title: 'Total Clients',
      value: getTotalClients().toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      change: '+3',
      changeType: 'increase',
      gradient: 'from-blue-400 via-blue-500 to-cyan-600'
    },
    {
      title: 'Active Projects',
      value: getActiveProjects().toString(),
      icon: Briefcase,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      change: '+2',
      changeType: 'increase',
      gradient: 'from-purple-400 via-purple-500 to-pink-600'
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
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) translateY(${scrollY * 0.1}px)`,
            top: '10%',
            left: '20%',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/10 to-yellow-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px) translateY(${scrollY * 0.15}px)`,
            top: '60%',
            right: '10%',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) translateY(${scrollY * 0.08}px)`,
            bottom: '20%',
            left: '50%',
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with 3D effect */}
          <div className="mb-8 transform-gpu">
            <div 
              className="relative"
              style={{
                transform: `translateY(${scrollY * 0.05}px)`,
              }}
            >
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse ${
                isDarkMode ? 'drop-shadow-lg' : ''
              }`}>
                Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back! Here's what's happening with your business.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid with 3D Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`group relative ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
                  } rounded-2xl p-4 sm:p-6 border backdrop-blur-md transform-gpu transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    transform: `translateY(${scrollY * 0.02 * (index + 1)}px)`,
                  }}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stat.title}
                      </p>
                      <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${stat.gradient} group-hover:bg-clip-text transition-all duration-300`}>
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 animate-bounce" />
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
                    <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${stat.color} ml-4 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Recent Activity with 3D effect */}
            <div 
              className={`group ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              } rounded-2xl p-4 sm:p-6 border backdrop-blur-md transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}
              style={{
                transform: `translateY(${scrollY * 0.03}px)`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-base sm:text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
                  Recent Activity
                </h2>
                <button className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                } font-medium transition-all duration-300 hover:scale-110`}>
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {activities.slice(0, 5).map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50/50 hover:scale-105 transform-gpu"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-12 ${
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

            {/* Quick Actions with enhanced 3D effects */}
            <div 
              className={`group ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
              } rounded-2xl p-4 sm:p-6 border backdrop-blur-md transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20`}
              style={{
                transform: `translateY(${scrollY * 0.04}px)`,
              }}
            >
              <h2 className={`text-base sm:text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300`}>
                Quick Actions
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <button 
                  onClick={() => handleQuickAction('client')}
                  className={`w-full flex items-center p-3 sm:p-4 rounded-xl border-2 border-dashed transition-all duration-500 group/btn transform-gpu hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50 hover:shadow-blue-500/20' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-blue-500/20'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover/btn:bg-blue-200 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">
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
                  className={`w-full flex items-center p-3 sm:p-4 rounded-xl border-2 border-dashed transition-all duration-500 group/btn transform-gpu hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50 hover:shadow-purple-500/20' 
                      : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50/50 hover:shadow-purple-500/20'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover/btn:bg-purple-200 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">
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
                  className={`w-full flex items-center p-3 sm:p-4 rounded-xl border-2 border-dashed transition-all duration-500 group/btn transform-gpu hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700/50 hover:shadow-green-500/20' 
                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50/50 hover:shadow-green-500/20'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover/btn:bg-green-200 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all duration-300">
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

          {/* Upcoming section with parallax */}
          <div 
            className={`mt-6 sm:mt-8 ${
              isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            } rounded-2xl p-4 sm:p-6 border backdrop-blur-md transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20`}
            style={{
              transform: `translateY(${scrollY * 0.02}px)`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-base sm:text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                This Week
              </h2>
              <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } animate-pulse`} />
            </div>
            
            <div className="text-center py-8 sm:py-12">
              <Calendar className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              } mb-4 animate-bounce`} />
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
