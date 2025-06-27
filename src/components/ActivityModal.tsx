
import React from 'react';
import { X, Users, Briefcase, DollarSign, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose }) => {
  const { getAllActivities, isDarkMode } = useApp();
  const allActivities = getAllActivities();

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl transform-gpu transition-all duration-500 hover:scale-105 ${
        isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
      } border backdrop-blur-xl animate-scale-in`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            All Activity
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 transform ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {allActivities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 transform-gpu animate-slide-in-up ${
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg ${
                    activity.type === 'client' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'project' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {activity.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
