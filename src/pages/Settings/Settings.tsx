
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Moon, Sun, LogOut, Save } from 'lucide-react';

const Settings = () => {
  const { user, updateUser, isDarkMode, toggleTheme, logout } = useApp();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    updateUser(formData);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className={`p-4 lg:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Information
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Update your account profile information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="space-y-6">
            {/* Theme Settings */}
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Sun className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Appearance
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toggle dark mode
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 border-dashed ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700' 
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                } transition-all duration-200`}
              >
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                }`}>
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-600" />
                  )}
                </div>
              </button>
            </div>

            {/* Account Actions */}
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-red-100">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Account
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sign out of your account
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center p-3 text-red-600 border-2 border-dashed border-red-300 hover:border-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>

            {/* Account Stats */}
            <div className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border shadow-sm`}>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Account Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Member since
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date().getFullYear()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Account type
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={() => setShowLogoutConfirm(false)}
              />

              {/* Modal */}
              <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-xl rounded-2xl`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-red-100">
                    <LogOut className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Sign Out
                    </h3>
                  </div>
                </div>

                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Are you sure you want to sign out of your account?
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
