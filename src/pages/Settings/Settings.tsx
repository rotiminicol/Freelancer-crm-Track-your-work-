import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const Settings = () => {
  const { user, isDarkMode, toggleDarkMode, loading, error } = useApp();

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Settings</h1>
        <Card className="glass-effect border border-gray-100 dark:border-gray-700 mb-8 transition-shadow focus-within:shadow-lg hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={user?.name || ''}
                  disabled
                  aria-label="Profile name"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  aria-label="Profile email"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                <Button onClick={toggleDarkMode} variant="outline" aria-label="Toggle dark mode">
                  {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border border-gray-100 dark:border-gray-700 transition-shadow focus-within:shadow-lg hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label htmlFor="profile-password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
                <input
                  id="profile-password"
                  type="password"
                  value="********"
                  disabled
                  aria-label="Profile password"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="destructive" disabled aria-disabled="true" aria-label="Delete account">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
