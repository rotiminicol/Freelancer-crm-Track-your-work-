import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DollarSign, Users, Briefcase, TrendingUp, Calendar, Clock, Plus, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import ActivityModal from '../../components/ActivityModal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getTotalEarnings, 
    getTotalClients, 
    getActiveProjects, 
    activities,
    getUpcomingDeadlines,
    isDarkMode 
  } = useApp();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const upcomingDeadlines = getUpcomingDeadlines();

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${getTotalEarnings().toLocaleString()}`,
      icon: DollarSign,
      change: '+12%',
      changeType: 'increase',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Clients',
      value: getTotalClients().toString(),
      icon: Users,
      change: '+3',
      changeType: 'increase',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Projects',
      value: getActiveProjects().toString(),
      icon: Briefcase,
      change: '+2',
      changeType: 'increase',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
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
        return Activity;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else {
      return `${days} days`;
    }
  };

  // Simple sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 20);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back! Here's an overview of your business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.title} className="glass-effect hover:shadow-card transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.borderColor} border`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.title}
                    </p>
                    {/* Simple sparkline */}
                    <div className="flex items-end space-x-1 h-8 mt-3">
                      {generateSparklineData().map((value, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm ${stat.color.replace('text-', 'bg-')} opacity-60`}
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsActivityModalOpen(true)}
                    className="text-sm"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div 
                        key={activity.id} 
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                          <ActivityIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {activity.message}
                          </p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleQuickAction('client')}
                    className="w-full justify-start h-12"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                  <Button
                    onClick={() => handleQuickAction('project')}
                    className="w-full justify-start h-12"
                    variant="outline"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                  <Button
                    onClick={() => handleQuickAction('invoice')}
                    className="w-full justify-start h-12"
                    variant="outline"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button
                    onClick={() => navigate('/projects-invoices')}
                    className="w-full justify-start h-12"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          {upcomingDeadlines.length > 0 && (
            <Card className="mt-6 glass-effect">
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 3).map((deadline) => (
                    <div 
                      key={deadline.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(deadline.priority)}`}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {deadline.title}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {deadline.clientName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDeadline(deadline.dueDate)}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(deadline.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Activity Modal */}
      {isActivityModalOpen && (
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
